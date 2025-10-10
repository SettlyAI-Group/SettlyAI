import { styled } from '@mui/material/styles';

// ============ Styled Components ============
export const HistorySidebarHeader = styled('div')(() => ({
  height: '56px',
  padding: '0 16px',
  background: 'linear-gradient(135deg, #7B61FF 0%, #5B47CC 100%)',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontSize: '14px',
  fontWeight: 500,
  gap: '8px',
  flexShrink: 0,

  '@media (max-width: 375px)': {
    padding: '0 10px',
    fontSize: '13px',
    gap: '6px',
  },
}));

export const NewChatButton = styled('button')(() => ({
  padding: '6px 12px',
  margin: '10px',
  background: 'white',
  border: '1px dashed #D9D9D9',
  borderRadius: '6px',
  color: '#595959',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  transition: 'all 0.2s',

  '&:hover': {
    borderColor: '#7B61FF',
    color: '#7B61FF',
    background: '#F5F3FF',
  },

  '@media (max-width: 375px)': {
    padding: '5px 10px',
    margin: '8px',
    fontSize: '11px',
    gap: '4px',
  },
}));

export const HistoryList = styled('div')(() => ({
  flex: 1,
  overflowY: 'auto',
  padding: '0 8px 8px 8px',

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

  '@media (max-width: 375px)': {
    padding: '0 6px 6px 6px',
  },
}));

export const HistoryItem = styled('div')<{ $active: boolean; $disabled: boolean }>(({ $active, $disabled }) => ({
  padding: '6px 8px',
  marginBottom: '2px',
  background: 'white',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',

  '&:hover': {
    background: '#F5F5F5',
    transform: 'translateX(2px)',
  },

  ...$active && {
    background: '#F5F3FF',
    borderLeft: '2px solid #7B61FF',
  },

  ...$disabled && {
    opacity: 0.6,
  },

  '@media (max-width: 375px)': {
    padding: '5px 6px',
    marginBottom: '1px',
    gap: '1px',
  },
}));

export const HistoryItemHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4px',
}));

export const HistoryItemTitle = styled('div')<{ $disabled: boolean }>(({ $disabled }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: $disabled ? '#8C8C8C' : '#262626',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontStyle: $disabled ? 'italic' : 'normal',

  '@media (max-width: 375px)': {
    fontSize: '12px',
  },
}));

export const HistoryItemActions = styled('div')(() => ({
  display: 'flex',
  gap: '2px',
  opacity: 0,
  transition: 'opacity 0.2s',

  '.history-item:hover &': {
    opacity: 1,
  },
}));

export const HistoryItemAction = styled('button')<{ $danger?: boolean }>(({ $danger }) => ({
  width: '20px',
  height: '20px',
  border: 'none',
  background: 'transparent',
  color: '#8C8C8C',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'all 0.2s',
  fontSize: '12px',

  '&:hover': {
    background: $danger ? '#FFF1F0' : '#F0F0F0',
    color: $danger ? '#FF4D4F' : '#7B61FF',
  },
}));

export const HistoryItemPreview = styled('div')(() => ({
  fontSize: '10px',
  color: '#8C8C8C',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  lineHeight: 1.4,

  '@media (max-width: 375px)': {
    fontSize: '9px',
  },
}));

export const RenameInput = styled('input')(() => ({
  width: '100%',
  padding: '2px 6px',
  border: '1px solid #7B61FF',
  borderRadius: '4px',
  fontSize: '13px',
  outline: 'none',
  background: 'white',
}));
