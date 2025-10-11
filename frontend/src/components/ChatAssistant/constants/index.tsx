/**
 * 共享常量定义
 */

import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';
import type { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import markdownit from 'markdown-it';
import tinaImage from '../../../assets/image.png';
import { RotatingMessage } from '../components/RotatingMessage';

// Tina 的头像图标（使用真实图片）
export const TinaAvatar = () => (
  <img
    src={tinaImage}
    alt="Tina"
    style={{
      width: '110%',
      height: '110%',
      objectFit: 'cover',
      objectPosition: 'center 25%',
      display: 'block',
    }}
  />
);

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// Markdown 渲染器
export const renderMarkdown: BubbleProps['messageRender'] = content => {
  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
};

// Bubble 角色配置
export const BUBBLE_ROLES: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    variant: 'filled',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#fff', backgroundColor: '#52C41A' },
    },
    styles: {
      content: {
        background: 'linear-gradient(135deg, #7B61FF 0%, #9B81FF 100%)',
        color: '#fff',
      },
    },
  },
  assistant: {
    placement: 'start',
    variant: 'filled',
    avatar: {
      icon: <TinaAvatar />,
      style: {
        backgroundColor: '#F5F3FF',
        border: '2px solid #7B61FF20',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(123, 97, 255, 0.2)',
      },
    },
    messageRender: renderMarkdown,
    typing: { step: 5, interval: 20 },
    loading: true, // 启用 loading 状态
    styles: {
      content: {
        background: '#FFFFFF',
        border: '1px solid #F0F0F0',
      },
    },
  },
  tool_call: {
    placement: 'start',
    variant: 'outlined',
    avatar: {
      icon: <TeamOutlined />,
      style: {
        color: '#7B61FF',
        backgroundColor: '#F5F3FF',
        fontSize: '18px',
      },
    },
    // messageRender 现在不需要了，我们会传递 RotatingMessage 组件作为 content
  },
  error: {
    placement: 'start',
    variant: 'filled',
    avatar: {
      icon: <UserOutlined />,
      style: { color: '#FF4D4F', backgroundColor: '#FFF1F0' },
    },
    styles: {
      content: {
        background: '#FFF1F0',
        border: '1px solid #FFCCC7',
        color: '#CF1322',
      },
    },
  },
};

// Thread TTL (生存时间)
export const THREAD_TTL_SECONDS = 600;

// 子代理名称列表
export const SUB_AGENTS = ['|tom:', '|avi:', '|ivy:', '|levan:'] as const;

// Tina 节点名称
export const TINA_NODES = ['tina', 'tina_agent'] as const;
