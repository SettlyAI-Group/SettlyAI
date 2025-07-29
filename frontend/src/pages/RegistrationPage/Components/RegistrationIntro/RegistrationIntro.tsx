import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

const RegistrationIntroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const BackToLoginLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontsize: theme.typography.button,
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  '&:hover': {
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
}));

export const RegistrationIntro = () => {
  return (
    <RegistrationIntroContainer>
      <Typography variant="h1" component="h4">
        Get Started for Free
      </Typography>
      <Typography color="textPrimary" align="justify" variant="body1">
        Create your Settly AI account
      </Typography>
      <BackToLoginLink to="/login">
        <ArrowBackIcon />
        Back to Login
      </BackToLoginLink>
    </RegistrationIntroContainer>
  );
};
