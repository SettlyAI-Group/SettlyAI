import { useState } from 'react';
import { PlusOutlined, HistoryOutlined, EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { ChangeEvent, KeyboardEvent } from 'react';
import {
  HistorySidebarHeader,
  NewChatButton,
  HistoryList,
  HistoryItem,
  HistoryItemHeader,
  HistoryItemTitle,
  HistoryItemActions,
  HistoryItemAction,
  HistoryItemPreview,
  RenameInput,
} from './ChatSidebar.styles';

// ============ 类型定义 ============
interface ConversationItem {
  key: string;
  label: string;
  timestamp: number;
  isDisabled?: boolean;
  isTyping?: boolean;
  preview?: string;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeKey: string;
  movingThreadId: string | null;
  editingKey: string | null;
  renameDraft: string;
  onRenameStart: (key: string) => void;
  onRenameChange: (value: string) => void;
  onRenameSubmit: (key: string, value: string) => void;
  onRenameCancel: () => void;
  onToggleDisable: (key: string) => void;
  onDelete: (key: string) => Promise<void> | void;
  onActiveChange: (key: string) => void;
  onNewChat: () => void;
}

// ============ 主组件 ============
const ChatSidebar = ({
  conversations,
  activeKey,
  movingThreadId,
  editingKey,
  renameDraft,
  onRenameStart,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onToggleDisable,
  onDelete,
  onActiveChange,
  onNewChat,
}: ChatSidebarProps) => {
  const [menuOpenKey, setMenuOpenKey] = useState<string | null>(null);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onRenameSubmit(key, renameDraft);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onRenameCancel();
    }
  };

  /**
   * 处理删除确认
   */
  const handleDeleteClick = (key: string, label: string) => {
    if (window.confirm(`Are you sure you want to delete "${label}"? This action cannot be undone.`)) {
      onDelete(key);
    }
    setMenuOpenKey(null);
  };

  return (
    <>
      <HistorySidebarHeader>
        <HistoryOutlined />
        <span>Chat History</span>
      </HistorySidebarHeader>

      <NewChatButton onClick={onNewChat}>
        <PlusOutlined />
        <span>New chat</span>
      </NewChatButton>

      <HistoryList>
        {conversations.map(item => (
          <HistoryItem
            key={item.key}
            className="history-item"
            $active={item.key === activeKey}
            $disabled={item.isDisabled || false}
            $isMoving={item.key === movingThreadId}
            onClick={() => {
              if (editingKey !== item.key && menuOpenKey !== item.key) {
                onActiveChange(item.key);
              }
            }}
          >
            <HistoryItemHeader>
              {editingKey === item.key ? (
                <RenameInput
                  autoFocus
                  value={renameDraft}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onRenameChange(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, item.key)}
                  onBlur={() => editingKey === item.key && onRenameSubmit(item.key, renameDraft)}
                  onClick={e => e.stopPropagation()}
                  placeholder="Rename conversation"
                />
              ) : (
                <>
                  <HistoryItemTitle $disabled={item.isDisabled || false}>
                    {item.label || 'New Chat'}
                    {item.isTyping && <span className="typing-cursor">|</span>}
                    {item.isDisabled && ' (disabled)'}
                  </HistoryItemTitle>
                  <HistoryItemActions>
                    <HistoryItemAction
                      onClick={e => {
                        e.stopPropagation();
                        onRenameStart(item.key);
                      }}
                      title="Rename"
                    >
                      <EditOutlined />
                    </HistoryItemAction>
                    <HistoryItemAction
                      onClick={e => {
                        e.stopPropagation();
                        onToggleDisable(item.key);
                      }}
                      title={item.isDisabled ? 'Enable' : 'Disable'}
                    >
                      <StopOutlined />
                    </HistoryItemAction>
                    <HistoryItemAction
                      $danger
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteClick(item.key, item.label);
                      }}
                      title="Delete"
                    >
                      <DeleteOutlined />
                    </HistoryItemAction>
                  </HistoryItemActions>
                </>
              )}
            </HistoryItemHeader>
            {editingKey !== item.key && (
              <HistoryItemPreview>
                {item.preview ||
                  new Date(item.timestamp).toLocaleDateString('en-AU', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </HistoryItemPreview>
            )}
          </HistoryItem>
        ))}
      </HistoryList>
    </>
  );
};

export default ChatSidebar;
