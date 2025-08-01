import { Box, Typography, styled } from '@mui/material';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#1A1A2E',
  color: theme.palette.background.paper,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  textAlign: 'center',
  minHeight: 200,
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Typography variant="body2">&copy; 2025 My Website. All rights reserved.</Typography>
    </StyledFooter>
  );
};

export default Footer;
