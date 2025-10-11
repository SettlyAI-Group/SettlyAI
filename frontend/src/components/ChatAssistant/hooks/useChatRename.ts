import { useCallback, useState } from 'react';
import { updateThread } from '@/api/chatBotApi';
import type { ConversationItem } from './useChatThread';

export const useChatRename = (
  conversations: ConversationItem[],
  updateConversation: (key: string, updates: Partial<ConversationItem>) => void
) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const cancelRename = useCallback(() => {
    setEditingKey(null);
    setRenameDraft('');
  }, []);

  const handleRenameStart = useCallback(
    (key: string) => {
      const target = conversations.find(item => item.key === key);
      setEditingKey(key);
      setRenameDraft(target?.label ?? '');
    },
    [conversations]
  );

  const handleRenameSubmit = useCallback(
    async (key: string, value: string) => {
      const nextLabel = value.trim();
      if (nextLabel) {
        // 先更新本地状态
        updateConversation(key, { label: nextLabel });

        // 再保存到后端 metadata.label
        try {
          await updateThread(key, {
            metadata: { label: nextLabel },
          });
        } catch (error) {
          console.error('Failed to save label to backend:', error);
        }
      }
      cancelRename();
    },
    [updateConversation, cancelRename]
  );

  return {
    editingKey,
    renameDraft,
    setRenameDraft,
    cancelRename,
    handleRenameStart,
    handleRenameSubmit,
  };
};
