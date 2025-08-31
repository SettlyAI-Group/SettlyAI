import { Box, type BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography, Button, Divider, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput} from './component/FormInput';
import { FormCheckbox } from './component/FormCheckbox';
import { SocialLoginButtons } from './component/SocialLoginButtons';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { PasswordStrength } from './component/PasswordStrength';
import { useState } from 'react';
import { registerUser } from '@/api/authApi';
import type { IUser } from '@/interfaces/user';

const userFormSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be no more than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must include uppercase, lowercase, and number'
      )
      .regex(
        /[^A-Za-z0-9]/,
        'Password must include at least one special character'
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(v => v, { message: 'Please accept Terms' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const RegistrationFormContainer = styled(Box)<
  BoxProps & React.ComponentProps<'form'>
>(({ theme }) => ({
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

const CreateAccountButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: 'none',
  color: theme.palette.common.white,
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

export const RegistrationForm = () => {
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });
  const passwordValue = useWatch({ control, name: 'password' });

  const { mutate, isPending } = useMutation<
    IUser,
    AxiosError,
    z.infer<typeof userFormSchema>
  >({
    mutationFn: data =>
      registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }),

    onSuccess: () => {
      reset();
      navigate('/verify-email');
    },

    onError: (error: AxiosError) => {
      if (error?.response?.status === 409) {
        setError('email', {
          type: 'server',
          message: 'This email has already been registered',
        });
      }
      setError('root', {
        type: 'server',
        message: 'Registration failed, please try again later',
      });
    },
  });

  return isPending ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      <CircularProgress />
    </Box>
  ) : (
    <RegistrationFormContainer
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(data => {
        mutate(data);
      })}
    >
      <Typography variant="h4" component="h3" marginBottom={2}>
        Get Started for Free
      </Typography>
      <Typography variant="body2" component="p" marginBottom={11}>
        Create your Settly AI account.
      </Typography>
      {errors.root && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.root.message}
        </Typography>
      )}
      <FormInput label="Full Name" name="fullName" control={control} />
      <FormInput label="Email" name="email" control={control} />
      <FormInput
        label="Password"
        name="password"
        control={control}
        type="password"
        onFocus={() => setShowPasswordStrength(true)}
        onBlur={() => setShowPasswordStrength(false)}
        helperText={
          showPasswordStrength ? (
            <PasswordStrength value={passwordValue} />
          ) : null
        }
      />
      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        control={control}
        type="password"
      />

      <FormCheckbox
        name="acceptTerms"
        control={control}
        label={
          <Typography variant="p1" component="span">
            I agree to the{' '}
            <TextButton type="button">
              Terms of Service and Privacy Policy
            </TextButton>
          </Typography>
        }
      />
      <CreateAccountButton
        variant="contained"
        color="primary"
        size="medium"
        fullWidth
        type="submit"
        disabled={isPending}
      >
        Create Account
      </CreateAccountButton>

      <Divider>OR</Divider>
      <SocialLoginButtons />
      <Typography variant="p1" component="p" textAlign="center" marginTop={6}>
        Already have an account?{'  '}
        <Link to="/login">
          <TextButton>Log in here</TextButton>
        </Link>
      </Typography>
    </RegistrationFormContainer>
  );
};
