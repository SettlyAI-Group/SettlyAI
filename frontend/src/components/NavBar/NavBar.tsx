import { AppBar, Toolbar, Typography, Button, Box, styled, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import navhomeImage from '../../assets/NavHome.png';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: "none",
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 72,
  justifyContent: 'space-between',
  padding: 0,
});

const HomeSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
});

const HomeIconContainer = styled(Box)({
  width: 40,
  height: 40,
  background: '#7B61FF',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const NavLinks = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
});

const NavButton = styled(Button)({
  color: '#6B7280',
  textTransform: 'none',
  fontSize: 15,
  fontWeight: 400,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#4F46E5',
  },
});

const JoinButton = styled(Button)({
  backgroundColor: '#7B61FF',
  color: 'white',
  textTransform: 'none',
  fontSize: 15,
  fontWeight: 500,
  padding: '8px 32px',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: '#6B51E8',
  },
});

const Navbar = () => {
  const navigate = useNavigate();

  const StyledContainer = styled(Container)({
    maxWidth: 1440,
    marginLeft: "auto",
    marginRight: "auto",
  });

  const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary, // instead of #1F2937
    fontWeight: 600,
    fontSize: 20,
  }));


  return (
    <StyledAppBar position="static" elevation={0}>
      {/* Center content and clamp width here (not on AppBar) */}
      <StyledContainer maxWidth={false}>
        <StyledToolbar disableGutters>
          <HomeSection onClick={() => navigate('/')}>
            <HomeIconContainer>
              <img src={navhomeImage}
                alt="Home"
                style={{ width: 24, height: 24 }} />
            </HomeIconContainer>
            <StyledTypography
              variant="h6">
              Settly AI
            </StyledTypography>
          </HomeSection>

          <NavLinks>
            <NavButton onClick={() => navigate('/about')}>About</NavButton>
            <NavButton onClick={() => navigate('/features')}>Features</NavButton>
            <NavButton onClick={() => navigate('/ask-robot')}>Ask Robot</NavButton>
            <NavButton onClick={() => navigate('/favorites')}>Favorites</NavButton>
            <NavButton onClick={() => navigate('/login')}>Login</NavButton>
            <JoinButton onClick={() => navigate('/join')}>Join</JoinButton>
          </NavLinks>
        </StyledToolbar>
      </StyledContainer>
    </StyledAppBar>
  );
};

export default Navbar;
