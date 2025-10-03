import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender } from '@ant-design/x';
import ChatIcon from '@mui/icons-material/Chat';
import ChatSidebar from './component/ChatSidebar';
import { Button } from 'antd';
import { sendChatMessage, fetchConversations, fetchConversationMessages } from '@/api/chatApi';

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
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentConversation = conversations.find((conv) => conv.key === activeKey);
  const messages = currentConversation?.messages || [];

  // 加载对话列表
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const data = await fetchConversations();

        // 转换后端数据为前端格式
        const convs: ConversationItem[] = data.map((conv) => ({
          key: conv.id,
          label: conv.title,
          timestamp: new Date(conv.createdAt).getTime(),
          messages: [],
        }));

        if (convs.length === 0) {
          // 如果没有对话，创建一个新的
          convs.push({
            key: 'new-1',
            label: 'New Chat',
            timestamp: Date.now(),
            messages: [],
          });
        }

        setConversations(convs);
        setActiveKey(convs[0].key);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // 出错时创建默认对话
        const newConv: ConversationItem = {
          key: 'new-1',
          label: 'New Chat',
          timestamp: Date.now(),
          messages: [],
        };
        setConversations([newConv]);
        setActiveKey('new-1');
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // 当切换对话时加载消息历史
  useEffect(() => {
    if (!activeKey || activeKey.startsWith('new-')) return;

    const loadMessages = async () => {
      try {
        const data = await fetchConversationMessages(activeKey);
        const msgs: Message[] = data.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createAt: new Date(msg.createdAt).getTime(),
        }));

        setConversations((prev) =>
          prev.map((conv) =>
            conv.key === activeKey ? { ...conv, messages: msgs } : conv
          )
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [activeKey]);

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

  if (isLoadingConversations) {
    return (
      <WindowContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Typography>Loading conversations...</Typography>
        </Box>
      </WindowContainer>
    );
  }

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
