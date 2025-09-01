import { http } from './http';
import type {
  TargetType,
  FavouriteStateDto,
  ToggleFavouriteDto,
} from '@/types/favourite';
import { store } from '@/redux/store';
import type { RootState } from '@/redux/store';
export async function getFavouriteByTarget(
  targetType: TargetType,
  targetId: number
): Promise<FavouriteStateDto> {
  const state = store.getState() as RootState;
  const userId = state.auth.user?.id;
  if (!userId) throw new Error('User not authenticated');
  const { data } = await http.get(`/favourites/single`, {
    params: { targetType, targetId, userId },
  });
  return data;
}
export async function toggleFavourite(
  targetType: TargetType,
  targetId: number
): Promise<ToggleFavouriteDto> {
  const state = store.getState() as RootState;
  const userId = state.auth.user?.id;
  if (!userId) throw new Error('User not authenticated');
  const { data } = await http.post(`/favourites/toggle`, {
    targetType,
    targetId,
    userId,
  });
  return data;
}
export async function getMyFavourites(): Promise<
  Array<{ targetType: TargetType; targetId: number }>
> {
  const { data } = await http.get(`/favourites`);
  return data;
}
