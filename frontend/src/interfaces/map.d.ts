export interface IGeocodeApiResult {
  address?: Record<string, string>;
}

export interface IApiSuburbData {
  suburb: string;
  state: string;
  postcode: string;
}

export interface ILatLonData {
  lat: number;
  lon: number;
}
