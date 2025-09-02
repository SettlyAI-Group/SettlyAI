import { Typography, Box, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const LoginIntroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(7),
}));

const CreateAccountButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: 'none',
  color: theme.palette.common.white,
  marginTop: theme.spacing(4),    
  marginBottom: theme.spacing(1), 
}));

const LoginIntro = () => {
  const navigate = useNavigate();
  return (
    <LoginIntroContainer>
      <Typography variant="h1">
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
        Log in to access your saved reports, notes, and personalized suburb insights.
      </Typography>
      <CreateAccountButton
        variant="contained"
        color="primary"
        size="medium"
        onClick={() => navigate('/registration')}
      >
        Create Account
      </CreateAccountButton>
    </LoginIntroContainer>
  )
}

export default LoginIntro