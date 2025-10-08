import { useXAgent } from '@ant-design/x';
import { useCallback, useRef } from 'react';

type MsgRole = 'user' | 'assistant';
type Msg = { role: MsgRole; content: string };

const extractColleagueName = (toolName = ''): string => {
  const match = toolName.match(/(tina|tom|avi)/i);
  if (!match) return '同事';
  const name = match[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const useChatAgent = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef('');

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

        const shownToolCalls = new Set<string>();
        const collected: string[] = [];
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

            const node = meta?.langgraph_node;
            const eventTarget = eventName.split('|')[1] ?? '';
            const isTinaNode = node === 'tina' || node === 'tina_agent' || eventTarget.startsWith('tina_agent');
            if (!isTinaNode) continue;

            const content = Array.isArray(msg?.content)
              ? msg.content
              : typeof msg?.content === 'string'
                ? [{ type: 'text', text: msg.content }]
                : [];

            for (const c of content) {
              if (c?.type === 'text') {
                const piece = String(c.text ?? '');
                if (!piece) continue;
                onUpdate(piece);
                collected.push(piece);
              } else if (c?.type === 'tool_call') {
                const toolId = c?.id ?? `${meta?.run_id}:${meta?.langgraph_step}`;
                if (shownToolCalls.has(toolId)) continue;
                shownToolCalls.add(toolId);

                const hint = `（正在和${extractColleagueName(c?.name)}沟通…）`;
                onUpdate(hint);
                collected.push(hint);
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
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          flushBuffer();
        }

        if (activeThreadRef.current === requestThreadId) {
          onSuccess(collected);
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

  return { agent, abort, setActiveThread };
};
