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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

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
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const RegistrationFormContainer = styled(Box)<
  BoxProps & React.ComponentProps<'form'>
>(({ theme }) => ({
  padding: theme.spacing(2, 1),
  border: '1px solid #ccc',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  maxWidth: '440px',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.secondary.main,
}));

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, setError, reset } = useForm({
    resolver: zodResolver(userFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

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
    mutationFn: registerUser, // ✅ 发送注册请求

    onSuccess: () => {
      reset();
      navigate('/login'); // ✅ 注册成功后清空表单
    },

    onError: (error: AxiosError) => {
      if (error?.response?.status === 409) {
        setError('email', {
          type: 'server',
          message: '该邮箱已被注册',
        });
      } else {
        // 可选：显示其他错误信息
        setError('email', {
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
      onSubmit={handleSubmit(async data => {
        await mutateAsync(data);
      })}
    >
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

      <Button
        variant="contained"
        color="secondary"
        size="medium"
        fullWidth
        type="submit"
      >
        Create Account
      </Button>

      <Divider>OR</Divider>
      <SocialLoginButtons />
    </RegistrationFormContainer>
  );
};
