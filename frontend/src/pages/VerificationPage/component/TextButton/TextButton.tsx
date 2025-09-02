import { styled } from '@mui/material/styles';

export const TextButton = styled('button')(({ theme }) => ({
  ...theme.typography.p1,
  padding: 0,
  border: 'none',
  background: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textTransform: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));
