import { Container, styled } from '@mui/material';

export const FormPageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(21),
}));
