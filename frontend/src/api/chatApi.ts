import httpClient from './httpClient';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSSEOptions {
  onMessage: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  signal?: AbortSignal;
}

export interface ConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

/**
 * 解析 SSE 数据行，提取内容
 */
const parseSSEData = (data: string): string | null => {
  if (data === '[DONE]') {
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    const content = parsed.choices?.[0]?.delta?.content || parsed.content || '';
    return content || null;
  } catch {
    // 如果不是 JSON，直接作为文本处理
    return data || null;
  }
};

/**
 * 处理 SSE 数据流
 */
const processSSELine = (line: string, onMessage: (chunk: string) => void): boolean => {
  if (!line.startsWith('data: ')) {
    return false;
  }

  const data = line.slice(6).trim();

  if (data === '[DONE]') {
    return true; // 表示完成
  }

  const content = parseSSEData(data);
  if (content) {
    onMessage(content);
  }

  return false;
};

/**
 * 读取 SSE 流
 */
const readSSEStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onMessage: (chunk: string) => void,
  onComplete?: () => void
): Promise<void> => {
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      onComplete?.();
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      const isDone = processSSELine(line, onMessage);
      if (isDone) {
        onComplete?.();
        return;
      }
    }
  }
};

/**
 * 发送聊天消息并接收 SSE 流式响应
 */
export const sendChatMessage = async (
  messages: ChatMessage[],
  options: ChatSSEOptions
): Promise<void> => {
  const { onMessage, onError, onComplete, signal } = options;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ messages }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    await readSSEStream(reader, onMessage, onComplete);
  } catch (error) {
    if (error instanceof Error) {
      onError?.(error);
    } else {
      onError?.(new Error('Unknown error occurred'));
    }
  }
};

/**
 * 获取对话列表
 */
export const fetchConversations = async (): Promise<ConversationResponse[]> => {
  const { data } = await httpClient.get<ConversationResponse[]>('/chat/conversations');
  return data;
};

/**
 * 获取某个对话的消息历史
 */
export const fetchConversationMessages = async (
  conversationId: string
): Promise<MessageResponse[]> => {
  const { data } = await httpClient.get<MessageResponse[]>(`/chat/conversations/${conversationId}/messages`);
  return data;
};
