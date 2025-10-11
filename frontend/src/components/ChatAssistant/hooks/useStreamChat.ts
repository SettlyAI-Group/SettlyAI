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
      console.log(`🚀 [sendMessage] 开始发送消息，threadId: ${threadId}`);
      const userMsg = createUserMessage(content);
      const typingPlaceholder = createTypingPlaceholder();

      setMessages(prev => [...prev, userMsg, typingPlaceholder]);
      setIsStreaming(true);

      const ac = new AbortController();
      abortControllerRef.current = ac;
      let wasAborted = false;

      try {
        console.log(`📡 [sendMessage] 调用 streamChat API, threadId: ${threadId}`);
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

        console.log(`📥 [sendMessage] 开始处理 SSE 流, threadId: ${threadId}`);
        await processSSEStream(res.body, setMessages, threadId, activeThreadRef, currentRunIdRef);
        console.log(`✅ [sendMessage] SSE 流处理完成, threadId: ${threadId}`);
      } catch (e) {
        // 检查是否是中止错误
        if (e instanceof DOMException && e.name === 'AbortError') {
          wasAborted = true;
          console.log(`⚠️ [sendMessage] AbortError 捕获，threadId: ${threadId}`);
          // 中止错误：abort() 函数已经处理了消息清理
          return;
        }
        // 其他错误：显示错误消息
        console.error(`❌ [sendMessage] Stream error, threadId: ${threadId}:`, e);
        setMessages(prev => [...prev, createErrorMessage()]);
      } finally {
        // 只有在正常完成（非中止）的情况下才重置状态
        if (!wasAborted) {
          console.log(`🏁 [sendMessage] 正常完成，重置状态, threadId: ${threadId}`);
          setIsStreaming(false);
          abortControllerRef.current = null;
        } else {
          console.log(`🛑 [sendMessage] 已中止，不重置状态, threadId: ${threadId}`);
        }
      }
    },
    [threadId]
  );

  /**
   * 中止请求并添加 error message
   */
  const abort = useCallback(() => {
    console.log(`🛑 [abort] 调用 abort(), threadId: ${threadId}, hasAbortController: ${!!abortControllerRef.current}`);
    if (abortControllerRef.current) {
      // 1. 取消前端 fetch 请求
      console.log(`❌ [abort] 取消前端请求, threadId: ${threadId}`);
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);

      // 2. 通知后端中止运行（如果有 run_id）
      if (currentRunIdRef.current) {
        console.log(`📞 [abort] 通知后端取消 run_id: ${currentRunIdRef.current}, threadId: ${threadId}`);
        cancelRun(threadId, currentRunIdRef.current);
        currentRunIdRef.current = null;
      }

      // 3. 删除所有 loading/streaming/tool_call 消息，添加 error message
      console.log(`🗑️ [abort] 清理消息并添加错误提示, threadId: ${threadId}`);
      setMessages(prev => {
        const filtered = prev.filter(
          m => m.status !== 'loading' && m.status !== 'streaming' && m.role !== 'tool_call'
        );
        return [...filtered, createErrorMessage('Response cancelled.')];
      });
    } else {
      console.log(`⚪ [abort] 没有 abortController，忽略, threadId: ${threadId}`);
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
