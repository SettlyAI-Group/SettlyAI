import { Box, type BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput, SocialLoginButtons } from './component';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
// import { useState } from 'react';
import { registerUser } from '@/api/authApi';
// import { useMutation } from '@tanstack/react-query';
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
  // const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
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

  // const triggerTermsOfService = () => {
  //   setIsTermsOfServiceOpen(prev => !prev);
  // };

  type User = {
    id: string;
    email: string;
    fullName: string;
  };

  const { mutateAsync, isPending } = useMutation<
    User,
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
      // dispatch(setEmail(vars.email));
      reset();
      navigate('/verify-email');
    },

    onError: (error: AxiosError) => {
      if (error?.response?.status === 409) {
        setError('email', {
          type: 'server',
          message: '该邮箱已被注册',
        });
      } else {
        // 可选：显示其他错误信息
        setError('root', {
          type: 'server',
          message: '注册失败，请稍后再试',
        });
      }
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
      onSubmit={handleSubmit(
        async data => {
          await mutateAsync(data);
        }
        // data => {
        //   console.log(data);
        // }
      )}
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
        helperText="Use 8+ characters, with uppercase, lowercase and number"
      />
      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        control={control}
        type="password"
      />

      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              }
              label={
                <Typography variant="p1" component="span">
                  I agree to the{' '}
                  <TextButton type="button">
                    Terms of Service and Privacy Policy
                  </TextButton>
                </Typography>
              }
            />
            {errors.acceptTerms && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: -1, mb: 1, display: 'block' }}
              >
                {errors.acceptTerms.message}
              </Typography>
            )}
          </>
        )}
      />

      <Button
        variant="contained"
        color="primary"
        size="medium"
        fullWidth
        type="submit"
        disabled={isPending}
      >
        Create Account
      </Button>

      <Divider>OR</Divider>
      <SocialLoginButtons />
    </RegistrationFormContainer>
  );
};
