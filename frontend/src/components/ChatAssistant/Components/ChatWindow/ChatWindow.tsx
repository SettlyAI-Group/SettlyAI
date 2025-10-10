import { useEffect, useRef, useState } from 'react';
import {
  RobotOutlined,
  ExpandOutlined,
  CompressOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import type { GetRef } from 'antd';
import { ensureUserChatId } from '../../utils/userChatId';
import { useChatThread, useChatRename, useStreamChat } from '../../hooks';
import { BUBBLE_ROLES } from '../../constants';
import ChatSidebar from './components/ChatSidebar';

// ============ 快捷操作配置 ============
const quickActions = [
  { icon: <BulbOutlined />, text: 'Get ideas', color: '#FAAD14' },
  { icon: <ThunderboltOutlined />, text: 'Quick fix', color: '#52C41A' },
  { icon: <RocketOutlined />, text: 'Start project', color: '#1890FF' },
  { icon: <QuestionCircleOutlined />, text: 'Ask anything', color: '#722ED1' },
];

// ============ 类型定义 ============
interface ChatWindowProps {
  onClose?: () => void;
}

// ============ 主组件 ============
/**
 * 聊天窗口主组件
 */
const ChatWindow = ({ onClose }: ChatWindowProps = {}) => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const bubbleListRef = useRef<GetRef<typeof Bubble.List>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化用户 ID
  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  // 线程管理
  const {
    conversations,
    activeKey,
    updateConversation,
    handleNewChat,
    handleActiveChange,
    handleDeleteConversation,
    handleToggleDisable,
  } = useChatThread({ userChatId });

  // 聊天功能
  const { messages, isStreaming, sendMessage, abort, setMessages, loadHistory } = useStreamChat(activeKey);

  // 重命名功能
  const { editingKey, renameDraft, setRenameDraft, cancelRename, handleRenameStart, handleRenameSubmit } =
    useChatRename(conversations, updateConversation);

  /**
   * 当 activeKey 改变时，加载历史消息
   */
  const prevActiveKeyRef = useRef<string>('');
  useEffect(() => {
    if (prevActiveKeyRef.current === activeKey) return;
    prevActiveKeyRef.current = activeKey;

    if (!activeKey) {
      setMessages([]);
      return;
    }

    const activeConv = conversations.find(c => c.key === activeKey);
    if (activeConv?.values) {
      loadHistory(activeConv.values);
    } else {
      setMessages([]);
    }
  }, [activeKey, conversations, loadHistory, setMessages]);

  /**
   * 组件卸载时中止请求
   */
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  /**
   * 自动滚动到最新消息（streaming 完成时）
   */
  const prevIsStreamingRef = useRef(isStreaming);
  useEffect(() => {
    if (prevIsStreamingRef.current && !isStreaming && messages.length > 0) {
      const lastMessageKey = messages[messages.length - 1]?.id;
      if (lastMessageKey && bubbleListRef.current) {
        setTimeout(() => {
          bubbleListRef.current?.scrollTo({ key: lastMessageKey, block: 'end' });
        }, 100);
      }
    }
    prevIsStreamingRef.current = isStreaming;
  }, [isStreaming, messages]);

  /**
   * 处理消息发送
   */
  const handleSubmit = () => {
    const text = input.trim();
    if (!text || !activeKey || isActiveConversationDisabled || isStreaming) return;
    sendMessage(text);
    setInput('');
    setShowGuide(false);
  };

  /**
   * 处理快捷操作
   */
  const handleQuickAction = (actionText: string) => {
    setInput(actionText);
    inputRef.current?.focus();
    setShowGuide(false);
  };

  /**
   * 获取聊天窗口样式
   */
  const getChatWindowStyle = () => {
    if (isFullscreen) {
      return {
        width: '100vw',
        height: '100vh',
        bottom: 0,
        right: 0,
        borderRadius: 0,
      };
    }

    const baseWidth = window.innerWidth <= 480 ? '100vw' : '640px';
    const collapsedWidth = window.innerWidth <= 480 ? '100vw' : '440px';

    return {
      width: showHistory ? baseWidth : collapsedWidth,
      height: window.innerWidth <= 480 ? '100vh' : '680px',
      bottom: window.innerWidth <= 480 ? 0 : '20px',
      right: window.innerWidth <= 480 ? 0 : '20px',
      borderRadius: window.innerWidth <= 480 ? 0 : '16px',
    };
  };

  /**
   * 转换消息格式为 Bubble.List 需要的格式
   */
  const bubbleItems = messages.map(m => {
    const isTypingPlaceholder = m.role === 'assistant' && m.status === 'loading' && m.content.trim() === '';

    return {
      key: m.id,
      role: m.role,
      content: m.content,
      loading: isTypingPlaceholder,
      typing: m.role === 'assistant' && m.status === 'streaming' ? { step: 5, interval: 20 } : false,
    };
  });

  const activeConversation = conversations.find(item => item.key === activeKey);
  const isActiveConversationDisabled = Boolean(activeConversation?.isDisabled);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .chat-window {
          position: fixed;
          background: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* History sidebar */
        .history-sidebar {
          width: 200px;
          background: #FAFAFA;
          border-right: 1px solid #F0F0F0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .history-sidebar.hidden {
          width: 0;
          opacity: 0;
          overflow: hidden;
        }

        /* Main chat area */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Header */
        .chat-header {
          height: 56px;
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          flex-shrink: 0;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-toggle {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
        }

        .chat-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 1px;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          opacity: 0.9;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          background: #52C41A;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-header-actions {
          display: flex;
          gap: 6px;
        }

        .header-action {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 14px;
        }

        .header-action:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        /* Messages area with Ant Design X styling */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          background: linear-gradient(to bottom, #F5F7FA 0%, #FFFFFF 100%);
          display: flex;
          flex-direction: column;
        }

        /* Override Ant Design X Bubble styles */
        .messages-container .ant-bubble-list {
          padding: 20px;
        }

        /* User guide - Compact design */
        .guide-container {
          background: linear-gradient(135deg, #E6F7FF 0%, #F0F5FF 100%);
          border: 1px solid #91D5FF;
          border-radius: 10px;
          padding: 12px;
          margin: 0 20px 16px 20px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .guide-title {
          font-size: 12px;
          color: #0050B3;
          font-weight: 500;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guide-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }

        .guide-action {
          background: white;
          border: 1px solid #D9D9D9;
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guide-action:hover {
          border-color: #40A9FF;
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
          transform: translateY(-1px);
        }

        .guide-action-icon {
          font-size: 16px;
        }

        .guide-action-text {
          font-size: 11px;
          color: #262626;
        }

        /* Sender style customization */
        .input-container {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #F0F0F0;
          flex-shrink: 0;
        }

        /* Override Sender button styles */
        .input-container .ant-btn-primary {
          background: linear-gradient(135deg, #1890FF 0%, #0050B3 100%) !important;
          border-color: transparent !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          transition: all 0.2s !important;
        }

        .input-container .ant-btn-primary:hover,
        .input-container .ant-btn-primary:active,
        .input-container .ant-btn-primary:focus {
          background: linear-gradient(135deg, #40A9FF 0%, #1890FF 100%) !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35) !important;
        }

        .input-container .ant-btn-primary:active {
          transform: scale(0.95) !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .history-sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 10;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
          }

          .guide-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .chat-header {
            padding: 0 12px;
          }

          .messages-container .ant-bubble-list {
            padding: 16px;
          }

          .input-container {
            padding: 12px 16px;
          }

          .guide-container {
            margin: 0 16px 12px 16px;
          }
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #D9D9D9;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #BFBFBF;
        }
      `}</style>

      <div className="chat-window" style={getChatWindowStyle()}>
        {/* History sidebar */}
        <div className={`history-sidebar ${!showHistory ? 'hidden' : ''}`}>
          <ChatSidebar
            conversations={conversations.map(item => ({
              key: item.key,
              label: item.label,
              timestamp: item.updatedAt,
              isDisabled: item.isDisabled,
            }))}
            activeKey={activeKey}
            editingKey={editingKey}
            renameDraft={renameDraft}
            onRenameStart={handleRenameStart}
            onRenameChange={setRenameDraft}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={cancelRename}
            onToggleDisable={handleToggleDisable}
            onDelete={handleDeleteConversation}
            onActiveChange={handleActiveChange}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Main chat area */}
        <div className="chat-main">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <button className="menu-toggle" onClick={() => setShowHistory(!showHistory)} title="History">
                {showHistory ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </button>
              <div className="chat-avatar">
                <RobotOutlined />
              </div>
              <div className="chat-info">
                <div className="chat-title">AI Assistant</div>
                <div className="chat-status">
                  <span className="status-dot"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="header-action"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              </button>
              {onClose && (
                <button className="header-action" onClick={onClose} title="Close">
                  <CloseOutlined />
                </button>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div className="messages-container">
            {/* User guide - Compact design */}
            {showGuide && messages.length === 0 && (
              <div className="guide-container">
                <div className="guide-title">
                  <BulbOutlined />
                  Quick Start
                </div>
                <div className="guide-actions">
                  {quickActions.map((action, index) => (
                    <div key={index} className="guide-action" onClick={() => handleQuickAction(action.text)}>
                      <span className="guide-action-icon" style={{ color: action.color }}>
                        {action.icon}
                      </span>
                      <span className="guide-action-text">{action.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Bubble.List ref={bubbleListRef} roles={BUBBLE_ROLES} items={bubbleItems} />
          </div>

          {/* Sender style input area */}
          <div className="input-container">
            <Sender
              loading={isStreaming}
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onCancel={abort}
              placeholder={
                isActiveConversationDisabled
                  ? 'Enable this conversation to send messages.'
                  : 'Type a message...'
              }
              disabled={!userChatId || !activeKey || isActiveConversationDisabled}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
