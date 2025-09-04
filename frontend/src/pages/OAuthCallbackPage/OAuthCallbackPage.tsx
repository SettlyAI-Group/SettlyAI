import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '@/api/httpClient';

const CenteredContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: 16,
});

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('Authorization code not found');
        }

        // 从路径中提取提供商名称 (/oauth/callback/google -> google)
        const provider = location.pathname.split('/').pop();
        
        // 发送到对应提供商的后端接口
        const response = await axiosInstance.post(`/auth/${provider}/callback`, { code });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Login failed, please try again');
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [navigate, location.search, location.pathname]);

  if (loading) {
    return (
      <CenteredContainer>
        <CircularProgress />
        <Typography>Processing login...</Typography>
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <Typography color="error">{error}</Typography>
      </CenteredContainer>
    );
  }

  return null;
};
