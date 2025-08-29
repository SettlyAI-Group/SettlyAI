//Setup the interface for the return data from Backend SearchSuggest Api
export interface SuggestionOutputDto {
  name: string;
  state: string;
  postcode: string;
  address: string;
  suburbId: number;
}

//Setup the interface for the showing the data in the suggestion list to the frontend user
export interface SuggestionList {
  name?: string;
  state?: string;
  postcode?: string | number;
  address?: string;
  suburbId?: number;
}
