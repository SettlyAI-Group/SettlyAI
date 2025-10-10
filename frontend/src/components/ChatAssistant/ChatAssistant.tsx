import { useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { styled, keyframes } from '@mui/material/styles';
import ChatWindow from './components/ChatWindow';

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
  width: '48px',
  height: '48px',
  background: 'linear-gradient(135deg, #7B61FF 0%, #5B47CC 100%)',
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(123, 97, 255, 0.35)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  animation: `${pulse} 2s infinite`,

  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 6px 25px rgba(123, 97, 255, 0.45)',
  },

  ...$isOpen && {
    transform: 'scale(0) rotate(90deg)',
    opacity: 0,
    pointerEvents: 'none',
  },

  '@media (max-width: 480px)': {
    bottom: '20px',
    right: '20px',
    width: '52px',
    height: '52px',
  },
}));

const FloatingButtonIcon = styled(MessageOutlined)(() => ({
  color: 'white',
  fontSize: '20px',
  animation: `${bounce} 1.5s infinite`,

  '@media (max-width: 480px)': {
    fontSize: '22px',
  },
}));

// ============ Component ============
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <ChatbotContainer>
      {/* Floating trigger button */}
      <FloatingButton
        $isOpen={isOpen}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <FloatingButtonIcon />
      </FloatingButton>

      {/* Chat window */}
      {isOpen && <ChatWindow onClose={handleClose} isClosing={isClosing} />}
    </ChatbotContainer>
  );
};

export default ChatAssistant;
