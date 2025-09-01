import {useState} from 'react';
import {Box, Typography, Button, IconButton, InputAdornment, Divider, CircularProgress} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import FormInput from "./component/FormInput";
import FormCheckbox from "./component/FormCheckbox";
import { styled } from '@mui/material/styles';
import { SocialLoginButtons } from './component/SocialLoginButtons';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/api/authApi';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 7),
  border: '1px solid #ccc',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  maxWidth: '440px',
  backgroundColor: theme.palette.background.paper,
}));

const CheckBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const TextButton = styled('button')(({ theme }) => ({
  ...theme.typography.p1,
  padding: 0,
  border: 'none',
  background: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textTransform: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: 'none',
  color: theme.palette.common.white,
  marginTop: theme.spacing(2),    
  marginBottom: theme.spacing(2), 
}));


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{emailError?: string; passwordError?: string}>({});
  const navigate = useNavigate();

  // define error type:
  const badRequest = 400;
  const tooManyRequest = 429;

  // input validation
    const validate = () => {
    const inputErrors: { emailError?: string; passwordError?: string } = {};
    // email validation
    if (!email) {
      inputErrors.emailError = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      inputErrors.emailError = "Invalid email format";
    }
    // password validation
    if (!password) {
      inputErrors.passwordError = "Password is required";
    }
    setValidationErrors(inputErrors);
    // return true if no errors
    return Object.keys(inputErrors).length === 0;
  };

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();
    // input validation 
    if (!validate()) return;
    // Login process
    setIsLoading(true);
    try {
      const data = await loginUser({email, password});
      // Todo: Put into Redux and implement Auth
      console.log(data.accessToken);
      console.log(data.userName);
      navigate('/');
    } catch (err:any) {
      if (err.status === badRequest) setApiError("Incorrect email or password, please try again.");
      else if (err.status === tooManyRequest) setApiError("Too many login attempts. Please try again in 15 minutes."); 
      else setApiError("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return isLoading? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      <CircularProgress/>
    </Box>
  ) : (
    <FormContainer>
      <Typography variant="h4" component="h3" marginBottom={2}>
        Welcome
      </Typography>
      <Typography variant="body2" component="p" marginBottom={11}>
        Sign in to your account
      </Typography>

      {/* Log in error message */}
      {apiError && 
        <Typography variant='body2' component="p" color='error.main'>
            {apiError}
        </Typography>
      }

      {/* Login Form */}
      <form noValidate autoComplete='off' onSubmit={handleSubmit}>
        {/* Email input */}
        <FormInput 
          label="Email" 
          type='email' 
          placeholder="your@email.com" 
          value={email} 
          onChange={setEmail} 
          error={!!validationErrors.emailError}
          helperText={validationErrors.emailError}
        />
        {/* Password input   */}
        <FormInput 
          label="Password" 
          type={showPassword ? "text" : "password"}
          placeholder='Enter your password'
          value={password}
          onChange={setPassword}
          error={!!validationErrors.passwordError}
          helperText={validationErrors.passwordError}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position='end'>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((show)=> !show)}
                  edge="end">
                    {showPassword? <VisibilityOff/> : <Visibility/>}
                </IconButton>
              </InputAdornment>
            }
          }}
        />
        <CheckBoxContainer>
          <FormCheckbox label='Remeber me' checked={rememberMe} onChange={setRememberMe}/>
          {/* Todo: link to forgot password page */}
          <Link to='/'> 
            <TextButton>Forgot password?</TextButton>
          </Link>
        </CheckBoxContainer>
        <LoginButton
        variant="contained"
        color="primary"
        size="medium"
        fullWidth
        type="submit"
      >
        Log In
      </LoginButton>
      </form>
      <Divider variant='middle' sx={{ my: 2 }}>OR</Divider>
      <SocialLoginButtons />
      <Typography variant="p1" component="p" textAlign="center" marginTop={6}>
        Don't have an account?{'  '}
        <Link to="/registration">
          <TextButton>Sign up here</TextButton>
        </Link>
      </Typography>
    </FormContainer>
  )
}

export default LoginForm