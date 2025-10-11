import { styled, keyframes } from '@mui/material/styles';
import { Bubble } from '@ant-design/x';

// ============ Keyframes ============
export const chatWindowOpen = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const chatWindowClose = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ============ Main Styled Components ============
export const ChatWindowContainer = styled('div')<{ $isClosing: boolean; $style: React.CSSProperties }>(
  ({ $isClosing, $style }) => ({
    position: 'fixed',
    background: 'white',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1001,
    overflow: 'hidden',
    fontFamily: "'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    animation: `${chatWindowOpen} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
    ...$style,

    ...$isClosing && {
      animation: `${chatWindowClose} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
    },
  })
);

export const HistorySidebar = styled('div')<{ $hidden: boolean }>(({ $hidden }) => ({
  width: '260px',
  background: '#FAFAFA',
  borderRight: '1px solid #F0F0F0',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  flexShrink: 0,
  zIndex: 10,

  // 桌面端：正常显示在左侧
  '@media (min-width: 769px)': {
    position: 'relative',
    ...$hidden && {
      width: 0,
      opacity: 0,
      overflow: 'hidden',
    },
  },

  // 移动端和平板：悬浮抽屉模式
  '@media (max-width: 768px)': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    height: '100%',
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.15)',
    transform: $hidden ? 'translateX(-100%)' : 'translateX(0)',
    opacity: 1,
  },
}));

// ============ Overlay (遮罩层) ============
export const Overlay = styled('div')<{ $visible: boolean }>(({ $visible }) => ({
  display: 'none',

  '@media (max-width: 768px)': {
    display: $visible ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: $visible ? 1 : 0,
  },
}));

export const ChatMain = styled('div')(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  position: 'relative',
}));

// ============ Header Styles ============
export const ChatHeader = styled('div')(() => ({
  height: '56px',
  background: 'linear-gradient(135deg, #7B61FF 0%, #5B47CC 100%)',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: 'white',
  flexShrink: 0,

  '@media (max-width: 480px)': {
    padding: '0 12px',
  },
}));

export const ChatHeaderLeft = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

export const MenuToggle = styled('button')(() => ({
  width: '32px',
  height: '32px',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

export const ChatAvatar = styled('div')(() => ({
  width: '36px',
  height: '36px',
  background: '#FFFFFF',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

export const ChatInfo = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const ChatTitle = styled('div')(() => ({
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '1px',
}));

export const ChatStatus = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '11px',
  opacity: 0.9,
}));

export const StatusDot = styled('span')(() => ({
  width: '5px',
  height: '5px',
  background: '#10B981',
  borderRadius: '50%',
  animation: `${blink} 2s infinite`,
}));

export const ChatHeaderActions = styled('div')(() => ({
  display: 'flex',
  gap: '6px',
}));

export const HeaderAction = styled('button')<{ $hideOnMobile?: boolean }>(({ $hideOnMobile }) => ({
  width: '30px',
  height: '30px',
  background: 'rgba(255, 255, 255, 0.15)',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  fontSize: '14px',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-1px)',
  },

  ...($hideOnMobile && {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  }),
}));

// ============ Messages Area ============
export const MessagesContainer = styled('div')(() => ({
  flex: 1,
  overflowY: 'auto',
  background: 'linear-gradient(to bottom, #F8F9FB 0%, #FFFFFF 100%)',
  display: 'flex',
  flexDirection: 'column',

  '&::-webkit-scrollbar': {
    width: '6px',
  },

  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#D9D9D9',
    borderRadius: '3px',
  },

  '&::-webkit-scrollbar-thumb:hover': {
    background: '#BFBFBF',
  },
}));

export const StyledBubbleList = styled(Bubble.List)(() => ({
  padding: '12px 16px',
  animation: `${slideDown} 0.3s ease`,

  // 为每个 bubble 添加下滑动画
  '& .ant-bubble': {
    animation: `${slideDown} 0.3s ease`,
  },

  '@media (max-width: 480px)': {
    padding: '12px',
  },
}));

// ============ Guide Container ============
export const GuideContainer = styled('div')(() => ({
  background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
  border: '1px solid #C4B5FD',
  borderRadius: '10px',
  padding: '16px',
  margin: '20px 20px 16px 20px',
  animation: `${slideDown} 0.3s ease`,
  flexShrink: 0,

  '@media (max-width: 480px)': {
    padding: '14px',
    margin: '16px 12px 12px 12px',
  },
}));

export const GuideTitle = styled('div')(() => ({
  fontSize: '12px',
  color: '#5B47CC',
  fontWeight: 500,
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}));

export const GuideActions = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '8px',

  '@media (min-width: 1200px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  '@media (max-width: 480px)': {
    gap: '6px',
  },
}));

export const GuideAction = styled('div')(() => ({
  background: 'white',
  border: '1px solid #D9D9D9',
  borderRadius: '8px',
  padding: '10px 12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',

  '&:hover': {
    borderColor: '#7B61FF',
    boxShadow: '0 2px 8px rgba(123, 97, 255, 0.2)',
    transform: 'translateY(-1px)',
  },

  '@media (max-width: 480px)': {
    padding: '8px 10px',
    gap: '6px',
    borderRadius: '6px',
  },
}));

export const GuideActionIcon = styled('span')(() => ({
  fontSize: '16px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '@media (max-width: 480px)': {
    fontSize: '14px',
  },
}));

export const GuideActionText = styled('span')(() => ({
  fontSize: '12px',
  color: '#262626',
  lineHeight: 1.4,
  flex: 1,
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  fontWeight: 400,

  '@media (max-width: 480px)': {
    fontSize: '11px',
    lineHeight: 1.3,
  },
}));

// ============ Input Container ============
export const InputContainer = styled('div')(() => ({
  padding: '10px 16px',
  background: 'white',
  borderTop: '1px solid #F0F0F0',
  flexShrink: 0,

  '& .ant-sender': {
    minHeight: '36px',
  },

  '& .ant-input': {
    minHeight: '28px !important',
    padding: '6px 12px !important',
    fontSize: '14px !important',
  },

  '& .ant-input-textarea': {
    minHeight: '28px !important',
  },

  '& .ant-btn-primary': {
    background: 'linear-gradient(135deg, #7B61FF 0%, #5B47CC 100%) !important',
    borderColor: 'transparent !important',
    borderRadius: '50% !important',
    width: '32px !important',
    height: '32px !important',
    transition: 'all 0.2s !important',
  },

  '& .ant-btn-primary:hover, & .ant-btn-primary:active, & .ant-btn-primary:focus': {
    background: 'linear-gradient(135deg, #9B81FF 0%, #7B61FF 100%) !important',
    transform: 'scale(1.1) !important',
    boxShadow: '0 4px 12px rgba(123, 97, 255, 0.35) !important',
  },

  '& .ant-btn-primary:active': {
    transform: 'scale(0.95) !important',
  },

  '@media (max-width: 480px)': {
    padding: '10px 12px',
  },
}));
