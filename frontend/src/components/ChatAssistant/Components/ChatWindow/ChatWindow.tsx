import { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender } from '@ant-design/x';
import ChatIcon from '@mui/icons-material/Chat';
import ChatSidebar from './component/ChatSidebar';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import { sendChatMessage } from '@/api/chatApi';

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
  flexDirection: 'row',
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
  backgroundColor: theme.palette.background.paper,
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
    '&:hover': {
      backgroundColor: '#333333 !important',
      borderColor: '#333333 !important',
    },
    '&:active, &:focus': {
      backgroundColor: '#333333 !important',
      borderColor: '#333333 !important',
    },
  },
}));

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createAt: number;
}

interface ConversationItem {
  key: string;
  label: string;
  timestamp: number;
  messages: Message[];
}

const ChatWindow = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      key: '1',
      label: 'New Chat',
      timestamp: Date.now(),
      messages: [],
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentConversation = conversations.find((conv) => conv.key === activeKey);
  const messages = currentConversation?.messages || [];

  const handleSend = async (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      createAt: Date.now(),
    };

    // 更新当前会话的消息
    setConversations((prev) =>
      prev.map((conv) =>
        conv.key === activeKey
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    // 清空输入框
    setInputValue('');

    // 设置 loading 状态
    setLoading(true);

    // 创建 AI 消息占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      createAt: Date.now(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.key === activeKey
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      )
    );

    // 创建 AbortController 用于取消请求
    abortControllerRef.current = new AbortController();

    // 只发送最新的用户消息（后端自己维护对话历史）
    const chatMessages = [{
      role: newMessage.role,
      content: newMessage.content,
    }];

    // 发送 SSE 请求
    await sendChatMessage(chatMessages, {
      signal: abortControllerRef.current.signal,
      onMessage: (chunk) => {
        // 流式更新 AI 消息内容
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.key !== activeKey) return conv;
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              ),
            };
          })
        );
      },
      onComplete: () => {
        setLoading(false);
        abortControllerRef.current = null;
      },
      onError: (error) => {
        console.error('Chat error:', error);
        setLoading(false);
        abortControllerRef.current = null;
        // 更新错误消息
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.key !== activeKey) return conv;
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: 'Error: Failed to get response from AI.' }
                  : msg
              ),
            };
          })
        );
      },
    });
  };

  const handleNewChat = () => {
    const newKey = Date.now().toString();
    const newConversation: ConversationItem = {
      key: newKey,
      label: `Chat ${conversations.length + 1}`,
      timestamp: Date.now(),
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setActiveKey(newKey);
  };

  return (
    <WindowContainer>
      <ChatSidebar
        conversations={conversations}
        activeKey={activeKey}
        onActiveChange={setActiveKey}
        onNewChat={handleNewChat}
      />

      <ChatContainer>
        <ChatHeader>
          <Typography variant="subtitle2">{currentConversation?.label || 'AI Assistant'}</Typography>
        </ChatHeader>
        <ChatBody>
          {messages.map((msg) => (
            <Bubble
              key={msg.id}
              placement={msg.role === 'user' ? 'end' : 'start'}
              content={msg.content}
              avatar={msg.role === 'assistant' ? { icon: <ChatIcon /> } : undefined}
            />
          ))}
          {loading && (
            <Bubble
              placement="start"
              content="Thinking..."
              avatar={{ icon: <ChatIcon /> }}
              typing
            />
          )}
        </ChatBody>
        <ChatFooter>
          <Sender
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder="Type your message..."
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
