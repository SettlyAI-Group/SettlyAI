import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Button } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { createThread as createThreadApi, deleteThread as deleteThreadApi, searchThreads } from '@/api/chatBotApi';
import { UserOutlined } from '@ant-design/icons';

const USER_AVATAR: CSSProperties = { color: '#fff', backgroundColor: '#87d068' };
const BOT_AVATAR: CSSProperties = { color: '#f56a00', backgroundColor: '#fde3cf' };
const THREAD_TTL_SECONDS = 600;

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

interface ConversationItem {
  key: string;
  label: string;
  updatedAt: number;
  isDisabled?: boolean;
}

const extractColleagueName = (toolName = ''): string => {
  const match = toolName.match(/(tina|tom|avi)/i);
  if (!match) return '同事';
  const name = match[1].toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const normalizeMessages = (raw: any[] = []) => {
  return raw.map((m: any, i: number) => {
    const role = m.role ?? (m.type === 'human' || m.type === 'HumanMessage' ? 'user' : 'assistant');
    const text =
      typeof m.content === 'string'
        ? m.content
        : Array.isArray(m.content)
          ? m.content.filter((c: any) => c?.type === 'text').map((c: any) => c.text).join('')
          : (m.text ?? m.value ?? '');
    return { id: m.id ?? String(i), role, text };
  });
};

const ChatWindow = () => {
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef('');
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUserChatId(ensureUserChatId());
  }, []);

  useEffect(() => {
    activeThreadRef.current = activeKey;
  }, [activeKey]);

  const cancelRename = useCallback(() => {
    setEditingKey(null);
    setRenameDraft('');
  }, []);

  const updateConversation = useCallback((key: string, updates: Partial<ConversationItem>) => {
    setConversations(prev => prev.map(item => (item.key === key ? { ...item, ...updates } : item)));
  }, []);

  const [agent] = useXAgent<Msg>({
    request: async (info, { onUpdate, onSuccess, onError, onStream }) => {
      const ac = new AbortController();
      onStream?.(ac);

      try {
        const res = await fetch(`/langgraph/threads/${info.threadId}/runs/stream`, {
          method: 'POST',
          signal: ac.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assistant_id: 'graph',
            input: { messages: [info.message] },
            stream_mode: 'messages-tuple',
            stream_subgraphs: true,
          }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        abortControllerRef.current = ac;

        const shownToolCalls = new Set<string>();
        const collected: string[] = [];
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const flushBuffer = () => {
          let normalizedBuffer = buffer.replace(/\r\n/g, '\n');
          let searchIndex: number;

          while ((searchIndex = normalizedBuffer.indexOf('\n\n')) !== -1) {
            const rawEvent = normalizedBuffer.slice(0, searchIndex);
            normalizedBuffer = normalizedBuffer.slice(searchIndex + 2);

            const lines = rawEvent.split('\n');
            let eventName = '';
            const dataLines: string[] = [];

            for (const line of lines) {
              if (!line) continue;
              const colonIndex = line.indexOf(':');
              if (colonIndex === -1) continue;

              const field = line.slice(0, colonIndex).trim();
              const value = line.slice(colonIndex + 1).trimStart();
              if (!field) continue;

              if (field === 'event') eventName = value;
              else if (field === 'data') dataLines.push(value);
            }

            const data = dataLines.join('\n');
            if (!data || data === '[DONE]' || data.startsWith(':')) continue;
            if (activeThreadRef.current !== info.threadId) continue;

            let msg: any, meta: any;
            try {
              [msg, meta] = JSON.parse(data) ?? [];
            } catch {
              continue;
            }

            if (eventName && !eventName.startsWith('messages|')) continue;

            const node = meta?.langgraph_node;
            const eventTarget = eventName.split('|')[1] ?? '';
            const isTinaNode = node === 'tina' || node === 'tina_agent' || eventTarget.startsWith('tina_agent');
            if (!isTinaNode) continue;

            const content = Array.isArray(msg?.content)
              ? msg.content
              : typeof msg?.content === 'string'
                ? [{ type: 'text', text: msg.content }]
                : [];

            for (const c of content) {
              if (c?.type === 'text') {
                const piece = String(c.text ?? '');
                if (!piece) continue;
                onUpdate(piece);
                collected.push(piece);
              } else if (c?.type === 'tool_call') {
                const toolId = c?.id ?? `${meta?.run_id}:${meta?.langgraph_step}`;
                if (shownToolCalls.has(toolId)) continue;
                shownToolCalls.add(toolId);

                const hint = `（正在和${extractColleagueName(c?.name)}沟通…）`;
                onUpdate(hint);
                collected.push(hint);
              }
            }
          }

          buffer = normalizedBuffer;
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            buffer += decoder.decode();
            flushBuffer();
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          flushBuffer();
        }

        if (activeThreadRef.current === info.threadId) {
          onSuccess(collected);
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          onError(e as Error);
        }
      } finally {
        if (abortControllerRef.current === ac) {
          abortControllerRef.current = null;
        }
      }
    },
  });

  const { parsedMessages, onRequest, setMessages } = useXChat<Msg, { role: Msg['role']; text: string }>({
    agent,
    defaultMessages: [],
    transformMessage: ({ originMessage, chunk }) => {
      if (chunk === undefined || chunk === null) {
        return originMessage ?? { role: 'assistant', content: '' };
      }
      return {
        role: 'assistant',
        content: (originMessage?.content ?? '') + String(chunk),
      };
    },
    parser: m => ({ role: m.role, text: m.content }),
  });

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
          select: ['thread_id', 'created_at', 'updated_at', 'status', 'metadata', 'values'],
        });

        const mapped: ConversationItem[] = threads.map(thread => ({
          key: thread.thread_id,
          label: 'New Chat',
          updatedAt: new Date(thread.updated_at || thread.created_at || Date.now()).getTime(),
        }));

        setConversations(prev => {
          const previousMap = new Map(prev.map(item => [item.key, item]));
          return mapped.map(item => {
            const prevItem = previousMap.get(item.key);
            return {
              ...item,
              label: prevItem?.label ?? item.label,
              isDisabled: prevItem?.isDisabled ?? false,
            };
          });
        });

        if (editingKey && !threads.some(thread => thread.thread_id === editingKey)) {
          cancelRename();
        }

        if (threads.length === 0) {
          setActiveKey('');
          setMessages(() => []);
          return;
        }

        const first = threads[0];
        setActiveKey(first.thread_id);

        const uiMsgs = normalizeMessages(first.values?.messages ?? []);
        const historyMessages = uiMsgs.map((m, index) => ({
          id: `history_${index}`,
          status: 'success' as const,
          message: { role: m.role as Msg['role'], content: m.text },
        }));
        setMessages(() => historyMessages);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setErrorMessage('Failed to load your chat history.');
      }
    };

    fetchThreads();
  }, [userChatId, setMessages, editingKey, cancelRename]);

  const handleNewChat = useCallback(async () => {
    if (!userChatId || isCreatingThread) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsCreatingThread(true);
    setErrorMessage(null);

    try {
      const thread = await createThreadApi({
        metadata: { user_id: userChatId, user_type: 'Guest' },
        ttl: { strategy: 'delete', ttl: THREAD_TTL_SECONDS },
      });

      const newConversation: ConversationItem = {
        key: thread.thread_id,
        label: 'New Chat',
        updatedAt: new Date(thread?.updated_at || thread?.created_at || Date.now()).getTime(),
        isDisabled: false,
      };

      setConversations(prev => {
        const next = [newConversation, ...prev.filter(item => item.key !== thread.thread_id)];
        return next.sort((a, b) => b.updatedAt - a.updatedAt);
      });
      setActiveKey(thread.thread_id);
      setMessages(() => []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [userChatId, isCreatingThread, setMessages]);

  const handleActiveChange = useCallback(
    async (key: string) => {
      if (!key || key === activeKey) return;

      const targetConversation = conversations.find(item => item.key === key);
      if (targetConversation?.isDisabled) return;

      abortControllerRef.current?.abort();
      abortControllerRef.current = null;

      setActiveKey(key);
      setErrorMessage(null);
      setMessages(() => []);

      try {
        const [thread] = await searchThreads({
          ids: [key],
          limit: 1,
          select: ['values'],
        });

        const uiMsgs = normalizeMessages(thread?.values?.messages ?? []);
        const historyMessages = uiMsgs.map((m, index) => ({
          id: `history_${index}`,
          status: 'success' as const,
          message: { role: m.role as Msg['role'], content: m.text },
        }));
        if (activeThreadRef.current === key) {
          setMessages(() => historyMessages);
        }
      } catch (e) {
        console.error(e);
        setErrorMessage('Failed to load this conversation.');
        if (activeThreadRef.current === key) {
          setMessages(() => []);
        }
      }
    },
    [activeKey, conversations, setMessages]
  );

  const handleDeleteConversation = useCallback(
    async (key: string) => {
      if (!key) return;

      const isActive = activeKey === key;
      const wasEditing = editingKey === key;

      if (isActive) {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
      }

      setErrorMessage(null);

      try {
        await deleteThreadApi(key);

        if (wasEditing) cancelRename();

        let nextActiveKey: string | null = null;
        setConversations(prev => {
          const filtered = prev.filter(item => item.key !== key);
          nextActiveKey = filtered.length > 0 ? filtered[0].key : null;
          return filtered;
        });

        if (isActive) {
          if (nextActiveKey) {
            await handleActiveChange(nextActiveKey);
          } else {
            setActiveKey('');
            setMessages(() => []);
          }
        }
      } catch (error) {
        console.error('Failed to delete thread:', error);
        setErrorMessage('Failed to delete conversation.');
      }
    },
    [activeKey, editingKey, handleActiveChange, cancelRename, setMessages]
  );

  const handleRenameStart = useCallback(
    (key: string) => {
      const target = conversations.find(item => item.key === key);
      setEditingKey(key);
      setRenameDraft(target?.label ?? '');
    },
    [conversations]
  );

  const handleRenameSubmit = useCallback(
    (key: string, value: string) => {
      const nextLabel = value.trim();
      if (nextLabel) {
        updateConversation(key, { label: nextLabel });
      }
      cancelRename();
    },
    [updateConversation, cancelRename]
  );

  const handleToggleDisable = useCallback(
    (key: string) => {
      const target = conversations.find(item => item.key === key);
      updateConversation(key, { isDisabled: !target?.isDisabled });
      if (editingKey === key) cancelRename();
    },
    [conversations, editingKey, updateConversation, cancelRename]
  );

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [parsedMessages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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
