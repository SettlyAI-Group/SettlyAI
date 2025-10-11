/**
 * SSE (Server-Sent Events) 解析工具
 */

import type { Message, SSEMetadata, MessageChunk } from '../types';
import { SUB_AGENTS, TINA_NODES } from '../constants';

/**
 * 提取工具名称中的同事名称
 */
export const extractColleagueName = (toolName = ''): string => {
  const match = toolName.match(/(tom|ivy|levan|avi)/i);
  if (!match) return '同事';
  const name = match[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * 解析 SSE 事件
 */
export const parseSSEEvent = (rawEvent: string): { eventName: string; data: string } => {
  const lines = rawEvent.split('\n');
  let eventName = '';
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const field = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trimStart();
    if (!field) continue;

    if (field === 'event') eventName = value;
    else if (field === 'data') dataLines.push(value);
  }

  return { eventName, data: dataLines.join('\n') };
};

/**
 * 检查是否应该过滤掉该消息
 */
export const shouldFilterMessage = (meta: SSEMetadata): boolean => {
  // 过滤非 Tina 消息
  const node = meta?.langgraph_node;
  if (node && !TINA_NODES.includes(node as any)) {
    return true;
  }

  // 过滤子代理内部消息
  const checkpointNs = meta?.langgraph_checkpoint_ns || meta?.checkpoint_ns;
  if (checkpointNs && SUB_AGENTS.some(agent => checkpointNs.includes(agent))) {
    return true;
  }

  return false;
};

/**
 * 处理 SSE 流
 */
export async function processSSEStream(
  body: ReadableStream<Uint8Array>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  threadId: string,
  activeThreadRef: React.MutableRefObject<string>,
  runIdRef?: React.MutableRefObject<string | null>
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // 跟踪当前正在构建的消息
  let currentAssistantId: string | null = null;
  let typingPlaceholderUsed = false;

  const flushBuffer = () => {
    let normalized = buffer.replace(/\r\n/g, '\n');
    let searchIndex: number;

    while ((searchIndex = normalized.indexOf('\n\n')) !== -1) {
      const rawEvent = normalized.slice(0, searchIndex);
      normalized = normalized.slice(searchIndex + 2);

      const { eventName, data } = parseSSEEvent(rawEvent);
      if (!data || data === '[DONE]' || data.startsWith(':')) continue;

      // 检查线程是否切换
      if (activeThreadRef.current !== threadId) {
        continue;
      }

      // 捕获 run_id（从 metadata 事件）
      if (eventName === 'metadata' && runIdRef) {
        try {
          const metadata = JSON.parse(data);
          if (metadata.run_id) {
            runIdRef.current = metadata.run_id;
          }
        } catch {
          // 忽略解析错误
        }
      }

      // 跳过非 messages 事件
      if (eventName && !eventName.startsWith('messages|')) {
        continue;
      }

      let msg: MessageChunk;
      let meta: SSEMetadata;
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          [msg, meta] = parsed;
        } else {
          continue;
        }
      } catch {
        continue;
      }

      // 过滤消息
      if (shouldFilterMessage(meta)) {
        continue;
      }

      const content = Array.isArray(msg?.content) ? msg.content : [];


      for (const c of content) {
        // 处理文本消息
        if (c?.type === 'text') {
          const piece = String(c.text ?? '');
          if (!piece) continue;

          setMessages(prev => {
            console.log('📝 收到文本:', piece.slice(0, 20));

            // 检查是否已经有 streaming 状态的 assistant 消息（从最后往前找，找最新的）
            const streamingAssistants = prev.filter(m => m.role === 'assistant' && m.status === 'streaming');
            const streamingAssistant = streamingAssistants[streamingAssistants.length - 1];

            // 累加到当前 assistant 消息
            if (streamingAssistant) {
              console.log('➕ 累加到:', streamingAssistant.id);
              return prev.map(m =>
                m.id === streamingAssistant.id
                  ? { ...m, content: m.content + piece, status: 'streaming' as const }
                  : m
              );
            } else {
              console.log('🆕 新消息开始');
              // 新的 assistant 消息开始
              let updated = prev;

              // 删除所有 tool_call loader
              const toolCallMessages = updated.filter(m => m.role === 'tool_call');
              if (toolCallMessages.length > 0) {
                console.log('🗑️ 删除 tool_call:', toolCallMessages.length);
                updated = updated.filter(m => m.role !== 'tool_call');
              }

              // 检查是否有未使用的 typing 占位符（找最后一个，即最新的）
              const typingPlaceholders = updated.filter(m => m.id.startsWith('typing_'));
              const typingPlaceholder = typingPlaceholders[typingPlaceholders.length - 1];

              console.log('🔍 typing 数量:', typingPlaceholders.length, '找到:', !!typingPlaceholder);

              if (typingPlaceholder) {
                // 复用 typing 占位符
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                // 更新外部变量（注意：Strict Mode 会调用两次，但这是幂等的）
                currentAssistantId = newId;
                typingPlaceholderUsed = true;

                console.log('♻️ 复用 typing');

                return updated.map(m =>
                  m.id === typingPlaceholder.id
                    ? { ...m, id: newId, content: piece, status: 'streaming' as const }
                    : m
                );
              } else {
                // 创建新消息
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                currentAssistantId = newId;

                console.log('✨ 创建新消息');

                return [
                  ...updated,
                  {
                    id: newId,
                    role: 'assistant' as const,
                    content: piece,
                    status: 'streaming' as const,
                    timestamp: Date.now(),
                  },
                ];
              }
            }
          });
        }

        // 处理工具调用
        else if (c?.type === 'tool_use') {
          const toolName = c?.name || 'unknown';

          console.log('🔧 工具调用:', toolName);

          setMessages(prev => {
            // 完成当前 streaming 的 assistant 消息
            let updated = prev.map(m =>
              m.role === 'assistant' && m.status === 'streaming'
                ? { ...m, status: 'success' as const }
                : m
            );

            const toolCallId = `tool_${Date.now()}_${Math.random()}`;

            // 添加 tool_call 占位符
            return [
              ...updated,
              {
                id: toolCallId,
                role: 'tool_call' as const,
                content: `正在和${extractColleagueName(toolName)}沟通...`,
                toolName: toolName,
                status: 'loading' as const,
                timestamp: Date.now(),
              },
            ];
          });

          // 重置标志，以便下次可以复用新的 placeholder
          currentAssistantId = null;
          typingPlaceholderUsed = false;
          console.log('🔄 重置标志');
        }
      }
    }

    buffer = normalized;
  };

  // 读取流
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log('🏁 流结束');
      buffer += decoder.decode();
      flushBuffer();

      // 完成最后一条 streaming 消息，并删除所有 tool_call 占位符
      setMessages(prev => {
        let updated = prev.map(m =>
          m.role === 'assistant' && m.status === 'streaming'
            ? { ...m, status: 'success' as const }
            : m
        );
        // 删除所有 tool_call 占位符
        const toolCallCount = updated.filter(m => m.role === 'tool_call').length;
        if (toolCallCount > 0) {
          console.log('🗑️ 删除 tool_call:', toolCallCount);
        }
        updated = updated.filter(m => m.role !== 'tool_call');

        return updated;
      });

      break;
    }
    buffer += decoder.decode(value, { stream: true });
    flushBuffer();
  }
}
