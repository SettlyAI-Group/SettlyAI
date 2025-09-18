import type { IGeocodeApiResult, IApiSuburbData } from '@/interfaces/map';
import httpClient from './httpClient';
import axios from 'axios';

const GEOCODING_URL = `https://nominatim.openstreetmap.org/reverse`;

export const fetchGeocodingApi = async (lat: number, lon: number): Promise<IApiSuburbData> => {
  const { data } = await axios.get<IGeocodeApiResult>(GEOCODING_URL, {
    params: { format: 'jsonv2', addressdetails: 1, lat, lon },
  });
  return requiredData(data);
};

const requiredData = (apiData: IGeocodeApiResult): IApiSuburbData => {
  const data = apiData.address ?? {};
  return {
    suburb: data.suburb,
    state: data.state,
    postcode: data.postcode,
  };
};

export const getSuburbFromDb = async (payload: IApiSuburbData): Promise<any> => {
  const { suburb, state, postcode } = payload;
  const { data } = await httpClient.get<IApiSuburbData>('/suburbs/centroids', {
    params: { suburb, state, postcode },
  });
  return data;
};
