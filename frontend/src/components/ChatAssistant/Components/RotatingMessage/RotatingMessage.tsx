/**
 * 轮播消息组件 - 带打字机效果
 */

import { useEffect, useState, useRef } from 'react';
import { Space, Spin, ConfigProvider } from 'antd';
import { styled } from '@mui/material/styles';

const MessageContainer = styled('div')(() => ({
  display: 'inline-block',
  color: '#666',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: '14px',
  minHeight: '21px', // 防止高度跳动
}));

// 自定义 Spin 容器，应用主题色
const StyledSpinWrapper = styled('div')(() => ({
  '& .ant-spin-dot-item': {
    backgroundColor: '#7B61FF', // 主题紫色
  },
}));

interface RotatingMessageProps {
  messages: string[];
  intervalMs?: number; // 切换间隔（毫秒）
  typingSpeed?: number; // 打字速度（毫秒/字符）
}

export const RotatingMessage = ({
  messages,
  intervalMs = 3000,
  typingSpeed = 30
}: RotatingMessageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentMessage = messages[currentIndex] || '';

  // 打字机效果
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');

    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
        typingTimerRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [currentMessage, typingSpeed]);

  // 自动切换到下一条消息
  useEffect(() => {
    if (messages.length <= 1) return;

    switchTimerRef.current = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, intervalMs);

    return () => {
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current);
      }
    };
  }, [currentIndex, messages.length, intervalMs]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  return (
    <Space>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#7B61FF',
          },
        }}
      >
        <StyledSpinWrapper>
          <Spin size="small" />
        </StyledSpinWrapper>
      </ConfigProvider>
      <MessageContainer>
        {displayedText}
        {isTyping && <span style={{ opacity: 0.5 }}>▋</span>}
      </MessageContainer>
    </Space>
  );
};
