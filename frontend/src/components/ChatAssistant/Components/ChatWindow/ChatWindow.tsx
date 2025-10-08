import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Button } from 'antd';
import ChatSidebar from './component/ChatSidebar';
import { ensureUserChatId } from '../../utils/userChatId';
import { createThread as createThreadApi, searchThreads } from '@/api/chatBotApi';
import { UserOutlined } from '@ant-design/icons';

const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

const barAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
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

type MsgRole = 'user' | 'assistant';

type Msg = {
  role: MsgRole;
  content: string;
};

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
  const [input, setInput] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeThreadRef = useRef('');

  useEffect(() => {
    const id = ensureUserChatId();
    setUserChatId(id);
  }, []);

  useEffect(() => {
    activeThreadRef.current = activeKey || '';
  }, [activeKey]);

  const normalizeMessages = useCallback((raw: any[] = []) => {
    return raw.map((m: any, i: number) => {
      const role = m.role ?? (m.type === 'human' || m.type === 'HumanMessage' ? 'user' : 'assistant');

      const text =
        typeof m.content === 'string'
          ? m.content
          : Array.isArray(m.content)
              ? m.content
                  .filter((c: any) => c?.type === 'text')
                  .map((c: any) => c.text)
                  .join('')
              : (m.text ?? m.value ?? '');

      return { id: m.id ?? String(i), role, text };
    });
  }, []);


  // 简单把 tool 名字里的人名抠出来（按你的命名习惯改一下就行）
  function pickColleagueName(toolName = ''): string | null {
    // 常见命名：ask_tom_xxx / callAvi / query_tina / tom_search / avi_plan ...
    const m = toolName.match(/(tina|tom|avi)/i);
    if (!m) return null;
    const name = m[1].toLowerCase();
    if (name === 'tina') return 'Tina';
    if (name === 'tom') return 'Tom';
    if (name === 'avi') return 'Avi';
    return name[0].toUpperCase() + name.slice(1);
  }

  const [agent] = useXAgent<Msg>({
    request: async (info, { onUpdate, onSuccess, onError, onStream }) => {
      const ac = new AbortController();
      onStream?.(ac);

      try {
        //从info中拿规定好的格式，发送message，然后后端发请求，得到steam的response
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

        console.log('[ChatWindow][stream] request started', {
          threadId: info.threadId,
          userMessage: info.message?.content,
        });
        abortControllerRef.current = ac;

        //精筛需要的文本
        const shownToolCalls = new Set<string>(); // 去重：同一次调用只提示一次
        const collected: string[] = [];

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const flushBuffer = (isFinal = false) => {
          let searchIndex: number;
          let normalizedBuffer = buffer.replace(/\r\n/g, '\n');

          while ((searchIndex = normalizedBuffer.indexOf('\n\n')) !== -1) {
            const rawEvent = normalizedBuffer.slice(0, searchIndex);
            normalizedBuffer = normalizedBuffer.slice(searchIndex + 2);

            const lines = rawEvent.split('\n');
            let eventName = '';
            const dataLines: string[] = [];

            lines.forEach(line => {
              if (!line) {
                return;
              }
              const colonIndex = line.indexOf(':');
              if (colonIndex === -1) {
                return;
              }

              const field = line.slice(0, colonIndex).trim();
              const value = line.slice(colonIndex + 1).trimStart();

              if (!field) {
                return;
              }

              if (field === 'event') {
                eventName = value;
              } else if (field === 'data') {
                dataLines.push(value);
              }
            });

            const data = dataLines.join('\n');
            console.log('[ChatWindow][stream] parsed chunk info', { eventName, data });
            if (!data || data === '[DONE]' || data.startsWith(':')) {
              console.log('[ChatWindow][stream] skip chunk', {
                reason: 'empty or heartbeat',
                data,
              });
              continue;
            }

            if (activeThreadRef.current !== info.threadId) {
              console.log('[ChatWindow][stream] skip chunk', {
                reason: 'thread switched',
                activeThread: activeThreadRef.current,
                streamThread: info.threadId,
              });
              continue;
            }

            let msg: any;
            let meta: any;
            try {
              [msg, meta] = JSON.parse(data) ?? [];
            } catch {
              console.log('[ChatWindow][stream] failed to JSON.parse payload', data);
              continue;
            }

            if (eventName && !eventName.startsWith('messages|')) {
              console.log('[ChatWindow][stream] skip chunk', {
                reason: 'event mismatch',
                eventName,
              });
              continue;
            }

            const node = meta?.langgraph_node;
            const eventTarget = eventName.split('|')[1] ?? '';
            const isTinaNode =
              node === 'tina' || node === 'tina_agent' || eventTarget.startsWith('tina_agent');

            if (!isTinaNode) {
              console.log('[ChatWindow][stream] skip chunk', {
                reason: 'node mismatch',
                node,
                eventTarget,
              });
              continue;
            }

            const content = Array.isArray(msg?.content)
              ? msg.content
              : typeof msg?.content === 'string'
                ? [{ type: 'text', text: msg.content }]
                : [];

            for (const c of content) {
              if (c?.type === 'text') {
                const piece = String(c.text ?? '');
                if (!piece) {
                  continue;
                }
                console.log('[ChatWindow][stream] onUpdate text', piece);
                onUpdate(piece);
                collected.push(piece);
              } else if (c?.type === 'tool_call') {
                const toolId = c?.id ?? `${meta?.run_id}:${meta?.langgraph_step}`;
                if (shownToolCalls.has(toolId)) {
                  continue;
                }
                shownToolCalls.add(toolId);

                const colleague = pickColleagueName(c?.name) ?? '同事';
                const hint = `（正在和${colleague}沟通…）`;
                console.log('[ChatWindow][stream] onUpdate tool hint', hint);
                onUpdate(hint);
                collected.push(hint);
              }
            }
          }

          buffer = normalizedBuffer;

          if (isFinal && buffer.trim().length > 0) {
            console.log('[ChatWindow][stream] leftover buffer after final flush', buffer);
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            buffer += decoder.decode();
            flushBuffer(true);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          flushBuffer();
        }

        console.log('[ChatWindow][stream] onSuccess', collected);
        if (activeThreadRef.current === info.threadId) {
          onSuccess(collected); // 收尾
        } else {
          console.log('[ChatWindow][stream] skip onSuccess due to thread switch');
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
          console.log('[ChatWindow][stream] aborted', { threadId: info.threadId });
        } else {
          console.log('[ChatWindow][stream] onError', e);
          onError(e as Error);
        }
      } finally {
        if (abortControllerRef.current === ac) {
          abortControllerRef.current = null;
        }
      }
    },
  });

  const { parsedMessages, onRequest, setMessages } = useXChat<
    Msg,
    { role: Msg['role']; text: string }
  >({
    agent,
    defaultMessages: [],
    transformMessage: ({ originMessage, chunk }) => {
      if (typeof chunk === 'undefined' || chunk === null) {
        return originMessage ?? { role: 'assistant', content: '' };
      }

      return {
        role: 'assistant',
        content: (originMessage?.content ?? '') + String(chunk),
      };
    },
    // 渲染映射
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

        setConversations(mapped);

        if (threads.length === 0) {
          setActiveKey('');
          setMessages(() => []);
          return;
        }

        const first = threads[0];
        setActiveKey(first.thread_id);

        const rawMessages = first.values?.messages ?? [];
        const uiMsgs = normalizeMessages(rawMessages);
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
  }, [normalizeMessages, setMessages, userChatId]);

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

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

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
      setMessages(() => []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create a new chat. Please try again.');
    } finally {
      setIsCreatingThread(false);
    }
  }, [createThread, isCreatingThread, setMessages, userChatId]);

  const handleActiveChange = useCallback(
    async (key: string) => {
      if (!key || key === activeKey) {
        return;
      }

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

        const raw = thread?.values?.messages ?? [];
        const uiMsgs = normalizeMessages(raw);
        const historyMessages = uiMsgs.map((m, index) => ({
          id: `history_${index}`,
          status: 'success' as const,
          message: { role: m.role as Msg['role'], content: m.text },
        }));
        if (activeThreadRef.current === key) {
          setMessages(() => historyMessages);
        } else {
          console.log('[ChatWindow] skip history update, thread switched', {
            target: key,
            current: activeThreadRef.current,
          });
        }
      } catch (e) {
        console.error(e);
        setErrorMessage('Failed to load this conversation.');
        if (activeThreadRef.current === key) {
          setMessages(() => []);
        }
      }
    },
    [activeKey, normalizeMessages, setMessages, userChatId],
  );

  // 自动滚到底下
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [parsedMessages]);

  useEffect(() => {
    console.log('[ChatWindow] parsedMessages updated', parsedMessages);
  }, [parsedMessages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
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
          ) : parsedMessages.length === 0 ? (
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
                avatar={
                  it.message.role === 'user'
                    ? { icon: <UserOutlined />, style: barAvatar }
                    : { icon: <UserOutlined />, style: fooAvatar }
                }
              />
            ))
          )}
        </ChatBody>
        <ChatFooter>
          <Sender
            value={input}
            onChange={v => setInput(v)}
            onSubmit={() => {
              const text = input.trim();
              if (!text || !activeKey) return;
              onRequest({
                threadId: activeKey,
                message: { role: 'user', content: text },
              });
              setInput('');
            }}
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
