import { FormPageContainer } from '../../components/FormPageContainer';
import { FormContainer } from './component/FormContainer';
import { Typography, TextField, CircularProgress } from '@mui/material';
import GlobalButton from '@/components/GlobalButton';
import { TextButton } from './component/TextButton';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { useState, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { verifyEmail, sendVerificationCode } from '@/api/authApi';
import type { IVerifyEmailRequest } from '@/interfaces/user';
import { z } from 'zod';
import { styled } from '@mui/material/styles';

const verificationCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Verification code must be 6 digits');

interface MessageProps {
  type: 'error' | 'success';
}

const MessageText = styled(Typography, {
  shouldForwardProp: prop => prop !== 'type',
})<MessageProps>(({ theme, type }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  color:
    type === 'error' ? theme.palette.error.main : theme.palette.success.main,
}));

export const VerificationPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');

  // 验证邮箱mutation
  const verifyMutation = useMutation<
    { success: boolean; message?: string },
    AxiosError,
    IVerifyEmailRequest
  >({
    mutationFn: verifyEmail,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const resendMutation = useMutation<
    { success: boolean; message?: string },
    AxiosError,
    number
  >({
    mutationFn: (userId: number) => sendVerificationCode(userId, 1),
  });

  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(event.target.value);
  };

  const handleVerificationCodeSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = verificationCodeSchema.safeParse(verificationCode);
    if (!result.success || !userId) {
      return;
    }

    verifyMutation.mutate({
      userId: parseInt(userId, 10),
      code: result.data,
      verificationType: 1,
    });
  };

  const handleResendCode = () => {
    if (!userId) return;
    resendMutation.mutate(parseInt(userId, 10));
  };

  const getMessage = () => {
    if (resendMutation.isSuccess) {
      return { type: 'success', text: 'Verification code sent successfully!' };
    }

    if (verifyMutation.error) {
      const text =
        verifyMutation.error.response?.status === 400
          ? 'Invalid or expired verification code'
          : 'Verification failed. Please try again.';
      return { type: 'error', text };
    }
    if (resendMutation.error) {
      return { type: 'error', text: 'Failed to resend verification code' };
    }
    const result = verificationCodeSchema.safeParse(verificationCode);
    if (verificationCode && !result.success) {
      return { type: 'error', text: 'Verification code must be 6 digits' };
    }
    if (!userId) {
      return { type: 'error', text: 'User ID is missing' };
    }
    return null;
  };

  return (
    <FormPageContainer>
      <FormContainer
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleVerificationCodeSubmit}
      >
        <Typography variant="h4" component="h3" marginBottom={4}>
          Check your email for a code
        </Typography>
        <Typography variant="body2" marginBottom={6} textAlign="center">
          Check your inbox for a 6-digit code and enter it below.
        </Typography>

        {/* 消息显示 */}
        {getMessage() && (
          <MessageText
            type={getMessage()?.type === 'error' ? 'error' : 'success'}
          >
            {getMessage()?.text}
          </MessageText>
        )}

        <TextField
          value={verificationCode}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          label="Verification code*"
          disabled={verifyMutation.isPending}
          slotProps={{
            inputLabel: {
              sx: theme => ({
                ...theme.typography.body2,
                color: theme.palette.grey[500],
              }),
            },
            input: {
              startAdornment: <LockOutlined fontSize="small" color="action" />,
            },
          }}
          onChange={handleVerificationCodeChange}
        />

        <GlobalButton
          type="submit"
          width="full"
          height="50"
          color="primary"
          variant="contained"
          disabled={verifyMutation.isPending}
          sx={{ mt: 3 }}
        >
          {verifyMutation.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Continue'
          )}
        </GlobalButton>

        <Typography paddingTop={6} variant="p1">
          Can&apos;t find it? Check your spam folder.{'  '}
          <TextButton
            onClick={handleResendCode}
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend'}
          </TextButton>
        </Typography>
      </FormContainer>
    </FormPageContainer>
  );
};
