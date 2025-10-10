/**
 * 共享常量定义
 */

import { UserOutlined } from '@ant-design/icons';
import { Space, Spin, Typography } from 'antd';
import type { GetProp } from 'antd';
import type { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import markdownit from 'markdown-it';

const md = markdownit({ html: true, breaks: true });

// Markdown 渲染器
export const renderMarkdown: BubbleProps['messageRender'] = content => {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );
};

// Bubble 角色配置
export const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    variant: 'shadow',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#fff', backgroundColor: '#87d068' }
    },
  },
  assistant: {
    placement: 'start',
    variant: 'filled',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#f56a00', backgroundColor: '#fde3cf' }
    },
    messageRender: renderMarkdown,
    typing: { step: 5, interval: 20 },
  },
  tool_call: {
    placement: 'start',
    variant: 'outlined',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#f56a00', backgroundColor: '#fde3cf' }
    },
    messageRender: content => (
      <Space>
        <Spin size="small" />
        <span style={{ color: '#666' }}>{content}</span>
      </Space>
    ),
  },
};

// Thread TTL (生存时间)
export const THREAD_TTL_SECONDS = 600;

// 子代理名称列表
export const SUB_AGENTS = ['|tom:', '|avi:', '|ivy:', '|levan:'] as const;

// Tina 节点名称
export const TINA_NODES = ['tina', 'tina_agent'] as const;
