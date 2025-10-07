import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Sender } from '@ant-design/x';
import { Button } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { createThread as createThreadApi, searchThreads } from '@/api/chatBotApi';

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

interface ConversationItem {
  key: string;
  label: string;
  updatedAt: number;
}

const THREAD_TTL_SECONDS = 600; // 10 minutes

const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = ensureUserChatId();
    setUserChatId(id);
  }, []);

  useEffect(() => {
    if (!userChatId) return;

    const fetchThreads = async () => {
      try {
        const threads = await searchThreads({
          metadata: { user_id: userChatId },
          limit: 20,
          offset: 0,
          sort_by: 'updated_at',
          sort_order: 'desc',
          select: ['thread_id', 'created_at', 'updated_at', 'status', 'metadata'],
        });

        const mapped: ConversationItem[] = threads.map(thread => ({
          key: thread.thread_id,
          label: 'New Chat',
          updatedAt: new Date(thread.updated_at || thread.created_at || Date.now()).getTime(),
        }));

        setConversations(mapped);
        if (mapped.length > 0) {
          setActiveKey(mapped[0].key);
        }
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setErrorMessage('Failed to load your chat history.');
      }
    };

    fetchThreads();
  }, [userChatId]);

  const createThread = useCallback(
    (userId: string) =>
      createThreadApi({
        metadata: {
          user_id: userId,
          user_type: 'Guest',
        },
        ttl: {
          strategy: 'delete',
          ttl: THREAD_TTL_SECONDS,
        },
      }),
    [createThreadApi],
  );

  const handleNewChat = useCallback(async () => {
    if (!userChatId || isCreatingThread) {
      return;
    }

    setIsCreatingThread(true);
    setErrorMessage(null);

    try {
      const thread = await createThread(userChatId);
      const threadId: string = thread.thread_id;

      const newConversation: ConversationItem = {
        key: threadId,
        label: 'New Chat',
        updatedAt: new Date(thread?.updated_at || thread?.created_at || Date.now()).getTime(),
      };

      setConversations(prev => {
        const next = [newConversation, ...prev.filter(item => item.key !== threadId)];
        return next.sort((a, b) => b.updatedAt - a.updatedAt);
      });
      setActiveKey(threadId);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [createThread, isCreatingThread, userChatId]);

  const handleActiveChange = useCallback((key: string) => {
    setActiveKey(key);
    setErrorMessage(null);
  }, []);

  return (
    <WindowContainer>
      <ChatSidebar
        conversations={conversations.map(item => ({
          key: item.key,
          label: item.label,
          timestamp: item.updatedAt,
        }))}
        activeKey={activeKey}
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
        </ChatHeader>
        <ChatBody>
          {errorMessage ? (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {userChatId
                ? activeKey
                  ? `Thread ready: ${activeKey}. Message streaming coming soon.`
                  : 'Select a conversation or create a new chat to begin.'
                : 'Preparing chat session...'}
            </Typography>
          )}
        </ChatBody>
        <ChatFooter>
          <Sender
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
            placeholder="Type your message..."
            disabled={!userChatId || !activeKey}
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
