import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Conversations } from '@ant-design/x';
import AddIcon from '@mui/icons-material/Add';
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import type { ConversationsProps } from '@ant-design/x';
import { Input, Modal } from 'antd';
import type { ChangeEvent, KeyboardEvent } from 'react';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 200,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[50],
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '& .chat-sidebar__item--disabled': {
    opacity: 0.6,
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

const ConversationLabel = styled(Typography)(() => ({
  fontSize: '0.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

interface ConversationItem {
  key: string;
  label: string;
  timestamp: number;
  disabled?: boolean;
  isDisabled?: boolean;
  rawLabel?: string;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeKey: string;
  editingKey: string | null;
  renameDraft: string;
  onRenameStart: (key: string) => void;
  onRenameChange: (value: string) => void;
  onRenameSubmit: (key: string, value: string) => void;
  onRenameCancel: () => void;
  onToggleDisable: (key: string) => void;
  onDelete: (key: string) => Promise<void> | void;
  onActiveChange: (key: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({
  conversations,
  activeKey,
  editingKey,
  renameDraft,
  onRenameStart,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onToggleDisable,
  onDelete,
  onActiveChange,
  onNewChat,
}: ChatSidebarProps) => {
  const handleRenameInputKeyDown = (event: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onRenameSubmit(key, renameDraft);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onRenameCancel();
    }
  };

  const renderLabel = (conversation: ConversationItem) => {
    if (editingKey === conversation.key) {
      return (
        <Input
          autoFocus
          size="small"
          value={renameDraft}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onRenameChange(event.target.value)}
          onKeyDown={event => handleRenameInputKeyDown(event, conversation.key)}
          onBlur={() => {
            if (editingKey === conversation.key) {
              onRenameSubmit(conversation.key, renameDraft);
            }
          }}
          onClick={event => event.stopPropagation()}
          style={{ width: '100%' }}
          placeholder="Rename conversation"
        />
      );
    }

    return (
      <ConversationLabel
        variant="body2"
        color={conversation.isDisabled ? 'text.secondary' : 'text.primary'}
        sx={{
          fontStyle: conversation.isDisabled ? 'italic' : 'normal',
        }}
      >
        {conversation.label}
        {conversation.isDisabled ? ' (disabled)' : ''}
      </ConversationLabel>
    );
  };

  const displayItems = conversations.map(item => ({
    ...item,
    rawLabel: item.label,
    label: renderLabel(item),
    className: item.isDisabled ? 'chat-sidebar__item--disabled' : undefined,
    disabled: false,
  }));

  const menuConfig: ConversationsProps['menu'] = conversation => {
    const isDisabled = Boolean(conversation.isDisabled);
    return {
      items: [
        {
          label: 'Rename',
          key: 'rename',
          icon: <EditOutlined />,
          disabled: false,
        },
        {
          label: isDisabled ? 'Enable' : 'Disable',
          key: 'toggle-disable',
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
        if (menuInfo.key === 'rename') {
          onRenameStart(conversation.key);
          return;
        }
        if (menuInfo.key === 'toggle-disable') {
          onToggleDisable(conversation.key);
          return;
        }
        if (menuInfo.key === 'delete') {
          Modal.confirm({
            title: 'Delete conversation?',
            content: `Are you sure you want to delete "${conversation.rawLabel ?? conversation.label}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => onDelete(conversation.key),
          });
        }
      },
    };
  };

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
          items={displayItems}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
          menu={menuConfig}
        />
      </ConversationList>
    </SidebarContainer>
  );
};

export default ChatSidebar;
