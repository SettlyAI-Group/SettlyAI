import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender } from '@ant-design/x';
import type { GetProp } from 'antd';
import type { BubbleProps } from '@ant-design/x';
import { Button, Space, Spin, Typography as AntTypography } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { UserOutlined } from '@ant-design/icons';
import { useChatThread, useChatRename } from '../../hooks';
import { useStreamChat } from '../../hooks/useStreamChat';
import type { Message } from '../../hooks/useStreamChat';
import markdownit from 'markdown-it';

const md = markdownit({ html: true, breaks: true });

// ============ Markdown 渲染 ============
const renderMarkdown: BubbleProps['messageRender'] = content => {
  return (
    <AntTypography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </AntTypography>
  );
};

// ============ Bubble 角色配置 ============
const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { color: '#fff', backgroundColor: '#87d068' } },
  },
  assistant: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { color: '#f56a00', backgroundColor: '#fde3cf' } },
    messageRender: renderMarkdown,
    typing: { step: 5, interval: 20 },
  },
  tool_call: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { color: '#f56a00', backgroundColor: '#fde3cf' } },
    messageRender: content => (
      <Space>
        <Spin size="small" />
        <span style={{ color: '#666' }}>{content}</span>
      </Space>
    ),
  },
};

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
  [theme.breakpoints.down('sm')]: { width: 320, height: 500 },
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

const ChatFooter = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
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
    '& code': { fontSize: '0.9em', padding: '0.2em 0.4em', backgroundColor: '#f5f5f5', borderRadius: '3px' },
    '& pre': {
      fontSize: '0.85em',
      padding: '0.8em',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      overflow: 'auto',
    },
    '& blockquote': { fontSize: '1em', margin: '0.5em 0', paddingLeft: '1em', borderLeft: '3px solid #ddd' },
    '& a': { fontSize: 'inherit', color: '#1890ff' },
    '& strong': { fontSize: 'inherit' },
    '& em': { fontSize: 'inherit' },
  },
}));

const StyledSendButton = styled(Button)(() => ({
  '&.ant-btn-primary': {
    backgroundColor: '#000000 !important',
    borderColor: '#000000 !important',
    '&:hover, &:active, &:focus': {
      backgroundColor: '#333333 !important',
      borderColor: '#333333 !important',
    },
  },
}));

// ============ 主组件 ============
const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  // 线程管理
  const {
    conversations,
    activeKey,
    isCreatingThread,
    errorMessage,
    updateConversation,
    handleNewChat,
    handleActiveChange,
    handleDeleteConversation,
    handleToggleDisable,
  } = useChatThread({ userChatId });

  // 聊天功能
  const { messages, isStreaming, sendMessage, abort, setMessages } = useStreamChat(activeKey);

  // 重命名功能
  const { editingKey, renameDraft, setRenameDraft, cancelRename, handleRenameStart, handleRenameSubmit } =
    useChatRename(conversations, updateConversation);

  // 组件卸载时中止请求
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  // 转换消息格式为 Bubble.List 需要的格式
  const bubbleItems = messages.map(m => {
    // 检查是否有 assistant 消息正在 streaming
    const hasStreamingAssistant = messages.some(msg => msg.role === 'assistant' && msg.status === 'streaming');

    // 判断是否为 typing 占位符（空内容 + loading 状态）
    const isTypingPlaceholder = m.role === 'assistant' && m.status === 'loading' && m.content.trim() === '';

    return {
      key: m.id,
      role: m.role,
      content: m.content,
      // loading：tool_call 或 typing 占位符
      loading:
        (m.role === 'tool_call' && m.status === 'loading' && !hasStreamingAssistant) ||
        isTypingPlaceholder,
      // assistant 的 typing：只有 streaming 状态才显示
      typing: m.role === 'assistant' && m.status === 'streaming' ? { step: 5, interval: 20 } : false,
    };
  });

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

        <StyledBubbleList className="chat-no-drag" roles={BUBBLE_ROLES} items={bubbleItems} />

        <ChatFooter className="chat-no-drag">
          <Sender
            value={input}
            onChange={setInput}
            onSubmit={() => {
              const text = input.trim();
              if (!text || !activeKey || isActiveConversationDisabled || isStreaming) return;
              sendMessage(text);
              setInput('');
            }}
            placeholder={
              isActiveConversationDisabled ? 'Enable this conversation to send messages.' : 'Type your message...'
            }
            disabled={!userChatId || !activeKey || isActiveConversationDisabled || isStreaming}
            actions={(_, { components }) => {
              const { SendButton } = components;
              return <StyledSendButton as={SendButton} />;
            }}
          />
        </ChatFooter>
      </ChatContainer>
    </WindowContainer>
  );
};

export default ChatWindow;
