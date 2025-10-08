import { useCallback, useEffect, useRef, useState } from 'react';
import { createThread as createThreadApi, deleteThread as deleteThreadApi, searchThreads } from '@/api/chatBotApi';

export interface ConversationItem {
  key: string;
  label: string;
  updatedAt: number;
  isDisabled?: boolean;
}

const THREAD_TTL_SECONDS = 600;

const normalizeMessages = (raw: any[] = []) => {
  return raw.map((m: any, i: number) => {
    const role = m.role ?? (m.type === 'human' || m.type === 'HumanMessage' ? 'user' : 'assistant');
    const text =
      typeof m.content === 'string'
        ? m.content
        : Array.isArray(m.content)
          ? m.content.filter((c: any) => c?.type === 'text').map((c: any) => c.text).join('')
          : (m.text ?? m.value ?? '');
    return { id: m.id ?? String(i), role, text };
  });
};

interface UseChatThreadOptions {
  userChatId: string | null;
  onMessagesLoaded?: (messages: any[]) => void;
  onAbort?: () => void;
}

export const useChatThread = ({ userChatId, onMessagesLoaded, onAbort }: UseChatThreadOptions) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeThreadRef = useRef('');
  const onMessagesLoadedRef = useRef(onMessagesLoaded);

  // 更新 ref
  useEffect(() => {
    onMessagesLoadedRef.current = onMessagesLoaded;
  }, [onMessagesLoaded]);

  useEffect(() => {
    activeThreadRef.current = activeKey;
  }, [activeKey]);

  const updateConversation = useCallback((key: string, updates: Partial<ConversationItem>) => {
    setConversations(prev => prev.map(item => (item.key === key ? { ...item, ...updates } : item)));
  }, []);

  // 加载会话列表
  useEffect(() => {
    if (!userChatId) return;

    const fetchThreads = async () => {
      try {
        const threads = await searchThreads({
          metadata: { user_id: userChatId },
          limit: 20,
          offset: 0,
          sort_by: 'updated_at',
          sort_order: 'desc',
          select: ['thread_id', 'created_at', 'updated_at', 'status', 'metadata', 'values'],
        });

        const mapped: ConversationItem[] = threads.map(thread => ({
          key: thread.thread_id,
          label: 'New Chat',
          updatedAt: new Date(thread.updated_at || thread.created_at || Date.now()).getTime(),
        }));

        setConversations(prev => {
          const previousMap = new Map(prev.map(item => [item.key, item]));
          return mapped.map(item => {
            const prevItem = previousMap.get(item.key);
            return {
              ...item,
              label: prevItem?.label ?? item.label,
              isDisabled: prevItem?.isDisabled ?? false,
            };
          });
        });

        if (threads.length === 0) {
          setActiveKey('');
          onMessagesLoadedRef.current?.([]);
          return;
        }

        const first = threads[0];
        setActiveKey(first.thread_id);

        const uiMsgs = normalizeMessages(first.values?.messages ?? []);
        const historyMessages = uiMsgs.map((m, index) => ({
          id: `history_${index}`,
          status: 'success' as const,
          message: { role: m.role as 'user' | 'assistant', content: m.text },
        }));
        onMessagesLoadedRef.current?.(historyMessages);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setErrorMessage('Failed to load your chat history.');
      }
    };

    fetchThreads();
  }, [userChatId]);

  // 创建新会话
  const handleNewChat = useCallback(async () => {
    if (!userChatId || isCreatingThread) return;

    onAbort?.();
    setIsCreatingThread(true);
    setErrorMessage(null);

    try {
      const thread = await createThreadApi({
        metadata: { user_id: userChatId, user_type: 'Guest' },
        ttl: { strategy: 'delete', ttl: THREAD_TTL_SECONDS },
      });

      const newConversation: ConversationItem = {
        key: thread.thread_id,
        label: 'New Chat',
        updatedAt: new Date(thread?.updated_at || thread?.created_at || Date.now()).getTime(),
        isDisabled: false,
      };

      setConversations(prev => {
        const next = [newConversation, ...prev.filter(item => item.key !== thread.thread_id)];
        return next.sort((a, b) => b.updatedAt - a.updatedAt);
      });
      setActiveKey(thread.thread_id);
      onMessagesLoadedRef.current?.([]);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [userChatId, isCreatingThread, onAbort]);

  // 切换会话
  const handleActiveChange = useCallback(
    async (key: string) => {
      if (!key || key === activeKey) return;

      const targetConversation = conversations.find(item => item.key === key);
      if (targetConversation?.isDisabled) return;

      onAbort?.();
      setActiveKey(key);
      setErrorMessage(null);
      onMessagesLoadedRef.current?.([]);

      try {
        const [thread] = await searchThreads({
          ids: [key],
          limit: 1,
          select: ['values'],
        });

        const uiMsgs = normalizeMessages(thread?.values?.messages ?? []);
        const historyMessages = uiMsgs.map((m, index) => ({
          id: `history_${index}`,
          status: 'success' as const,
          message: { role: m.role as 'user' | 'assistant', content: m.text },
        }));

        // 只有在仍然是当前活动线程时才加载消息
        if (activeThreadRef.current === key) {
          onMessagesLoadedRef.current?.(historyMessages);
        }
      } catch (e) {
        console.error(e);
        setErrorMessage('Failed to load this conversation.');
        if (activeThreadRef.current === key) {
          onMessagesLoadedRef.current?.([]);
        }
      }
    },
    [activeKey, conversations, onAbort]
  );

  // 删除会话
  const handleDeleteConversation = useCallback(
    async (key: string) => {
      if (!key) return;

      const isActive = activeKey === key;
      setErrorMessage(null);

      try {
        await deleteThreadApi(key);

        let nextActiveKey: string | null = null;
        setConversations(prev => {
          const filtered = prev.filter(item => item.key !== key);
          nextActiveKey = filtered.length > 0 ? filtered[0].key : null;
          return filtered;
        });

        if (isActive) {
          if (nextActiveKey) {
            await handleActiveChange(nextActiveKey);
          } else {
            setActiveKey('');
            onMessagesLoadedRef.current?.([]);
          }
        }
      } catch (error) {
        console.error('Failed to delete thread:', error);
        setErrorMessage('Failed to delete conversation.');
      }
    },
    [activeKey, handleActiveChange]
  );

  // 切换禁用状态
  const handleToggleDisable = useCallback(
    (key: string) => {
      const target = conversations.find(item => item.key === key);
      updateConversation(key, { isDisabled: !target?.isDisabled });
    },
    [conversations, updateConversation]
  );

  return {
    conversations,
    activeKey,
    isCreatingThread,
    errorMessage,
    updateConversation,
    handleNewChat,
    handleActiveChange,
    handleDeleteConversation,
    handleToggleDisable,
    setActiveKey,
  };
};
