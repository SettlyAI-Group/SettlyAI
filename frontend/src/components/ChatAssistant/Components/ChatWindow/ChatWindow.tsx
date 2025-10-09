import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender, useXChat } from '@ant-design/x';
import type { GetProp } from 'antd';
import type { BubbleProps } from '@ant-design/x';
import { Button, Space, Spin, Typography as AntTypography } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { UserOutlined } from '@ant-design/icons';
import { useChatAgent, useChatThread, useChatRename } from '../../hooks';
import markdownit from 'markdown-it';

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps['messageRender'] = content => {
  return (
    <AntTypography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </AntTypography>
  );
};

const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { color: '#fff', backgroundColor: '#87d068' } },
  },
  assistant: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { color: '#f56a00', backgroundColor: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    messageRender: renderMarkdown,
  },
  tool_call: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { color: '#f56a00', backgroundColor: '#fde3cf' } },
    loadingRender: () => (
      <Space>
        <Spin size="small" />
      </Space>
    ),
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

const ChatFooter = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const bubbleListStyles: CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: 16,
};

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

  const { parsedMessages, onRequest, setMessages } = useXChat<
    Msg,
    { role: Msg['role']; text: string; toolName?: string }
  >({
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

  const { editingKey, renameDraft, setRenameDraft, cancelRename, handleRenameStart, handleRenameSubmit } =
    useChatRename(conversations, updateConversation);

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
        <Bubble.List
          className="chat-no-drag"
          roles={BUBBLE_ROLES}
          style={bubbleListStyles}
          items={parsedMessages.map((it, idx) => {
            const isEmpty = !it.message.text || it.message.text.trim() === '';
            const hasToolCall = parsedMessages.some(m => m.message.role === 'tool_call');

            // 统一返回格式,让 BUBBLE_ROLES 处理样式
            return {
              key: idx,
              role: it.message.role,
              content: it.message.text,
              // 只有 assistant 且内容为空且无工具调用时才显示 loading
              loading: it.message.role === 'assistant' && isEmpty && isRequesting && !hasToolCall,
            };
          })}
        />
        <ChatFooter className="chat-no-drag">
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
