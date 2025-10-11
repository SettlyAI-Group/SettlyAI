/**
 * 欢迎界面组件
 */

import { useEffect, useRef } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { StarOutlined, RocketOutlined, ThunderboltOutlined, BulbOutlined } from '@ant-design/icons';
import tinaImage from '../../../../assets/image.png';

// ============ 动画定义 ============
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// ============ 样式组件 ============
const WelcomeContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  maxWidth: '100%',
  height: 'auto !important',
  minHeight: 'auto !important',
  flex: '0 0 auto !important',
  padding: '30px 20px', // ✅ 进一步减少 padding：20px → 16px (top/bottom)
  background: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)',
  position: 'relative',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  overflowY: 'visible',

  // 背景装饰（修复：不影响容器高度）
  '&::before': {
    position: 'fixed', // ✅ 改为 fixed，不影响容器布局
  },

  '@media (max-width: 480px)': {
    padding: '12px 16px 12px',
  },
}));

const AvatarContainer = styled('div')(() => ({
  width: '80px', // ✅ 进一步减小头像：100px → 80px
  height: '80px',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '2px solid #FFFFFF',
  boxShadow: '0 4px 16px rgba(123, 97, 255, 0.2), 0 0 0 4px rgba(123, 97, 255, 0.06)',
  animation: `${fadeInUp} 0.6s ease-out, ${float} 3s ease-in-out infinite`,
  position: 'relative',
  zIndex: 1,
  flexShrink: 0,

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    display: 'block',
  },

  '@media (max-width: 480px)': {
    width: '70px',
    height: '70px',
    marginBottom: '6px',
  },
}));

const WelcomeTitle = styled('h1')(() => ({
  fontSize: '24px', // ✅ 进一步减小：28px → 24px
  fontWeight: 700,
  background: 'linear-gradient(135deg, #7B61FF 0%, #9B81FF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '4px', // ✅ 进一步减少间距：6px → 4px
  animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
  position: 'relative',
  zIndex: 1,

  '@media (max-width: 480px)': {
    fontSize: '20px',
    marginBottom: '3px',
  },
}));

const WelcomeSubtitle = styled('p')(() => ({
  fontSize: '13px', // ✅ 进一步减小：14px → 13px
  color: '#666',
  marginBottom: '14px', // ✅ 进一步减少间距：16px → 14px
  textAlign: 'center',
  lineHeight: 1.4,
  animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
  maxWidth: '380px',
  position: 'relative',
  zIndex: 1,
  padding: '0 10px',

  '@media (max-width: 480px)': {
    fontSize: '12px',
    marginBottom: '10px',
    lineHeight: 1.3,
  },
}));

const FeaturesGrid = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '8px', // ✅ 进一步减少间距：10px → 8px
  marginBottom: '16px', // ✅ 减少间距：20px → 16px
  maxWidth: '400px',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  boxSizing: 'border-box',

  '@media (max-width: 480px)': {
    gap: '6px',
    marginBottom: '12px',
    width: 'calc(100% - 32px)',
  },
}));

const FeatureCard = styled('div')<{ $delay: number }>(({ $delay }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // ✅ 进一步减少：10px → 8px
  padding: '10px', // ✅ 进一步减少：12px → 10px
  background: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #F0F0F0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  animation: `${fadeInUp} 0.6s ease-out ${0.3 + $delay * 0.1}s both`,
  transition: 'all 0.3s ease',
  cursor: 'default',
  boxSizing: 'border-box',
  minWidth: 0,

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(123, 97, 255, 0.1)',
    borderColor: '#7B61FF',
  },

  '@media (max-width: 480px)': {
    padding: '8px',
    gap: '6px',
  },
}));

