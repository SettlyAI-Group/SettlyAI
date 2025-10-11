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
  animation: `${pulse} 2s infinite`,

  '&:hover': {
    transform: 'scale(1.15) rotate(5deg)',
    boxShadow: '0 6px 30px rgba(123, 97, 255, 0.5)',
    borderColor: '#9B81FF',
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
  animation: `${bounce} 1.5s infinite`,
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
