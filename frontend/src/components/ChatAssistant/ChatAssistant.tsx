import { useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import ChatWindow from './components/ChatWindow';
import { TinaAvatar } from './constants';

// ============ Keyframes ============
const pulse = keyframes`
  0% { box-shadow: 0 4px 20px rgba(123, 97, 255, 0.35); }
  50% { box-shadow: 0 4px 30px rgba(123, 97, 255, 0.5); }
  100% { box-shadow: 0 4px 20px rgba(123, 97, 255, 0.35); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-3px) rotate(-5deg); }
  75% { transform: translateY(1px) rotate(5deg); }
`;

// ============ Styled Components ============
const ChatbotContainer = styled('div')(() => ({
  fontFamily: "'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}));

const FloatingButton = styled('button')<{ $isOpen: boolean }>(({ $isOpen }) => ({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  width: '56px',
  height: '56px',
  background: '#FFFFFF',
  borderRadius: '50%',
  border: '3px solid #7B61FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(123, 97, 255, 0.35)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,

  '&:hover': {
    transform: 'scale(1.15) rotate(5deg)',
    boxShadow: '0 6px 30px rgba(123, 97, 255, 0.5)',
    borderColor: '#9B81FF',
    animation: `${pulse} 2s infinite`,
  },

  ...$isOpen && {
    transform: 'scale(0) rotate(90deg)',
    opacity: 0,
    pointerEvents: 'none',
  },

  '@media (max-width: 480px)': {
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
  },
}));

const FloatingButtonContent = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',

  'button:hover &': {
    animation: `${bounce} 1.5s infinite`,
  },
}));

const Tooltip = styled('div')<{ $visible: boolean }>(({ $visible }) => ({
  position: 'fixed',
  bottom: '36px',
  right: '80px',
  background: '#2D2D2D',
  color: '#FFFFFF',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: $visible ? 1 : 0,
  transform: $visible ? 'translateX(0)' : 'translateX(10px)',
  transition: 'opacity 0.3s, transform 0.3s',
  zIndex: 999,

  // 小箭头
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: '-6px',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid #2D2D2D',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
  },

  '@media (max-width: 480px)': {
    bottom: '30px',
    right: '90px',
    fontSize: '12px',
    padding: '6px 12px',
  },
}));

// ============ Component ============
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <ChatbotContainer>
      {/* Tooltip */}
      <Tooltip $visible={isHovered && !isOpen}>Ask me</Tooltip>

      {/* Floating trigger button */}
      <FloatingButton
        $isOpen={isOpen}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with Tina"
        title="Chat with Tina"
      >
        <FloatingButtonContent>
          <TinaAvatar />
        </FloatingButtonContent>
      </FloatingButton>

      {/* Chat window */}
      {isOpen && <ChatWindow onClose={handleClose} isClosing={isClosing} />}
    </ChatbotContainer>
  );
};

export default ChatAssistant;
