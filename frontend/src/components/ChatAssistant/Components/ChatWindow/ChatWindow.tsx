import { useEffect, useRef, useState } from 'react';
import {
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
import { BUBBLE_ROLES, TinaAvatar } from '../../constants';
import { RotatingMessage } from '../../components/RotatingMessage';
import { WelcomeScreen } from '../WelcomeScreen';
import ChatSidebar from './components/ChatSidebar';
import {
  ChatWindowContainer,
  HistorySidebar,
  Overlay,
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
  { icon: <BulbOutlined />, text: 'Check Point Cook median house price', color: '#FAAD14' },
  { icon: <ThunderboltOutlined />, text: 'Analyze rental yield in the area', color: '#52C41A' },
  { icon: <RocketOutlined />, text: 'First home buyer grant explained', color: '#1890FF' },
  { icon: <QuestionCircleOutlined />, text: 'View transport & school ratings', color: '#722ED1' },
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
  const [showHistory, setShowHistory] = useState(window.innerWidth > 768);
  const [showGuide, setShowGuide] = useState(true);
  const bubbleListRef = useRef<GetRef<typeof Bubble.List>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化用户 ID
  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  // 监听窗口大小变化，自动收起/展开 history
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowHistory(false);
      } else {
        setShowHistory(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 线程管理
  const {
    conversations,
    activeKey,
    movingThreadId,
    updateConversation,
    handleNewChat,
    handleActiveChange,
    handleDeleteConversation,
    handleToggleDisable,
    handleChatComplete,
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
    // 只有 activeKey 改变时才加载历史消息
    if (prevActiveKeyRef.current === activeKey) {
      return;
    }

    prevActiveKeyRef.current = activeKey;

    if (!activeKey) {
      setMessages([]);
      setShowGuide(false);
      return;
    }

    const activeConv = conversations.find(c => c.key === activeKey);
    if (activeConv?.values) {
      loadHistory(activeConv.values);
      setShowGuide(false);
    } else {
      // 新建的空对话，显示 Quick Start
      setMessages([]);
      setShowGuide(true);
    }
  }, [activeKey, conversations, loadHistory, setMessages, isStreaming]);

  /**
   * 组件卸载时中止请求
   * 注意：这里使用空依赖数组，确保只在组件真正卸载时才调用 abort()
   * 如果把 abort 放入依赖数组，会在 threadId 改变时触发 cleanup，导致切换线程时误中止
   */
  useEffect(() => {
    return () => {
      abort();
    };
  }, []); // 空依赖数组：只在组件真正卸载时执行

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

    // 立即更新对话标题（如果还是 "New Chat"）
    const activeConv = conversations.find(c => c.key === activeKey);
    if (activeConv && activeConv.label === 'New Chat') {
      const targetLabel = text.length > 30 ? `${text.slice(0, 30)}...` : text;

      // 设置 typing 状态
      updateConversation(activeKey, { isTyping: true, label: '' });

      // 逐字打字效果
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        currentIndex++;
        const partialLabel = targetLabel.slice(0, currentIndex);
        updateConversation(activeKey, { label: partialLabel });

        if (currentIndex >= targetLabel.length) {
          clearInterval(typingInterval);
          updateConversation(activeKey, { isTyping: false });

          // 打字完成后，保存到后端
          import('@/api/chatBotApi').then(({ updateThread }) => {
            updateThread(activeKey, {
              metadata: { label: targetLabel },
            }).catch(() => {
              // 静默失败：本地状态已更新
            });
          });
        }
      }, 50); // 每 50ms 显示一个字符
    }

    // 立即调用 handleChatComplete 更新 updatedAt 并移动到顶部
    handleChatComplete(activeKey, text);

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

    // 小屏幕（≤768px）：使用悬浮抽屉，宽度不变
    // 大屏幕（>768px）：根据 showHistory 调整宽度
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return {
        width: '100vw',
        height: '100vh',
        bottom: 0,
        right: 0,
        borderRadius: 0,
      };
    }

    // 桌面端：根据 history 状态调整宽度
    const baseWidth = '680px';
    const collapsedWidth = '480px';

    return {
      width: showHistory ? baseWidth : collapsedWidth,
      height: '680px',
      bottom: '20px',
      right: '20px',
      borderRadius: '16px',
    };
  };

  /**
   * 转换消息格式为 Bubble.List 需要的格式
   */
  const bubbleItems = messages
    .filter(m => {
      // 不过滤 typing placeholder（ID 以 typing_ 开头）
      if (m.id.startsWith('typing_')) {
        return true;
      }

      // 过滤掉空内容的 loading 占位符（如果已经有实际回复了）
      if (m.role === 'assistant' && m.status === 'loading' && m.content.trim() === '') {
        // 检查是否已经有其他 assistant 消息
        const hasOtherAssistantMsg = messages.some(
          msg => msg.role === 'assistant' && msg.id !== m.id && msg.content.trim() !== ''
        );
        if (hasOtherAssistantMsg) {
          return false; // 过滤掉这个 placeholder
        }
      }
      return true;
    })
    .map(m => {
      // typing placeholder: ID 以 typing_ 开头
      const isTypingPlaceholder = m.id.startsWith('typing_');
      // streaming: 正在接收内容的消息
      const isTyping = m.role === 'assistant' && m.status === 'streaming';

      // tool_call: 使用 RotatingMessage 组件
      if (m.role === 'tool_call' && m.rotatingMessages) {
        return {
          key: m.id,
          role: m.role,
          content: <RotatingMessage messages={m.rotatingMessages} intervalMs={3000} typingSpeed={15} />,
          loading: false,
          typing: false,
        };
      }

      return {
        key: m.id,
        role: m.role,
        content: m.content,
        loading: isTypingPlaceholder,
        typing: isTyping ? { step: 2, interval: 10 } : false, // 更丝滑：每次显示2个字符，间隔10ms
      };
    });

  const activeConversation = conversations.find(item => item.key === activeKey);
  const isActiveConversationDisabled = Boolean(activeConversation?.isDisabled);

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
            isTyping: item.isTyping,
          }))}
          activeKey={activeKey}
          movingThreadId={movingThreadId}
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
        {/* Overlay for mobile drawer */}
        <Overlay $visible={showHistory} onClick={() => setShowHistory(false)} />
        {/* Header */}
        <ChatHeader>
          <ChatHeaderLeft>
            <MenuToggle onClick={() => setShowHistory(!showHistory)} title="History">
              {showHistory ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </MenuToggle>
            <ChatAvatar>
              <TinaAvatar />
            </ChatAvatar>
            <ChatInfo>
              <ChatTitle>Tina</ChatTitle>
              <ChatStatus>
                <StatusDot />
                <span>{activeKey ? `Id: ${activeKey}` : 'No conversation'}</span>
              </ChatStatus>
            </ChatInfo>
          </ChatHeaderLeft>
          <ChatHeaderActions>
            <HeaderAction
              $hideOnMobile
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
          {/* 欢迎界面 - 当没有任何线程时显示 */}
          {!activeKey ? (
            <WelcomeScreen onStartChat={handleNewChat} />
          ) : (
            <>
              {/* User guide - Compact design */}
              {showGuide && messages.length === 0 && (
                <GuideContainer key={`guide-${activeKey}`}>
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

              <StyledBubbleList key={`bubble-${activeKey}`} ref={bubbleListRef} roles={BUBBLE_ROLES} items={bubbleItems} />
            </>
          )}
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
