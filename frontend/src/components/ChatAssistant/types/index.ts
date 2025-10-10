/**
 * 共享类型定义
 */

export type MessageRole = 'user' | 'assistant' | 'tool_call';
export type MessageStatus = 'loading' | 'streaming' | 'success' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  toolName?: string;
  timestamp: number;
}

export interface ConversationItem {
  key: string;
  label: string;
  updatedAt: number;
  isDisabled?: boolean;
  isTyping?: boolean;
  values?: Record<string, unknown>;
}

export interface SSEMetadata {
  langgraph_node?: string;
  langgraph_step?: number;
  langgraph_checkpoint_ns?: string;
  checkpoint_ns?: string;
  run_id?: string;
  thread_id?: string;
}

export interface MessageContent {
  type: 'text' | 'tool_use';
  text?: string;
  name?: string;
  id?: string;
  input?: Record<string, unknown>;
  index?: number;
}

export interface MessageChunk {
  type: string;
  content: MessageContent[];
  usage_metadata?: {
    input_tokens: number;
    output_tokens: number;
  };
}
