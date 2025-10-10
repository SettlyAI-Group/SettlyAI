/**
 * 消息处理辅助函数
 */

import type { Message } from '../types';

/**
 * 从 thread values 中提取文本内容
 */
export const extractTextContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((c: any) => c?.type === 'text')
      .map((c: any) => String(c.text || ''))
      .join('');
  }

  return '';
};

/**
 * 从 thread values 加载历史消息
 */
export const loadHistoryMessages = (threadValues: Record<string, unknown>): Message[] => {
  if (!threadValues || !threadValues.messages) {
    return [];
  }

  const rawMessages = Array.isArray(threadValues.messages) ? threadValues.messages : [];
  const historyMessages: Message[] = [];

  for (const msg of rawMessages) {
    // 跳过系统消息
    if (msg.type === 'system' || msg.role === 'system') {
      continue;
    }

    const content = extractTextContent(msg.content);
    if (!content.trim()) {
      continue;
    }

    // 解析用户消息
    if (msg.type === 'human' || msg.type === 'HumanMessage' || msg.role === 'user') {
      historyMessages.push({
        id: msg.id || `user_${Date.now()}_${Math.random()}`,
        role: 'user',
        content,
        status: 'success',
        timestamp: Date.now(),
      });
    }
    // 解析 assistant 消息
    else if (msg.type === 'ai' || msg.type === 'AIMessage' || msg.role === 'assistant') {
      historyMessages.push({
        id: msg.id || `assistant_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content,
        status: 'success',
        timestamp: Date.now(),
      });
    }
  }

  return historyMessages;
};

/**
 * 创建用户消息
 */
export const createUserMessage = (content: string): Message => ({
  id: `user_${Date.now()}`,
  role: 'user',
  content,
  status: 'success',
  timestamp: Date.now(),
});

/**
 * 创建 typing 占位符
 */
export const createTypingPlaceholder = (): Message => ({
  id: `typing_${Date.now()}`,
  role: 'assistant',
  content: ' ',
  status: 'loading',
  timestamp: Date.now(),
});

/**
 * 创建错误消息
 */
export const createErrorMessage = (errorText = '抱歉，出现了错误，请重试。'): Message => ({
  id: `error_${Date.now()}`,
  role: 'assistant',
  content: errorText,
  status: 'error',
  timestamp: Date.now(),
});
