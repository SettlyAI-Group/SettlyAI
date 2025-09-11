import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { Title, Highlight } from '@/components/FormPageTitle/FormePageTitle';

const RegistrationIntroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(7),
  paddingTop:theme.spacing(12),
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
      <Title variant="h1">
        Welcome to{' '}
        <Highlight variant="h1" component="span" color="primary">
          Settly AI
        </Highlight>
      </Title>
      <Typography color="textPrimary" align="justify" variant="subtitle1" textAlign="center">
        Create your free account to unlock suburb insights, personalised reports, and smart financial tools.
      </Typography>
      <BackToLoginLink to="/login">
        <ArrowBackIcon />
        Back to Log in
      </BackToLoginLink>
    </RegistrationIntroContainer>
  );
};
