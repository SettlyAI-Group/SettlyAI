import { AppBar, Toolbar, Typography, styled } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: 72,
  justifyContent: 'center',
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 72,
});

const Navbar = () => {
  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <StyledToolbar>
        <Typography variant="h6" component="div">
          SettlyAI
        </Typography>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
