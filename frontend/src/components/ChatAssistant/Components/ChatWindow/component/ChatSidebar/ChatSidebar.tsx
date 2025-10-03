import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Conversations } from '@ant-design/x';
import AddIcon from '@mui/icons-material/Add';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 200,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[50],
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ConversationList = styled(Box)(() => ({
  flex: 1,
  overflow: 'auto',
}));

interface ConversationItem {
  key: string;
  label: string;
  timestamp: number;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeKey: string;
  onActiveChange: (key: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({ conversations, activeKey, onActiveChange, onNewChat }: ChatSidebarProps) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Typography variant="subtitle2">Chats</Typography>
        <IconButton size="small" onClick={onNewChat}>
          <AddIcon fontSize="small" />
        </IconButton>
      </SidebarHeader>
      <ConversationList>
        <Conversations
          items={conversations}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
        />
      </ConversationList>
    </SidebarContainer>
  );
};

export default ChatSidebar;
