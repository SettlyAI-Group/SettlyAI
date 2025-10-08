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
  [theme.breakpoints.down('sm')]: { display: 'none' },
  '& .chat-sidebar__item--disabled': { opacity: 0.6 },
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

const MENU_ITEMS = [
  { label: 'Rename', key: 'rename', icon: <EditOutlined /> },
  { label: 'Toggle', key: 'toggle-disable', icon: <StopOutlined /> },
  { label: 'Delete', key: 'delete', icon: <DeleteOutlined />, danger: true },
];

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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onRenameSubmit(key, renameDraft);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onRenameCancel();
    }
  };

  const renderLabel = (item: ConversationItem) => {
    if (editingKey === item.key) {
      return (
        <Input
          autoFocus
          size="small"
          value={renameDraft}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onRenameChange(e.target.value)}
          onKeyDown={e => handleKeyDown(e, item.key)}
          onBlur={() => editingKey === item.key && onRenameSubmit(item.key, renameDraft)}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%' }}
          placeholder="Rename conversation"
        />
      );
    }

    return (
      <ConversationLabel
        variant="body2"
        color={item.isDisabled ? 'text.secondary' : 'text.primary'}
        sx={{ fontStyle: item.isDisabled ? 'italic' : 'normal' }}
      >
        {item.label}
        {item.isDisabled && ' (disabled)'}
      </ConversationLabel>
    );
  };

  const menuConfig: ConversationsProps['menu'] = item => ({
    items: MENU_ITEMS.map(menuItem => ({
      ...menuItem,
      label: menuItem.key === 'toggle-disable' ? (item.isDisabled ? 'Enable' : 'Disable') : menuItem.label,
      disabled: false,
    })),
    onClick: menuInfo => {
      menuInfo.domEvent.stopPropagation();

      const actions: Record<string, () => void> = {
        rename: () => onRenameStart(item.key),
        'toggle-disable': () => onToggleDisable(item.key),
        delete: () =>
          Modal.confirm({
            title: 'Delete conversation?',
            content: `Are you sure you want to delete "${item.rawLabel ?? item.label}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => onDelete(item.key),
          }),
      };

      actions[menuInfo.key]?.();
    },
  });

  const displayItems = conversations.map(item => ({
    ...item,
    rawLabel: item.label,
    label: renderLabel(item),
    className: item.isDisabled ? 'chat-sidebar__item--disabled' : undefined,
    disabled: false,
  }));

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Typography variant="subtitle2">Recents</Typography>
        <IconButton size="small" onClick={onNewChat}>
          <AddIcon fontSize="small" />
        </IconButton>
      </SidebarHeader>
      <ConversationList>
        <Conversations items={displayItems} activeKey={activeKey} onActiveChange={onActiveChange} menu={menuConfig} />
      </ConversationList>
    </SidebarContainer>
  );
};

export default ChatSidebar;
