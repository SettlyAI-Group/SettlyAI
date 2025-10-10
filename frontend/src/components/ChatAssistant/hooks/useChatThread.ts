import { useCallback, useEffect, useRef, useState } from 'react';
import { createThread as createThreadApi, deleteThread as deleteThreadApi, searchThreads, updateThread } from '@/api/chatBotApi';
import type { ConversationItem } from '../types';
import { THREAD_TTL_SECONDS } from '../constants';

interface UseChatThreadOptions {
  userChatId: string | null;
}

/**
 * 聊天线程管理 Hook
 */
export const useChatThread = ({ userChatId }: UseChatThreadOptions) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [movingThreadId, setMovingThreadId] = useState<string | null>(null);
  const activeThreadRef = useRef('');

  useEffect(() => {
    activeThreadRef.current = activeKey;
  }, [activeKey]);

  /**
   * 更新会话信息
   */
  const updateConversation = useCallback((key: string, updates: Partial<ConversationItem>) => {
    setConversations(prev => prev.map(item => (item.key === key ? { ...item, ...updates } : item)));
  }, []);

  /**
   * 加载会话列表
   */
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
          values: thread.values,
        }));

        setConversations(prev => {
          const previousMap = new Map(prev.map(item => [item.key, item]));
          return mapped.map(item => {
            const prevItem = previousMap.get(item.key);
            return {
              ...item,
              label: prevItem?.label ?? item.label,
              isDisabled: prevItem?.isDisabled ?? false,
              values: item.values,
            };
          });
        });

        if (threads.length === 0) {
          setActiveKey('');
          return;
        }

        setActiveKey(threads[0].thread_id);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setErrorMessage('Failed to load your chat history.');
      }
    };

    fetchThreads();
  }, [userChatId]);

  /**
   * 创建新会话
   */
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
      console.error('Failed to create thread:', error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [userChatId, isCreatingThread]);

  /**
   * 切换会话（先获取最新数据，再切换）
   */
  const handleActiveChange = useCallback(
    async (key: string) => {
      if (!key || key === activeKey) return;

      const targetConversation = conversations.find(item => item.key === key);
      if (targetConversation?.isDisabled) return;

      setErrorMessage(null);

      try {
        // 先获取最新 values
        const threads = await searchThreads({
          ids: [key],
          select: ['thread_id', 'values'],
        });

        if (threads.length > 0) {
          // 更新 conversation 的 values
          setConversations(prev =>
            prev.map(item => (item.key === key ? { ...item, values: threads[0].values } : item))
          );
        }

        // 最后切换 activeKey
        setActiveKey(key);
      } catch (error) {
        console.error('Failed to fetch thread values:', error);
        // 即使出错也切换（显示空历史）
        setActiveKey(key);
      }
    },
    [activeKey, conversations]
  );

  /**
   * 删除会话
   */
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

  /**
   * 切换禁用状态
   */
  const handleToggleDisable = useCallback(
    (key: string) => {
      const target = conversations.find(item => item.key === key);
      updateConversation(key, { isDisabled: !target?.isDisabled });
    },
    [conversations, updateConversation]
  );

  /**
   * 聊天完成后更新 thread 并重新排序到顶部（带动画）
   */
  const handleChatComplete = useCallback(async (threadId: string, firstUserMessage?: string) => {
    if (!threadId) return;

    try {
      // 调用后端 API 更新 thread（触发 updated_at 更新）
      await updateThread(threadId, {
        metadata: { last_message_preview: firstUserMessage?.slice(0, 30) || '' },
      });

      // 获取最新的 thread 数据
      const threads = await searchThreads({
        ids: [threadId],
        select: ['thread_id', 'updated_at', 'values'],
      });

      if (threads.length > 0) {
        const updatedThread = threads[0];
        const newUpdatedAt = new Date(updatedThread.updated_at || Date.now()).getTime();

        // 先重新排序，再标记为移动中
        setConversations(prev => {
          const updated = prev.map(item => {
            if (item.key === threadId) {
              return {
                ...item,
                updatedAt: newUpdatedAt,
                values: updatedThread.values,
              };
            }
            return item;
          });
          // 重新排序（按 updatedAt 降序）
          return updated.sort((a, b) => b.updatedAt - a.updatedAt);
        });

        // 稍微延迟后标记为移动中（触发动画）
        setTimeout(() => {
          setMovingThreadId(threadId);

          // 动画结束后移除标记
          setTimeout(() => {
            setMovingThreadId(null);
          }, 800);
        }, 50);
      }
    } catch (error) {
      console.error('Failed to update thread after chat:', error);
    }
  }, []);

  return {
    conversations,
    activeKey,
    isCreatingThread,
    errorMessage,
    movingThreadId,
    updateConversation,
    handleNewChat,
    handleActiveChange,
    handleDeleteConversation,
    handleToggleDisable,
    handleChatComplete,
    setActiveKey,
  };
};
