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
  activeThreadRef: React.MutableRefObject<string>
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // 跟踪当前正在构建的消息
  let currentAssistantId: string | null = null;
  const toolCallIds: string[] = [];
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
      if (activeThreadRef.current !== threadId) continue;

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
            const lastMsg = prev[prev.length - 1];

            // 累加到当前 assistant 消息
            if (lastMsg?.id === currentAssistantId) {
              return prev.map(m =>
                m.id === currentAssistantId
                  ? { ...m, content: m.content + piece, status: 'streaming' as const }
                  : m
              );
            } else {
              // 新的 assistant 消息开始，删除所有 tool_call loader
              if (toolCallIds.length > 0) {
                prev = prev.filter(m => !toolCallIds.includes(m.id));
                toolCallIds.length = 0;
              }

              // 检查是否有未使用的 typing 占位符
              const typingPlaceholder = !typingPlaceholderUsed
                ? prev.find(m => m.id.startsWith('typing_'))
                : null;

              if (typingPlaceholder) {
                // 复用 typing 占位符
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                currentAssistantId = newId;
                typingPlaceholderUsed = true;
                return prev.map(m =>
                  m.id === typingPlaceholder.id
                    ? { ...m, id: newId, content: piece, status: 'streaming' as const }
                    : m
                );
              } else {
                // 创建新消息
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                currentAssistantId = newId;
                return [
                  ...prev,
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

          // 完成当前 assistant 消息
          if (currentAssistantId) {
            setMessages(prev =>
              prev.map(m => (m.id === currentAssistantId ? { ...m, status: 'success' as const } : m))
            );
            currentAssistantId = null;
          }

          // 添加 tool_call 占位符
          const toolId = `tool_${Date.now()}_${Math.random()}`;
          toolCallIds.push(toolId);

          setMessages(prev => [
            ...prev,
            {
              id: toolId,
              role: 'tool_call' as const,
              content: `正在和${extractColleagueName(toolName)}沟通...`,
              toolName: toolName,
              status: 'loading' as const,
              timestamp: Date.now(),
            },
          ]);
        }
      }
    }

    buffer = normalized;
  };

  // 读取流
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      flushBuffer();

      // 完成最后一条 assistant 消息
      if (currentAssistantId) {
        setMessages(prev =>
          prev.map(m => (m.id === currentAssistantId ? { ...m, status: 'success' as const } : m))
        );
      }

      // 删除所有 tool_call 占位符
      if (toolCallIds.length > 0) {
        setMessages(prev => prev.filter(m => !toolCallIds.includes(m.id)));
      }

      break;
    }
    buffer += decoder.decode(value, { stream: true });
    flushBuffer();
  }
}
