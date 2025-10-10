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
import {
  ChatWindowContainer,
  HistorySidebar,
  ChatMain,
  ChatHeader,
  ChatHeaderLeft,
  MenuToggle,
  ChatAvatar,
  ChatInfo,
  ChatTitle,
  ChatStatus,
  StatusDot,
  ChatHeaderActions,
  HeaderAction,
  MessagesContainer,
  StyledBubbleList,
  GuideContainer,
  GuideTitle,
  GuideActions,
  GuideAction,
  GuideActionIcon,
  GuideActionText,
  InputContainer,
} from './ChatWindow.styles';

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
  isClosing?: boolean;
}

// ============ 主组件 ============
/**
 * 聊天窗口主组件
 */
const ChatWindow = ({ onClose, isClosing = false }: ChatWindowProps = {}) => {
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

  /**
   * 从 thread values 中提取第一条消息的文本作为预览
   */
  const extractPreview = (values: Record<string, unknown> | undefined): string => {
    if (!values || !values.messages) return '';
    const messages = values.messages as Array<{ type: string; content: Array<{ text?: string; type: string }> }>;
    const firstMessage = messages.find(msg => msg.type === 'human');
    if (firstMessage && firstMessage.content && firstMessage.content.length > 0) {
      const textContent = firstMessage.content.find(c => c.type === 'text');
      return textContent?.text?.slice(0, 30) || '';
    }
    return '';
  };

  return (
    <ChatWindowContainer $isClosing={isClosing} $style={getChatWindowStyle()}>
      {/* History sidebar */}
      <HistorySidebar $hidden={!showHistory}>
        <ChatSidebar
          conversations={conversations.map(item => ({
            key: item.key,
            label: item.label,
            timestamp: item.updatedAt,
            isDisabled: item.isDisabled,
            preview: extractPreview(item.values),
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
      </HistorySidebar>

      {/* Main chat area */}
      <ChatMain>
        {/* Header */}
        <ChatHeader>
          <ChatHeaderLeft>
            <MenuToggle onClick={() => setShowHistory(!showHistory)} title="History">
              {showHistory ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </MenuToggle>
            <ChatAvatar>
              <RobotOutlined />
            </ChatAvatar>
            <ChatInfo>
              <ChatTitle>AI Assistant</ChatTitle>
              <ChatStatus>
                <StatusDot />
                <span>Online</span>
              </ChatStatus>
            </ChatInfo>
          </ChatHeaderLeft>
          <ChatHeaderActions>
            <HeaderAction
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
            </HeaderAction>
            {onClose && (
              <HeaderAction onClick={onClose} title="Close">
                <CloseOutlined />
              </HeaderAction>
            )}
          </ChatHeaderActions>
        </ChatHeader>

        {/* Messages area */}
        <MessagesContainer>
          {/* User guide - Compact design */}
          {showGuide && messages.length === 0 && (
            <GuideContainer>
              <GuideTitle>
                <BulbOutlined />
                Quick Start
              </GuideTitle>
              <GuideActions>
                {quickActions.map((action, index) => (
                  <GuideAction key={index} onClick={() => handleQuickAction(action.text)}>
                    <GuideActionIcon style={{ color: action.color }}>{action.icon}</GuideActionIcon>
                    <GuideActionText>{action.text}</GuideActionText>
                  </GuideAction>
                ))}
              </GuideActions>
            </GuideContainer>
          )}

          <StyledBubbleList ref={bubbleListRef} roles={BUBBLE_ROLES} items={bubbleItems} />
        </MessagesContainer>

        {/* Sender style input area */}
        <InputContainer>
          <Sender
            loading={isStreaming}
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onCancel={abort}
            placeholder={
              isActiveConversationDisabled ? 'Enable this conversation to send messages.' : 'Type a message...'
            }
            disabled={!userChatId || !activeKey || isActiveConversationDisabled}
          />
        </InputContainer>
      </ChatMain>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
