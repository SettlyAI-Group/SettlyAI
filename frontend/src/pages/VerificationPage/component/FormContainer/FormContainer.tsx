import { Box, type BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormContainer = styled(Box)<
  BoxProps & React.ComponentProps<'form'>
>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  padding: theme.spacing(6, 7),
  border: '1px solid #ccc',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  maxWidth: '440px',
  backgroundColor: theme.palette.background.paper,
}));
