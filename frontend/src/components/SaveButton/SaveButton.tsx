import React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography, CircularProgress } from '@mui/material';
import GlobalButton from '../GlobalButton/GlobalButton';
import { getFavouriteByTarget, toggleFavourite } from '../../api/favourite';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TargetType } from '../../types/favourite';
type Props = {
  targetType: TargetType;
  targetId: number;
  onToggle?: (newState: boolean) => void;
};
type FavState = { isSaved: boolean };
const SaveButton: React.FC<Props> = ({ targetType, targetId, onToggle }) => {
  const { isAuthenticated, status } = useAuth(); // status: 'unknown' | 'authenticated' | 'guest'
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: favouriteStatus, isLoading: isLoadingStatus } =
    useQuery<FavState>({
      queryKey: ['favourite', targetType, targetId],
      queryFn: () => getFavouriteByTarget(targetType, targetId),
      enabled: status === 'authenticated' && !!targetType && !!targetId,
      staleTime: 10_000,
      retry: false,
    });
  const toggleMutation = useMutation<
    FavState,
    unknown,
    void,
    { prev?: FavState }
  >({
    mutationKey: ['favourite-toggle', targetType, targetId],
    mutationFn: () => toggleFavourite(targetType, targetId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['favourite', targetType, targetId],
        exact: true,
      });
      const prev = queryClient.getQueryData<FavState>([
        'favourite',
        targetType,
        targetId,
      ]);
      if (isAuthenticated) {
        queryClient.setQueryData<FavState>(
          ['favourite', targetType, targetId],
          old => ({ isSaved: !(old?.isSaved ?? false) })
        );
      }
      onToggle?.(!(prev?.isSaved ?? false));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['favourite', targetType, targetId], ctx.prev);
        onToggle?.(ctx.prev.isSaved);
      }
    },
    onSuccess: data => {
      queryClient.setQueryData(['favourite', targetType, targetId], data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });
  const handleClick = () => {
    if (toggleMutation.isPending) return;
    if (!isAuthenticated) {
      const redirectTo = `${location.pathname}${location.search}${location.hash}`;
      navigate('/login', { state: { redirectTo } });
      return;
    }
    toggleMutation.mutate();
  };
  const isSaved = favouriteStatus?.isSaved ?? false;
  const isLoading = isLoadingStatus || toggleMutation.isPending;
  const isDisabled = isLoading || status === 'unknown';
  return (
    <GlobalButton
      width="180"
      height="40"
      variant="outlined"
      disabled={isDisabled}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : isSaved ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )
      }
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Unsave report' : 'Save report'}
      title={
        isAuthenticated ? (isSaved ? 'Unsave' : 'Save') : 'Sign in to save'
      }
    >
      <Typography variant="p1">{isSaved ? 'Saved' : 'Save'}</Typography>
    </GlobalButton>
  );
};
export default SaveButton;
