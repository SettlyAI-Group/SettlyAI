import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Draggable from 'react-draggable';

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

const ChatWindow = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 68,
  right: 0,
  width: 400,
  height: 600,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[16],
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 320,
    height: 500,
  },
}));

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Draggable bounds="parent">
      <DraggableWrapper>
        {isOpen && <ChatWindow>Chat Assistant Placeholder</ChatWindow>}

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
