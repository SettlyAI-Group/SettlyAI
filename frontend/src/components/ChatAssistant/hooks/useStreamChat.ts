import { useState, useRef, useCallback } from 'react';
import type { Message } from '../types';
import { processSSEStream } from '../utils/sseParser';
import {
  loadHistoryMessages,
  createUserMessage,
  createTypingPlaceholder,
  createErrorMessage,
} from '../utils/messageHelper';

/**
 * 流式聊天 Hook
 */
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
    setMessages([]);
  }

  /**
   * 从 thread values 加载历史消息
   */
  const loadHistory = useCallback((threadValues: Record<string, unknown>) => {
    const historyMessages = loadHistoryMessages(threadValues);
    setMessages(historyMessages);
  }, []);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg = createUserMessage(content);
      const typingPlaceholder = createTypingPlaceholder();

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

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        await processSSEStream(res.body, setMessages, threadId, activeThreadRef);
      } catch (e) {
        // 忽略中止错误
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          console.error('Stream error:', e);
          setMessages(prev => [...prev, createErrorMessage()]);
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [threadId]
  );

  /**
   * 中止请求
   */
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    abort,
    setMessages,
    loadHistory,
  };
};
