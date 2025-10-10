import axios from 'axios';

// TODO: remove this when finish cros setup
const chatBotApi = axios.create({
  baseURL: '/langgraph',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateThreadPayload {
  metadata: {
    user_id: string;
    user_type: string;
  };
  ttl?: {
    strategy: 'delete' | 'preserve';
    ttl: number;
  };
}

export interface ThreadResponse {
  thread_id: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
  status?: string;
  values?: {
    messages?: unknown[];
  };
}

export interface SearchThreadsPayload {
  ids?: string[];
  metadata?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  sort_by?: 'updated_at' | 'created_at';
  sort_order?: 'asc' | 'desc';
  select?: string[];
}

export const searchThreads = async (payload: SearchThreadsPayload): Promise<ThreadResponse[]> => {
  const { data } = await chatBotApi.post<ThreadResponse[]>('/threads/search', payload);
  return data;
};

export const createThread = async (payload: CreateThreadPayload): Promise<ThreadResponse> => {
  const { data } = await chatBotApi.post<ThreadResponse>('/threads', payload);
  return data;
};

export const deleteThread = async (threadId: string): Promise<void> => {
  await chatBotApi.delete(`/threads/${threadId}`);
};

export interface UpdateThreadPayload {
  metadata?: Record<string, unknown>;
  values?: Record<string, unknown>;
}

export const updateThread = async (threadId: string, payload: UpdateThreadPayload): Promise<ThreadResponse> => {
  const { data } = await chatBotApi.patch<ThreadResponse>(`/threads/${threadId}`, payload);
  return data;
};

/**
 * 流式聊天 API
 */
export interface StreamChatPayload {
  assistant_id: string;
  input: {
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  };
  stream_mode: 'messages-tuple' | 'messages' | 'events';
  stream_subgraphs?: boolean;
}

export const streamChat = async (
  threadId: string,
  payload: StreamChatPayload,
  signal?: AbortSignal
): Promise<Response> => {
  // 使用原生 fetch 因为需要处理 SSE 流
  const response = await fetch(`/langgraph/threads/${threadId}/runs/stream`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
};

/**
 * 取消运行 API
 */
export const cancelRun = async (threadId: string, runId: string): Promise<void> => {
  try {
    await chatBotApi.post(`/threads/${threadId}/runs/${runId}/cancel`);
  } catch (error) {
    // 忽略错误：即使取消失败，前端也已经停止接收
    console.warn('Failed to cancel run:', error);
  }
};

export default chatBotApi;
