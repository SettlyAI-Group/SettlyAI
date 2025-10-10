import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender } from '@ant-design/x';
import type { GetRef } from 'antd';
import ChatSidebar from './components/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { useChatThread, useChatRename, useStreamChat } from '../../hooks';
import { BUBBLE_ROLES } from '../../constants';

// ============ 样式组件 ============
const WindowContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 68,
  right: 0,
  width: 600,
  height: 600,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[16],
  display: 'flex',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 320,
    height: 500,
  },
}));

const ChatContainer = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledBubbleList = styled(Bubble.List)(() => ({
  flex: 1,
  overflow: 'auto',
  padding: 16,
  fontSize: '14px',

  '& .ant-bubble-content': {
    paddingTop: '10px',
    paddingBottom: '10px',
    '& h1': { fontSize: '1.5em', margin: '0.5em 0' },
    '& h2': { fontSize: '1.3em', margin: '0.4em 0' },
    '& h3': { fontSize: '1.15em', margin: '0.3em 0' },
    '& h4': { fontSize: '1em', margin: '0.25em 0' },
    '& h5': { fontSize: '0.9em', margin: '0.2em 0' },
    '& h6': { fontSize: '0.85em', margin: '0.2em 0' },
    '& p': { fontSize: '1em', margin: '0.5em 0' },
    '& ul, & ol': { fontSize: '1em', margin: '0.5em 0', paddingLeft: '1.5em' },
    '& li': { margin: '0.2em 0' },
    '& code': {
      fontSize: '0.9em',
      padding: '0.2em 0.4em',
      backgroundColor: '#f5f5f5',
      borderRadius: '3px',
    },
    '& pre': {
      fontSize: '0.85em',
      padding: '0.8em',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      overflow: 'auto',
    },
    '& blockquote': {
      fontSize: '1em',
      margin: '0.5em 0',
      paddingLeft: '1em',
      borderLeft: '3px solid #ddd',
    },
    '& a': { fontSize: 'inherit', color: '#1890ff' },
    '& strong': { fontSize: 'inherit' },
    '& em': { fontSize: 'inherit' },
  },
}));

const ChatFooter = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

// ============ 主组件 ============
/**
 * 聊天窗口主组件
 */
const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const bubbleListRef = useRef<GetRef<typeof Bubble.List>>(null);

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

  /**
   * 处理消息发送
   */
  const handleSubmit = () => {
    const text = input.trim();
    if (!text || !activeKey || isActiveConversationDisabled || isStreaming) return;
    sendMessage(text);
    setInput('');
  };

  const activeConversation = conversations.find(item => item.key === activeKey);
  const isActiveConversationDisabled = Boolean(activeConversation?.isDisabled);

  return (
    <WindowContainer id="chat-window-container">
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

      <ChatContainer>
        <ChatHeader className="chat-drag-handle">
          <Typography variant="subtitle2" sx={{ width: 'fit-content' }}>
            AI Assistant
          </Typography>
          {userChatId && activeKey && (
            <Typography variant="caption" color="text.secondary">
              Thread ID: {activeKey}
            </Typography>
          )}
        </ChatHeader>

        <StyledBubbleList ref={bubbleListRef} className="chat-no-drag" roles={BUBBLE_ROLES} items={bubbleItems} />

        <ChatFooter className="chat-no-drag">
          <Sender
            loading={isStreaming}
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onCancel={abort}
            placeholder={
              isActiveConversationDisabled ? 'Enable this conversation to send messages.' : 'Type your message...'
            }
            disabled={!userChatId || !activeKey || isActiveConversationDisabled}
          />
        </ChatFooter>
      </ChatContainer>
    </WindowContainer>
  );
};

export default ChatWindow;
