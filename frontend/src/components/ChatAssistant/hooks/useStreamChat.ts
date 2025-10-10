import { useState, useRef, useCallback } from 'react';

// ============ 类型定义 ============
export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'tool_call';
  content: string;
  status: 'loading' | 'streaming' | 'success' | 'error';
  toolName?: string;
  timestamp: number;
};

// ============ 工具函数 ============
const extractColleagueName = (toolName = ''): string => {
  const match = toolName.match(/(tom|ivy|levan|avi)/i);
  if (!match) return '同事';
  const name = match[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const parseSSEEvent = (rawEvent: string): { eventName: string; data: string } => {
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

// ============ SSE 流处理 ============
async function processSSEStream(
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
  let typingPlaceholderUsed = false;  // 🔑 标记 typing 占位符是否已被使用

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
      if (eventName && !eventName.startsWith('messages|')) continue;

      let msg: any, meta: any;
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

      // 过滤非 Tina 消息
      const node = meta?.langgraph_node;
      if (node !== 'tina' && node !== 'tina_agent') continue;

      // 过滤子代理内部消息
      const checkpointNs = meta?.langgraph_checkpoint_ns || meta?.checkpoint_ns;
      const subAgents = ['|tom:', '|avi:', '|ivy:', '|levan:'];
      if (subAgents.some(agent => checkpointNs?.includes(agent))) continue;

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
                m.id === currentAssistantId ? { ...m, content: m.content + piece, status: 'streaming' as const } : m
              );
            } else {
              // 🔑 新的 assistant 消息开始，删除所有 tool_call loader
              if (toolCallIds.length > 0) {
                console.log('🗑️ [text] 删除 tool_call loader（新消息开始）');
                prev = prev.filter(m => !toolCallIds.includes(m.id));
                toolCallIds.length = 0; // 清空数组
              }

              // 检查是否有未使用的 typing 占位符
              const typingPlaceholder = !typingPlaceholderUsed
                ? prev.find(m => m.id.startsWith('typing_'))
                : null;

              if (typingPlaceholder) {
                // ✅ 复用 typing 占位符，改变 ID 防止下次被找到
                console.log('🔄 [text] 复用 typing:', typingPlaceholder.id);
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                currentAssistantId = newId;
                typingPlaceholderUsed = true;
                return prev.map(m =>
                  m.id === typingPlaceholder.id
                    ? { ...m, id: newId, content: piece, status: 'streaming' as const }
                    : m
                );
              } else {
                // 没有 typing 占位符或已使用，创建新消息
                const newId = `assistant_${Date.now()}_${Math.random()}`;
                console.log('🆕 [text] 创建新消息:', newId);
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
          console.log(`🔧 [tool_use] 收到: ${toolName}`);

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

          console.log(`🔧 [tool_call] 添加 loader: ${extractColleagueName(toolName)}`);
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

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log('🏁 [processSSE] SSE 流结束');
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
        console.log('🗑️ [完成] 删除 tool_call loader');
        setMessages(prev => prev.filter(m => !toolCallIds.includes(m.id)));
      }

      break;
    }
    buffer += decoder.decode(value, { stream: true });
    flushBuffer();
  }
}

// ============ Hook ============
export const useStreamChat = (threadId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef(threadId);

  // 更新活动线程并清空消息
  const prevThreadIdRef = useRef(threadId);
  if (prevThreadIdRef.current !== threadId) {
    prevThreadIdRef.current = threadId;
    activeThreadRef.current = threadId;
    setMessages([]); // 切换线程时清空消息
  }

  // 发送消息
  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
        status: 'success',
        timestamp: Date.now(),
      };

      // 创建 typing 占位符
      const typingPlaceholder: Message = {
        id: `typing_${Date.now()}`,
        role: 'assistant',
        content: ' ', // 使用空格而不是空字符串，触发 typing 动画
        status: 'loading', // 使用 loading 状态触发 typing 动画
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, userMsg, typingPlaceholder]);
      setIsStreaming(true);

      const ac = new AbortController();
      abortControllerRef.current = ac;

      try {
        const res = await fetch(`/langgraph/threads/${threadId}/runs/stream`, {
          method: 'POST',
          signal: ac.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assistant_id: 'graph',
            input: { messages: [{ role: 'user', content }] },
            stream_mode: 'messages-tuple',
            stream_subgraphs: true,
          }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        await processSSEStream(res.body, setMessages, threadId, activeThreadRef);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          console.error('Stream error:', e);
          setMessages(prev => [
            ...prev,
            {
              id: `error_${Date.now()}`,
              role: 'assistant',
              content: '抱歉，出现了错误，请重试。',
              status: 'error',
              timestamp: Date.now(),
            },
          ]);
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [threadId]
  );

  // 中止请求
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, sendMessage, abort, setMessages };
};
