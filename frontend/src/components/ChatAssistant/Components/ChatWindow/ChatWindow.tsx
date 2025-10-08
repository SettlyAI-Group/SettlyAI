import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender, useXChat } from '@ant-design/x';
import { Button } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { UserOutlined } from '@ant-design/icons';
import { useChatAgent, useChatThread, useChatRename, useAutoScroll } from '../../hooks';

const USER_AVATAR: CSSProperties = { color: '#fff', backgroundColor: '#87d068' };
const BOT_AVATAR: CSSProperties = { color: '#f56a00', backgroundColor: '#fde3cf' };

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

type MsgRole = 'user' | 'assistant';
type Msg = { role: MsgRole; content: string };

const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  const { agent, abort, setActiveThread } = useChatAgent();

  const { parsedMessages, onRequest, setMessages } = useXChat<Msg, { role: Msg['role']; text: string }>({
    agent: agent as any,
    defaultMessages: [],
    transformMessage: ({ originMessage, chunk }: { originMessage?: Msg; chunk?: any }) => {
      if (chunk === undefined || chunk === null) {
        return originMessage ?? { role: 'assistant' as MsgRole, content: '' };
      }
      return {
        role: 'assistant' as MsgRole,
        content: (originMessage?.content ?? '') + String(chunk),
      };
    },
    parser: (m: Msg) => ({ role: m.role, text: m.content }),
  });

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
                parsedMessages.map((it, idx) => (
                  <Bubble
                    key={idx}
                    placement={it.message.role === 'user' ? 'end' : 'start'}
                    content={it.message.text}
                    avatar={{
                      icon: <UserOutlined />,
                      style: it.message.role === 'user' ? USER_AVATAR : BOT_AVATAR,
                    }}
                  />
                ))
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
