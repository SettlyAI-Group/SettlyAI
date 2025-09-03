import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Title = styled(Typography)(() => ({
  textAlign: 'center',
  fontWeight: 700,
}));

export const Highlight = styled(Typography)<{ component?: React.ElementType }>(() => ({
  display: 'inline',
  // When screen < 540px → force to new line
  '@media (max-width:540px)': {
    display: 'block',
  },
}));
