import { useCallback, useState } from 'react';
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
    (key: string, value: string) => {
      const nextLabel = value.trim();
      if (nextLabel) {
        updateConversation(key, { label: nextLabel });
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