const FeatureIcon = styled('div')<{ $color: string }>(({ $color }) => ({
  width: '32px', // ✅ 进一步减小：36px → 32px
  height: '32px',
  borderRadius: '6px',
  background: `${$color}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px', // ✅ 进一步减小：18px → 16px
  color: $color,
  flexShrink: 0,

  '@media (max-width: 480px)': {
    width: '28px',
    height: '28px',
    fontSize: '14px',
  },
}));

const FeatureText = styled('div')(() => ({
  flex: 1,
  minWidth: 0,

  '& .title': {
    fontSize: '13px', // ✅ 减小：14px → 13px
    fontWeight: 600,
    color: '#262626',
    marginBottom: '1px',
  },

  '& .desc': {
    fontSize: '11px', // ✅ 减小：12px → 11px
    color: '#8C8C8C',
    lineHeight: 1.3,
  },

  '@media (max-width: 480px)': {
    '& .title': {
      fontSize: '12px',
    },
    '& .desc': {
      fontSize: '10px',
    },
  },
}));

const StartButton = styled('button')(() => ({
  padding: '12px 36px !important', // ✅ 减少 padding：16px 48px → 12px 36px
  fontSize: '15px !important',
  fontWeight: '600 !important',
  lineHeight: '1.5 !important',
  color: '#FFFFFF',
  background: 'linear-gradient(135deg, #7B61FF 0%, #9B81FF 100%)',
  border: 'none',
  borderRadius: '10px', // ✅ 减小圆角：12px → 10px
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: `${fadeInUp} 0.6s ease-out 0.7s both`,
  boxShadow: '0 4px 16px rgba(123, 97, 255, 0.3)',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  marginBottom: '0px', // ✅ 移除底部 margin
  boxSizing: 'border-box',
  minWidth: '180px', // ✅ 减小最小宽度：200px → 180px
  height: 'auto !important',
  minHeight: '44px', // ✅ 减小最小高度：52px → 44px
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    animation: `${shimmer} 3s infinite`,
  },

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(123, 97, 255, 0.4)',
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  '@media (max-width: 480px)': {
    padding: '12px 32px !important',
    fontSize: '14px !important',
    width: 'auto',
    minWidth: '160px',
    maxWidth: 'calc(100% - 32px)',
    marginBottom: '0px',
    minHeight: '40px',
  },
}));

const BottomHint = styled('div')(() => ({
  fontSize: '11px', // ✅ 减小字体：12px → 11px
  color: '#BFBFBF',
  animation: `${pulse} 2s ease-in-out infinite`,
  zIndex: 1,
  textAlign: 'center',
  marginTop: '12px', // ✅ 增加与按钮的间距：8px → 12px
  position: 'relative',

  '@media (max-width: 480px)': {
    fontSize: '10px',
    padding: '0 16px',
    marginTop: '10px',
  },
}));

// ============ 组件定义 ============
interface WelcomeScreenProps {
  onStartChat: () => void;
}

export const WelcomeScreen = ({ onStartChat }: WelcomeScreenProps) => {
  const features = [
    {
      icon: <StarOutlined />,
      color: '#7B61FF',
      title: 'AI-Powered',
      desc: 'Smart property insights',
    },
    {
      icon: <RocketOutlined />,
      color: '#1890FF',
      title: 'Fast & Accurate',
      desc: 'Real-time data analysis',
    },
    {
      icon: <ThunderboltOutlined />,
      color: '#52C41A',
      title: 'Multi-Agent',
      desc: 'Team of specialists',
    },
    {
      icon: <BulbOutlined />,
      color: '#FAAD14',
      title: 'Expert Advice',
      desc: 'Personalized guidance',
    },
  ];

  return (
    <WelcomeContainer>
      <AvatarContainer>
        <img src={tinaImage} alt="Tina" />
      </AvatarContainer>

      <WelcomeTitle>Hi, I'm Tina!</WelcomeTitle>

      <WelcomeSubtitle>
        Your AI property assistant. I can help you find properties, analyze market data, and answer all your real estate
        questions.
      </WelcomeSubtitle>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index} $delay={index}>
            <FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
            <FeatureText>
              <div className="title">{feature.title}</div>
              <div className="desc">{feature.desc}</div>
            </FeatureText>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <StartButton onClick={onStartChat}>Start Chatting</StartButton>

      <BottomHint>Press Enter to send • Shift+Enter for new line</BottomHint>
    </WelcomeContainer>
  );
};
