export interface SuggestionOutputDto {
  name: string;
  state: string;
  postcode: string;
  address: string;
}

export interface SuggestionList {
  name?: string;
  state?: string;
  postcode?: string | number;
  address?: string;
}
