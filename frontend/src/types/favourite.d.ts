export type TargetType = 'suburb' | 'property' | 'loan';
export interface FavouriteStateDto {
  isSaved: boolean;
}
export interface ToggleFavouriteDto {
  isSaved: boolean;
}
export const buildFavKey = (type: TargetType, id: number) =>
  ['favourite', type, id] as const;
export const FAVOURITES_LIST_KEY = ['favourites'];
