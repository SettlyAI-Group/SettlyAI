/**
 * 共享常量定义
 */

import { UserOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Spin, Typography } from 'antd';
import type { GetProp } from 'antd';
import type { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import markdownit from 'markdown-it';

// Tina 的头像图标（优雅、现代、女性化）
export const TinaAvatar = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #7B61FF 0%, #9B81FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    T
  </div>
);

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// Markdown 渲染器
export const renderMarkdown: BubbleProps['messageRender'] = content => {
  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: md.render(content) }}
    />
  );
};

// Bubble 角色配置
export const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    variant: 'filled',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#fff', backgroundColor: '#52C41A' }
    },
    styles: {
      content: {
        background: 'linear-gradient(135deg, #7B61FF 0%, #9B81FF 100%)',
        color: '#fff',
      }
    }
  },
  assistant: {
    placement: 'start',
    variant: 'filled',
    avatar: {
      icon: <TinaAvatar />,
      style: {
        backgroundColor: '#F5F3FF',
        border: '2px solid #7B61FF20',
      }
    },
    messageRender: renderMarkdown,
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        background: '#FFFFFF',
        border: '1px solid #F0F0F0',
      }
    }
  },
  tool_call: {
    placement: 'start',
    variant: 'outlined',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#1890FF', backgroundColor: '#E6F7FF' }
    },
    messageRender: content => (
      <Space>
        <Spin size="small" />
        <span style={{ color: '#666' }}>{content}</span>
      </Space>
    ),
  },
  error: {
    placement: 'start',
    variant: 'filled',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#FF4D4F', backgroundColor: '#FFF1F0' }
    },
    styles: {
      content: {
        background: '#FFF1F0',
        border: '1px solid #FFCCC7',
        color: '#CF1322',
      }
    },
  },
};

// Thread TTL (生存时间)
export const THREAD_TTL_SECONDS = 600;

// 子代理名称列表
export const SUB_AGENTS = ['|tom:', '|avi:', '|ivy:', '|levan:'] as const;

// Tina 节点名称
export const TINA_NODES = ['tina', 'tina_agent'] as const;
