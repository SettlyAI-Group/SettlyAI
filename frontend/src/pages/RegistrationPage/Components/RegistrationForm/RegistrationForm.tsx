import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FormInput, SocialLoginButtons } from './component';

const RegistrationFormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 1),
  border: '1px solid #ccc',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  maxWidth: '440px',
  boxSizing: 'border-box',
})) as typeof Box;

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body2.fontSize, // ✅ 从 body2 中提取 fontSize
  color: theme.palette.secondary.main,
}));

export const RegistrationForm = () => {
  return (
    <RegistrationFormContainer component="form" noValidate autoComplete="off">
      <FormInput label="Full Name" />
      <FormInput label="Email" />
      <FormInput label="Password" />
      <FormInput label="Confirm Password" />
      <FormControlLabel
        control={<Checkbox />}
        label={
          <Typography variant="body2">
            I agree to the{' '}
            <StyledLink to="./TermsOfService">Terms of Service</StyledLink>
            {' and '}
            <StyledLink to="./PrivacyPolicy">Privacy Policy</StyledLink>
          </Typography>
        }
      />
      <Button variant="contained" color="secondary" size="medium" fullWidth>
        Create Account
      </Button>
      <Divider>OR</Divider>
      <SocialLoginButtons />
    </RegistrationFormContainer>
  );
};
