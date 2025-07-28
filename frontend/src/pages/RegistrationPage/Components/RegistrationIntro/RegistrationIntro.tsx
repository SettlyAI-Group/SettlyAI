import { Typography, Box, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

  const RegistrationIntroContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  })

  const RegistrationIntroTitle = styled(Typography)({
    fontWeight: 'bold',
  })

  const RegistrationIntroSubtitle = styled(Typography)({
    fontWeight: 'bold',
  }) as typeof Typography;

  const BackToLoginLink = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    borderBottom: '1px solid transparent',
    '&:hover': {
      borderBottom: '1px solid',
      borderColor: 'secondary.main',
    },
  })

export const RegistrationIntro = () => {

        
  return (
    <RegistrationIntroContainer>
      <RegistrationIntroTitle variant="h4">
        Welcome to{' '}
        <RegistrationIntroSubtitle component="span" color="secondary" variant="h4">
          Settly AI
        </RegistrationIntroSubtitle>
      </RegistrationIntroTitle>
      <Typography color="textPrimary" align="justify">
        Create your free account to unlock suburb insights, personalized
        reports, and smart financial tools.
      </Typography>
      <BackToLoginLink
        href="/login"
        color="secondary"
        underline="none"
      >
        <ArrowBackIcon />
        Back to Login
      </BackToLoginLink>
    </RegistrationIntroContainer>
  );
};
