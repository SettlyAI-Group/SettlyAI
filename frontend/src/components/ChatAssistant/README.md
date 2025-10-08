# ChatAssistant 组件文档

## 概述

ChatAssistant 是一个悬浮式 AI 聊天助手组件，支持多对话管理和 SSE 流式响应。

## 组件结构

```
ChatAssistant/
├── ChatAssistant.tsx          # 主组件：悬浮按钮 + 拖拽功能
├── Components/
│   └── ChatWindow/            # 聊天窗口
│       ├── ChatWindow.tsx     # 主聊天界面
│       ├── component/
│       │   └── ChatSidebar/   # 侧边栏（对话列表）
│       │       ├── ChatSidebar.tsx
│       │       └── index.ts
│       └── index.ts
└── index.ts
```

## 功能特性

### 1. 悬浮按钮
- ✅ 可拖动到屏幕任意位置
- ✅ 点击打开/关闭聊天窗口
- ✅ Hover 提示文字

### 2. 聊天窗口
- ✅ 侧边栏显示对话列表
- ✅ 支持创建多个对话
- ✅ 对话切换
- ✅ 流式显示 AI 回复
- ✅ Loading 状态（"Thinking..."）

### 3. 消息交互
- ✅ 发送消息
- ✅ 实时流式接收 AI 回复
- ✅ 错误处理
- ✅ 自动清空输入框

## API 接口规范

### 前端 → 后端

#### 请求

**接口地址**: `POST /api/chat/stream`

**请求头**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"  // 可选，如果用户已登录
}
```

**请求体**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "用户的最新消息内容"
    }
  ]
}
```

**数据结构说明**:
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';  // 消息角色
  content: string;              // 消息内容
}

interface RequestBody {
  messages: ChatMessage[];      // 只包含最新的用户消息
}
```

**示例**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is the weather today?"
    }
  ]
}
```

### 后端 → 前端

#### 响应

**响应格式**: Server-Sent Events (SSE)

**响应头**:
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**响应体** (SSE 流):

每条数据行格式：
```
data: <JSON_CONTENT>

```

**支持的数据格式**:

**方式 1: OpenAI 兼容格式** (推荐)
```
data: {"choices":[{"delta":{"content":"Hello"}}]}

data: {"choices":[{"delta":{"content":" world"}}]}

data: [DONE]

```

**方式 2: 简化格式**
```
data: {"content":"Hello"}

data: {"content":" world"}

data: [DONE]

```

**方式 3: 纯文本格式**
```
data: Hello

data:  world

data: [DONE]

```

**数据结构说明**:
```typescript
// OpenAI 格式
interface SSEChunk {
  choices: Array<{
    delta: {
      content: string;  // 每次发送的文本片段
    };
  }>;
}

// 简化格式
interface SSEChunk {
  content: string;  // 每次发送的文本片段
}

// 结束标记
"[DONE]"  // 表示流式响应结束
```

**完整示例**:
```
data: {"choices":[{"delta":{"content":"根据"}}]}

data: {"choices":[{"delta":{"content":"我的"}}]}

data: {"choices":[{"delta":{"content":"理解"}}]}

data: {"choices":[{"delta":{"content":"，今天"}}]}

data: {"choices":[{"delta":{"content":"天气"}}]}

data: {"choices":[{"delta":{"content":"晴朗。"}}]}

data: [DONE]

```

## 工作流程

### 消息发送流程

```
用户输入消息
    ↓
前端创建用户消息对象
    ↓
添加到对话历史
    ↓
创建空的 AI 消息占位符
    ↓
发送 POST 请求到后端
    ↓
后端返回 SSE 流
    ↓
前端逐块接收并追加到 AI 消息
    ↓
收到 [DONE] 标记
    ↓
完成，取消 loading 状态
```

### 状态管理

**对话状态**:
```typescript
interface ConversationItem {
  key: string;           // 对话唯一标识
  label: string;         // 对话标题（如 "New Chat", "Chat 2"）
  timestamp: number;     // 创建时间戳
  messages: Message[];   // 消息列表
}

interface Message {
  id: string;            // 消息唯一标识
  content: string;       // 消息内容
  role: 'user' | 'assistant';  // 消息角色
  createAt: number;      // 创建时间戳
}
```

**前端维护**:
- 所有对话列表
- 当前激活的对话
- 每个对话的完整消息历史

**后端维护**:
- 用户的对话上下文
- 对话状态（如果使用 GraphRAG）
- 对话历史（可选）

## 关键技术点

### 1. SSE (Server-Sent Events)
使用 Fetch API 的 `ReadableStream` 读取 SSE 响应：

```typescript
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  // 处理 SSE 数据
}
```

### 2. 流式更新
每次收到数据块时，更新同一条 AI 消息的 content：

```typescript
onMessage: (chunk) => {
  setConversations((prev) =>
    prev.map((conv) => ({
      ...conv,
      messages: conv.messages.map((msg) =>
        msg.id === aiMessageId
          ? { ...msg, content: msg.content + chunk }  // 追加内容
          : msg
      ),
    }))
  );
}
```

### 3. 请求取消
使用 `AbortController` 支持取消正在进行的请求：

```typescript
const abortController = new AbortController();

await fetch('/api/chat/stream', {
  signal: abortController.signal,
});

// 取消请求
abortController.abort();
```

## 错误处理

### 前端错误处理

1. **网络错误**: 显示 "Error: Failed to get response from AI."
2. **超时**: 由浏览器默认处理
3. **取消请求**: 静默处理，不显示错误

### 后端应返回的错误

如果发生错误，后端应该：
1. 返回适当的 HTTP 状态码（如 400, 500）
2. 或在 SSE 流中发送错误信息：
```
data: {"error": "错误描述"}

```

## 依赖库

- **@ant-design/x**: Bubble, Sender, Conversations 组件
- **antd**: Button 组件
- **@mui/material**: 样式和 UI 组件
- **react-draggable**: 拖拽功能

## 使用示例

```tsx
import ChatAssistant from '@/components/ChatAssistant';

function App() {
  return (
    <div>
      <ChatAssistant />
    </div>
  );
}
```

## 注意事项

1. **对话历史管理**: 前端只发送最新的用户消息，后端需要自己维护对话上下文
2. **SSE 连接**: 确保后端正确设置 SSE 响应头
3. **Token 认证**: 如果需要认证，确保 token 存储在 localStorage
4. **浏览器兼容性**: SSE 需要现代浏览器支持

## 未来增强

- [ ] 消息重发功能
- [ ] 对话重命名
- [ ] 对话删除
- [ ] Markdown 渲染
- [ ] 代码高亮
- [ ] 消息复制
- [ ] 自动滚动到最新消息
- [ ] 消息时间戳显示
