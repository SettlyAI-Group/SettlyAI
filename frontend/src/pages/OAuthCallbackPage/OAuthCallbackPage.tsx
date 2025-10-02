import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { loginWithOAuth, getCurrentUser } from '@/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/authSlice';

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
  const dispatch = useAppDispatch();
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
        const provider = location.pathname.split('/').pop() || '';

        // 使用第三方授权码登录
        await loginWithOAuth(code, provider);

        // 登录成功后获取用户信息
        const user = await getCurrentUser();

        // 存储到 Redux
        dispatch(setUser(user));

        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Login failed, please try again');
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [navigate, location.search, location.pathname, dispatch]);

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
