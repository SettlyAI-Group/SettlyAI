import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender, useXChat } from '@ant-design/x';
import type { GetProp } from 'antd';
import { Button, Space, Spin } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { UserOutlined } from '@ant-design/icons';
import { useChatAgent, useChatThread, useChatRename, useAutoScroll } from '../../hooks';

const USER_AVATAR: CSSProperties = { color: '#fff', backgroundColor: '#87d068' };
const BOT_AVATAR: CSSProperties = { color: '#f56a00', backgroundColor: '#fde3cf' };

const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: USER_AVATAR },
  },
  assistant: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: BOT_AVATAR },
    typing: { step: 5, interval: 20 },
    // 默认 loading 不自定义，使用 Bubble 自带的 typing 效果（点点点）
  },
  tool_call: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: BOT_AVATAR },
  },
};

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

const ChatBody = styled(Box)(() => ({
  flex: 1,
  overflow: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}));

const ChatFooter = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
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

type MsgRole = 'user' | 'assistant' | 'tool_call';
type Msg = {
  role: MsgRole;
  content: string;
  toolName?: string;
};

const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  const { agent, abort, setActiveThread } = useChatAgent();

  const xChatResult = useXChat<Msg, { role: Msg['role']; text: string; toolName?: string }>({
    agent: agent as any,
    defaultMessages: [],
    transformMessage: ({ originMessage, chunk }: { originMessage?: Msg; chunk?: any }) => {
      if (chunk === undefined || chunk === null) {
        return originMessage ?? { role: 'assistant' as MsgRole, content: '' };
      }
      // chunk 现在是完整的 Msg 对象
      if (typeof chunk === 'object' && 'role' in chunk) {
        return chunk as Msg;
      }
      // 兼容旧的字符串格式
      return {
        role: 'assistant' as MsgRole,
        content: (originMessage?.content ?? '') + String(chunk),
      };
    },
    parser: (m: Msg) => {
      // 处理空消息的情况（useXChat 内部可能传入 undefined）
      if (!m || (!m.role && !m.content)) {
        return { role: 'assistant', text: '', toolName: undefined };
      }
      return { role: m.role, text: m.content, toolName: m.toolName };
    },
  });

  const { parsedMessages, onRequest, setMessages } = xChatResult;
  const isRequesting = agent?.isRequesting?.() ?? false;

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
  } = useChatThread({
    userChatId,
    onMessagesLoaded: setMessages,
    onAbort: abort,
  });

  const {
    editingKey,
    renameDraft,
    setRenameDraft,
    cancelRename,
    handleRenameStart,
    handleRenameSubmit,
  } = useChatRename(conversations, updateConversation);

  const bodyRef = useAutoScroll(parsedMessages);

  // 同步 activeKey 到 agent
  useEffect(() => {
    setActiveThread(activeKey);
  }, [activeKey, setActiveThread]);

  // 组件卸载时中止请求
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

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
        <ChatHeader>
          <Typography variant="subtitle2">AI Assistant</Typography>
          {isCreatingThread && (
            <Typography variant="caption" color="text.secondary">
              Creating thread...
            </Typography>
          )}
          {userChatId && activeKey && (
            <Typography variant="caption" color="text.secondary">
              Thread ID: {activeKey}
            </Typography>
          )}
        </ChatHeader>
        <ChatBody ref={bodyRef}>
          {errorMessage ? (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          ) : (
            <>
              {isActiveConversationDisabled && (
                <Typography variant="body2" color="text.secondary">
                  This conversation is disabled. Enable it from the menu to continue.
                </Typography>
              )}
              {parsedMessages.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {userChatId
                    ? activeKey
                      ? 'This thread has no messages yet.'
                      : 'Select a conversation or create a new chat to begin.'
                    : 'Preparing chat session...'}
                </Typography>
              ) : (
                <Bubble.List
                  roles={BUBBLE_ROLES}
                  items={parsedMessages.map((it, idx) => {
                    // tool_call 需要自定义显示（带 Spin + 文字）
                    if (it.message.role === 'tool_call') {
                      return {
                        key: idx,
                        role: 'assistant' as const, // 使用 assistant 角色样式
                        content: (
                          <Space>
                            <Spin size="small" />
                            {it.message.text}
                          </Space>
                        ),
                        loading: false,
                      };
                    }
                    // assistant 消息：如果内容为空且正在请求且没有工具调用，显示默认 loading
                    if (it.message.role === 'assistant') {
                      const isEmpty = !it.message.text || it.message.text.trim() === '';
                      // 检查是否有工具调用消息
                      const hasToolCall = parsedMessages.some(m => m.message.role === 'tool_call');
                      return {
                        key: idx,
                        role: 'assistant' as const,
                        content: it.message.text,
                        loading: isEmpty && isRequesting && !hasToolCall, // 无工具调用时才显示默认 loading
                      };
                    }
                    // 用户消息
                    return {
                      key: idx,
                      role: it.message.role as 'user' | 'assistant' | 'tool_call',
                      content: it.message.text,
                      loading: false,
                    };
                  })}
                />
              )}
            </>
          )}
        </ChatBody>
        <ChatFooter>
          <Sender
            value={input}
            onChange={setInput}
            onSubmit={() => {
              const text = input.trim();
              if (!text || !activeKey || isActiveConversationDisabled) return;
              onRequest({
                threadId: activeKey,
                message: { role: 'user', content: text },
              });
              setInput('');
            }}
            placeholder={
              isActiveConversationDisabled ? 'Enable this conversation to send messages.' : 'Type your message...'
            }
            disabled={!userChatId || !activeKey || isActiveConversationDisabled}
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
