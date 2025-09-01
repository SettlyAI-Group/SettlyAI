import { http } from './http';
import type {
  TargetType,
  FavouriteStateDto,
  ToggleFavouriteDto,
} from '@/types/favourite';
export async function getFavouriteByTarget(
  targetType: TargetType,
  targetId: number
): Promise<FavouriteStateDto> {
  const { data } = await http.get(`/favourites/state`, {
    params: { targetType, targetId },
  });
  return data;
}
export async function toggleFavourite(
  targetType: TargetType,
  targetId: number
): Promise<ToggleFavouriteDto> {
  const { data } = await http.post(`/favourites/toggle`, {
    targetType,
    targetId,
  });
  return data;
}
export async function getMyFavourites(): Promise<
  Array<{ targetType: TargetType; targetId: number }>
> {
  const { data } = await http.get(`/favourites`);
  return data;
}
