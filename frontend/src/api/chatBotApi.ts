import axios from 'axios';
import { string } from 'zod';

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

export default chatBotApi;
