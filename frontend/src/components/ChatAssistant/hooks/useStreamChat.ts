import { useState, useRef, useCallback } from 'react';
import type { Message } from '../types';
import { processSSEStream } from '../utils/sseParser';
import {
  loadHistoryMessages,
  createUserMessage,
  createTypingPlaceholder,
  createErrorMessage,
} from '../utils/messageHelper';
import { streamChat, cancelRun } from '@/api/chatBotApi';

/**
 * 流式聊天 Hook
 */
export const useStreamChat = (threadId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef(threadId);
  const currentRunIdRef = useRef<string | null>(null);

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
      let wasAborted = false;

      try {
        const res = await streamChat(
          threadId,
          {
            assistant_id: 'graph',
            input: { messages: [{ role: 'user', content }] },
            stream_mode: 'messages-tuple',
            stream_subgraphs: true,
          },
          ac.signal
        );

        if (!res.body) {
          throw new Error('No response body');
        }

        await processSSEStream(res.body, setMessages, threadId, activeThreadRef, currentRunIdRef);
      } catch (e) {
        // 检查是否是中止错误
        if (e instanceof DOMException && e.name === 'AbortError') {
          wasAborted = true;
          // 中止错误：abort() 函数已经处理了消息清理
          return;
        }
        // 其他错误：显示错误消息
        console.error('Stream error:', e);
        setMessages(prev => [...prev, createErrorMessage()]);
      } finally {
        // 只有在正常完成（非中止）的情况下才重置状态
        if (!wasAborted) {
          setIsStreaming(false);
          abortControllerRef.current = null;
        }
      }
    },
    [threadId]
  );

  /**
   * 中止请求并添加 error message
   */
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      // 1. 取消前端 fetch 请求
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);

      // 2. 通知后端中止运行（如果有 run_id）
      if (currentRunIdRef.current) {
        cancelRun(threadId, currentRunIdRef.current);
        currentRunIdRef.current = null;
      }

      // 3. 删除所有 loading/streaming/tool_call 消息，添加 error message
      setMessages(prev => {
        const filtered = prev.filter(
          m => m.status !== 'loading' && m.status !== 'streaming' && m.role !== 'tool_call'
        );
        return [...filtered, createErrorMessage('Response cancelled.')];
      });
    }
  }, [threadId]);

  return {
    messages,
    isStreaming,
    sendMessage,
    abort,
    setMessages,
    loadHistory,
  };
};
