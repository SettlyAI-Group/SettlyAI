import { useXAgent } from '@ant-design/x';
import { useCallback, useRef } from 'react';

type MsgRole = 'user' | 'assistant' | 'tool_call';
type Msg = {
  role: MsgRole;
  content: string;
  toolName?: string; // 工具名称，仅当 role === 'tool_call' 时有值
};

type MessageWithId = {
  id: string | number;
  message: Msg;
  status: 'local' | 'loading' | 'updating' | 'success' | 'error';
};

const extractColleagueName = (toolName = ''): string => {
  const match = toolName.match(/(tom|ivy|levan)/i);
  if (!match) return '同事';
  const name = match[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const useChatAgent = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef('');
  const setMessagesRef = useRef<((updater: (prev: MessageWithId[]) => MessageWithId[]) => void) | null>(null);

  const [agent] = useXAgent<Msg>({
    request: async (info: any, { onUpdate, onSuccess, onError, onStream }: any) => {
      const ac = new AbortController();
      onStream?.(ac);

      // 在请求开始时就设置当前线程ID
      const requestThreadId = info.threadId;
      activeThreadRef.current = requestThreadId;

      try {
        const res = await fetch(`/langgraph/threads/${requestThreadId}/runs/stream`, {
          method: 'POST',
          signal: ac.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assistant_id: 'graph',
            input: { messages: [info.message] },
            stream_mode: 'messages-tuple',
            stream_subgraphs: true,
          }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        abortControllerRef.current = ac;

        const setMessages = setMessagesRef.current;
        const shownToolCalls = new Set<string>();
        let currentAssistantMsgId: string | null = null; // 当前正在构建的 assistant 消息的 ID
        let messageIdCounter = 0; // 消息 ID 计数器
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const flushBuffer = () => {
          let normalizedBuffer = buffer.replace(/\r\n/g, '\n');
          let searchIndex: number;

          while ((searchIndex = normalizedBuffer.indexOf('\n\n')) !== -1) {
            const rawEvent = normalizedBuffer.slice(0, searchIndex);
            normalizedBuffer = normalizedBuffer.slice(searchIndex + 2);

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

            const data = dataLines.join('\n');
            if (!data || data === '[DONE]' || data.startsWith(':')) continue;
            if (activeThreadRef.current !== requestThreadId) continue;

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

            // ===== 消息过滤逻辑 =====
            const node = meta?.langgraph_node;
            const checkpointNs = meta?.langgraph_checkpoint_ns || meta?.checkpoint_ns;

            // Debug logging
            console.log('[DEBUG] Message chunk:', {
              node,
              checkpointNs,
              msgType: msg?.type,
              contentLength: Array.isArray(msg?.content) ? msg.content.length : 'not-array',
              content: msg?.content,
            });

            // 1. 过滤非 Tina 节点的消息（Tom、Avi、tools 等）
            if (node !== 'tina' && node !== 'tina_agent') {
              console.log('[DEBUG] Filtered: not tina node');
              continue;
            }

            // 2. 过滤子代理的内部消息（Tom/Avi/Ivy/Levan 处理过程）
            const subAgents = ['|tom:', '|avi:', '|ivy:', '|levan:'];
            if (subAgents.some(agent => checkpointNs?.includes(agent))) {
              console.log('[DEBUG] Filtered: sub-agent message');
              continue;
            }

            // ===== 内容处理逻辑 =====
            const content = Array.isArray(msg?.content)
              ? msg.content
              : typeof msg?.content === 'string'
                ? [{ type: 'text', text: msg.content }]
                : [];

            for (const c of content) {
              // 3a. Tina 的对话文本 - 使用 setMessages 实现流式追加
              if (c?.type === 'text') {
                const piece = String(c.text ?? '');
                if (!piece) continue;

                if (setMessages) {
                  setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];

                    // 如果最后一条是当前正在构建的 assistant 消息，追加内容
                    if (lastMsg?.id === currentAssistantMsgId) {
                      return prev.map((msg, i) =>
                        i === prev.length - 1
                          ? {
                              ...msg,
                              message: {
                                ...msg.message,
                                content: msg.message.content + piece,
                              },
                              status: 'updating' as const,
                            }
                          : msg
                      );
                    } else {
                      // 创建新的 assistant 消息
                      const newMsgId = `assistant_${++messageIdCounter}_${Date.now()}`;
                      currentAssistantMsgId = newMsgId;
                      return [
                        ...prev,
                        {
                          id: newMsgId,
                          message: { role: 'assistant' as const, content: piece },
                          status: 'updating' as const,
                        },
                      ];
                    }
                  });
                }
              }
              // 3b. Tina 调用工具 - 创建独立的工具调用消息
              else if (c?.type === 'tool_use') {
                const toolId = c?.id ?? `${meta?.run_id}:${meta?.langgraph_step}`;
                if (shownToolCalls.has(toolId)) continue;
                shownToolCalls.add(toolId);

                if (setMessages) {
                  // 先完成当前的 assistant 消息
                  if (currentAssistantMsgId) {
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === currentAssistantMsgId ? { ...msg, status: 'success' as const } : msg
                      )
                    );
                    currentAssistantMsgId = null;
                  }

                  // 添加工具调用消息（独立显示）
                  setMessages(prev => [
                    ...prev,
                    {
                      id: `tool_${++messageIdCounter}_${Date.now()}`,
                      message: {
                        role: 'tool_call' as const,
                        content: `正在和${extractColleagueName(c?.name)}沟通...`,
                        toolName: c?.name,
                      },
                      status: 'loading' as const, // 🔑 保持 loading 状态
                    },
                  ]);
                }
              }
            }
          }

          buffer = normalizedBuffer;
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            buffer += decoder.decode();
            flushBuffer();

            // 完成最后一条 assistant 消息
            if (currentAssistantMsgId && setMessages) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === currentAssistantMsgId ? { ...msg, status: 'success' as const } : msg
                )
              );
            }
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          flushBuffer();
        }

        if (activeThreadRef.current === requestThreadId) {
          onSuccess([]); // 不需要传递消息，因为已经通过 setMessages 处理了
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          onError(e as Error);
        }
      } finally {
        if (abortControllerRef.current === ac) {
          abortControllerRef.current = null;
        }
      }
    },
  });

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const setActiveThread = useCallback((threadId: string) => {
    activeThreadRef.current = threadId;
  }, []);

  const initSetMessages = useCallback((fn: (updater: (prev: MessageWithId[]) => MessageWithId[]) => void) => {
    setMessagesRef.current = fn;
  }, []);

  return { agent, abort, setActiveThread, initSetMessages };
};
