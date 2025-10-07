import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Conversations } from '@ant-design/x';
import AddIcon from '@mui/icons-material/Add';
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import type { ConversationsProps } from '@ant-design/x';

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
  const menuConfig: ConversationsProps['menu'] = conversation => ({
    items: [
      {
        label: 'Rename',
        key: 'rename',
        icon: <EditOutlined />,
        disabled: false,
      },
      {
        label: 'Disable',
        key: 'disable',
        icon: <StopOutlined />,
        disabled: false,
      },
      {
        label: 'Delete',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
        disabled: false,
      },
    ],
    onClick: menuInfo => {
      menuInfo.domEvent.stopPropagation();
      console.info(`Menu action ${menuInfo.key} on conversation ${conversation.key}`);
    },
  });

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Typography variant="subtitle2">Recents</Typography>
        <IconButton size="small" onClick={onNewChat}>
          <AddIcon fontSize="small" />
        </IconButton>
      </SidebarHeader>
      <ConversationList>
        <Conversations
          items={conversations}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
          menu={menuConfig}
        />
      </ConversationList>
    </SidebarContainer>
  );
};

export default ChatSidebar;
