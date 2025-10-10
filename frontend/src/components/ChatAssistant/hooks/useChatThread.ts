import { useCallback, useEffect, useRef, useState } from 'react';
import { createThread as createThreadApi, deleteThread as deleteThreadApi, searchThreads } from '@/api/chatBotApi';

export interface ConversationItem {
  key: string;
  label: string;
  updatedAt: number;
  isDisabled?: boolean;
  values?: Record<string, unknown>; // thread 的历史消息数据
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
}

export const useChatThread = ({ userChatId }: UseChatThreadOptions) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeThreadRef = useRef('');

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
          values: thread.values, // 保存 thread 的历史消息
        }));

        setConversations(prev => {
          const previousMap = new Map(prev.map(item => [item.key, item]));
          return mapped.map(item => {
            const prevItem = previousMap.get(item.key);
            return {
              ...item,
              label: prevItem?.label ?? item.label,
              isDisabled: prevItem?.isDisabled ?? false,
              values: item.values, // 保留最新的 values
            };
          });
        });

        if (threads.length === 0) {
          setActiveKey('');
          return;
        }

        const first = threads[0];
        setActiveKey(first.thread_id);
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
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [userChatId, isCreatingThread]);

  // 切换会话
  const handleActiveChange = useCallback(
    async (key: string) => {
      console.log(`🔄 [handleActiveChange] 切换到: ${key}, 当前: ${activeKey}`);

      if (!key || key === activeKey) {
        console.log(`⚠️ [handleActiveChange] 跳过（已经是当前 thread）`);
        return;
      }

      const targetConversation = conversations.find(item => item.key === key);
      if (targetConversation?.isDisabled) return;

      setErrorMessage(null);

      // 🔑 先获取最新数据，再切换 activeKey
      try {
        console.log(`📡 [handleActiveChange] 获取 thread values...`);
        const threads = await searchThreads({
          ids: [key],
          select: ['thread_id', 'values'],
        });

        console.log(`📦 [handleActiveChange] 收到 values:`, threads[0]?.values);

        if (threads.length > 0) {
          // 先更新 conversation 的 values
          setConversations(prev =>
            prev.map(item =>
              item.key === key
                ? { ...item, values: threads[0].values }
                : item
            )
          );
          console.log(`✅ [handleActiveChange] 已更新 conversations`);
        }

        // 最后再切换 activeKey，确保 values 已经准备好
        console.log(`✅ [handleActiveChange] 设置 activeKey: ${key}`);
        setActiveKey(key);
      } catch (error) {
        console.error('Failed to fetch thread values:', error);
        // 即使出错也切换（显示空历史）
        setActiveKey(key);
      }
    },
    [activeKey, conversations]
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
