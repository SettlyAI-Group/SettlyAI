export interface SuggestionOutputDto {
  name: string;
  state: string;
  postcode: string;
  address: string;
  suburbId: number;
}

export interface SuggestionList {
  name?: string;
  state?: string;
  postcode?: string | number;
  address?: string;
  suburbId?: number;
}
