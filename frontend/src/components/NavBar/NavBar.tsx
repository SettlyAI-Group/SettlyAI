import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Typography, styled, Box } from '@mui/material';
import GlobalButton from '../GlobalButton';
import HomeRounded from '@mui/icons-material/HomeRounded';
import React from 'react';

//Setting up the containers
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  minHeight: 72,
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down(400)]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const LeftContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  paddingLeft: theme.spacing(6),
  [theme.breakpoints.down(400)]: {
    paddingTop: '8px',
  },
}));

const MiddleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0),
  justifyContent: 'flex-end',
  flex: '1 1 0',
  color: theme.palette.text.primary,
  [theme.breakpoints.down(740)]: {
    display: 'none',
  },
}));

const RightContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '0 0 auto',
  marginLeft: theme.spacing(3),
  paddingRight: theme.spacing(6),
  [theme.breakpoints.down(400)]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: theme.spacing(3),
  },
}));

//Setting wrapper to add prop 'to' to the GlobalButton component
type GlobalButtonLinkProps = React.ComponentProps<typeof GlobalButton> & { to: string };
const WrappedGlobalButton = React.forwardRef<HTMLButtonElement, GlobalButtonLinkProps>(
  ({ to, className, children, ...props }, ref) => (
    <GlobalButton ref={ref} className={className} component={RouterLink} to={to} {...props}>
      {children}
    </GlobalButton>
  )
);

//Styling for the buttons on NavBar
const LinkButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 90,
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
}));

const LoginButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 90,
  '&&': { borderRadius: 8 },
  [theme.breakpoints.down(400)]: {
    width: '100%',
    paddingLeft: theme.spacing(0.25),
    paddingRight: theme.spacing(0.25),
  },
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.common.white,
  boxShadow: theme.shadows[3],
  whiteSpace: 'nowrap',
}));

const JoinButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 100,
  boxShadow: theme.shadows[1],
  '&&': { borderRadius: 8 },
  ...theme.typography.p1,
  whiteSpace: 'nowrap',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.paper,
  [theme.breakpoints.down(400)]: {
    width: '100%',
    paddingLeft: theme.spacing(0.25),
    paddingRight: theme.spacing(0.25),
  },
}));

const BrandMark = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  placeItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 24,
  display: 'grid',
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(24),
  },
}));

const BrandLink = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  color: 'inherit',
}));

const Navbar = () => {
  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <LeftContainer>
        <BrandLink component={RouterLink} to={'/'}>
          <BrandMark>
            <HomeRounded fontSize="inherit" />
          </BrandMark>
          Settly AI
        </BrandLink>
      </LeftContainer>

      <MiddleContainer>
        <LinkButton component={RouterLink} to={'/about'}>
          About
        </LinkButton>
        <LinkButton component={RouterLink} to={'/features'}>
          Features
        </LinkButton>

        <LinkButton component={RouterLink} to={'/chat'}>
          Ask Robot
        </LinkButton>
        <LinkButton component={RouterLink} to={'/favourites'}>
          Favourites
        </LinkButton>
      </MiddleContainer>

      <RightContainer>
        <LoginButton component={RouterLink} to={'/login'}>
          Login
        </LoginButton>
        <JoinButton component={RouterLink} to={'/registration'}>
          Join
        </JoinButton>
      </RightContainer>
    </StyledAppBar>
  );
};

export default Navbar;
