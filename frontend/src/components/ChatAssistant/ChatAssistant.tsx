import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Draggable from 'react-draggable';
import ChatWindow from './Components/ChatWindow';

const FloatingButton = styled(Fab)(({ theme }) => ({
  zIndex: 1000,
  boxShadow: theme.shadows[8],
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
  '&:hover': {
    boxShadow: theme.shadows[12],
  },
  [theme.breakpoints.down('sm')]: {
    width: 48,
    height: 48,
  },
}));

const DraggableWrapper = styled('div')(() => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  zIndex: 1000,
}));

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Draggable bounds="parent">
      <DraggableWrapper>
        {isOpen && <ChatWindow />}

        <Tooltip title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'} placement="left">
          <FloatingButton
            color="primary"
            aria-label="chat assistant"
            onClick={handleToggle}
          >
            {isOpen ? <CloseIcon /> : <ChatIcon />}
          </FloatingButton>
        </Tooltip>
      </DraggableWrapper>
    </Draggable>
  );
};

export default ChatAssistant;
