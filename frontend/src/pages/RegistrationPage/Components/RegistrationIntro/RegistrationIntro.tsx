import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

const RegistrationIntroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(7),
}));

const BackToLoginLink = styled(Link)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
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
        Welcome to
        <Typography variant="h1" component="span" color="primary">
          {' '}
          Settly AI
        </Typography>
      </Typography>
      <Typography
        color="textPrimary"
        align="justify"
        variant="subtitle1"
        textAlign="center"
      >
        Create your free account to unlock suburb insights, personalised
        reports, and smart financial tools.
      </Typography>
      <BackToLoginLink to="/login">
        <ArrowBackIcon />
        Back to Login
      </BackToLoginLink>
    </RegistrationIntroContainer>
  );
};
