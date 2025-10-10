import { useState } from 'react';
import { PlusOutlined, HistoryOutlined, EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { ChangeEvent, KeyboardEvent } from 'react';

// ============ 类型定义 ============
interface ConversationItem {
  key: string;
  label: string;
  timestamp: number;
  isDisabled?: boolean;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeKey: string;
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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
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
      <style>{`
        .history-sidebar-header {
          height: 56px;
          padding: 0 16px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          display: flex;
          align-items: center;
          color: white;
          font-size: 14px;
          font-weight: 500;
          gap: 8px;
          flex-shrink: 0;
        }

        .new-chat-btn {
          padding: 6px 12px;
          margin: 10px;
          background: white;
          border: 1px dashed #D9D9D9;
          border-radius: 6px;
          color: #595959;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .new-chat-btn:hover {
          border-color: #1890FF;
          color: #1890FF;
          background: #E6F7FF;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 8px 8px 8px;
        }

        .history-item {
          padding: 8px 10px;
          margin-bottom: 2px;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .history-item:hover {
          background: #F5F5F5;
          transform: translateX(2px);
        }

        .history-item.active {
          background: #E6F7FF;
          border-left: 2px solid #1890FF;
        }

        .history-item.disabled {
          opacity: 0.6;
        }

        .history-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
        }

        .history-item-title {
          font-size: 13px;
          font-weight: 500;
          color: #262626;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .history-item.disabled .history-item-title {
          color: #8C8C8C;
          font-style: italic;
        }

        .history-item-actions {
          display: flex;
          gap: 2px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .history-item:hover .history-item-actions {
          opacity: 1;
        }

        .history-item-action {
          width: 20px;
          height: 20px;
          border: none;
          background: transparent;
          color: #8C8C8C;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          font-size: 12px;
        }

        .history-item-action:hover {
          background: #F0F0F0;
          color: #1890FF;
        }

        .history-item-action.danger:hover {
          background: #FFF1F0;
          color: #FF4D4F;
        }

        .history-item-preview {
          font-size: 11px;
          color: #8C8C8C;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        .rename-input {
          width: 100%;
          padding: 2px 6px;
          border: 1px solid #40A9FF;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
          background: white;
        }

        /* Scrollbar styling */
        .history-list::-webkit-scrollbar {
          width: 6px;
        }

        .history-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .history-list::-webkit-scrollbar-thumb {
          background: #D9D9D9;
          border-radius: 3px;
        }

        .history-list::-webkit-scrollbar-thumb:hover {
          background: #BFBFBF;
        }
      `}</style>

      <div className="history-sidebar-header">
        <HistoryOutlined />
        <span>Chat History</span>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <PlusOutlined />
        <span>New chat</span>
      </button>

      <div className="history-list">
        {conversations.map(item => (
          <div
            key={item.key}
            className={`history-item ${item.key === activeKey ? 'active' : ''} ${item.isDisabled ? 'disabled' : ''}`}
            onClick={() => {
              if (editingKey !== item.key && menuOpenKey !== item.key) {
                onActiveChange(item.key);
              }
            }}
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div className="history-item-header">
              {editingKey === item.key ? (
                <input
                  autoFocus
                  className="rename-input"
                  value={renameDraft}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onRenameChange(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, item.key)}
                  onBlur={() => editingKey === item.key && onRenameSubmit(item.key, renameDraft)}
                  onClick={e => e.stopPropagation()}
                  placeholder="Rename conversation"
                />
              ) : (
                <>
                  <div className="history-item-title">
                    {item.label}
                    {item.isDisabled && ' (disabled)'}
                  </div>
                  <div className="history-item-actions">
                    <button
                      className="history-item-action"
                      onClick={e => {
                        e.stopPropagation();
                        onRenameStart(item.key);
                      }}
                      title="Rename"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className="history-item-action"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleDisable(item.key);
                      }}
                      title={item.isDisabled ? 'Enable' : 'Disable'}
                    >
                      <StopOutlined />
                    </button>
                    <button
                      className="history-item-action danger"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteClick(item.key, item.label);
                      }}
                      title="Delete"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </>
              )}
            </div>
            {editingKey !== item.key && (
              <div className="history-item-preview">
                {new Date(item.timestamp).toLocaleDateString('en-AU', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatSidebar;
