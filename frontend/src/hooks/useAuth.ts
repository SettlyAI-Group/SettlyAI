import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkAuthStatus, login, logout } from '../redux/authSlice';
import type { User } from '../redux/authSlice';
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, status, token } = useAppSelector(
    s => s.auth
  );
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  return {
    status,
    isAuthenticated,
    isLoading,
    user,
    token,
    login: (u: User, t?: string) => dispatch(login({ user: u, token: t })),
    logout: () => dispatch(logout()),
  };
};
