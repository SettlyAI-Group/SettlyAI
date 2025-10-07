import type { IGeocodeApiResult, IApiSuburbData, IGeocodeData } from '@/interfaces/map';
import httpClient from './httpClient';
import axios from 'axios';

const GEOCODING_URL = `https://nominatim.openstreetmap.org/reverse`;

export const fetchGeocodingApi = async (lat: number, lon: number): Promise<IGeocodeData> => {
  const { data } = await axios.get<IGeocodeApiResult>(GEOCODING_URL, {
    params: { format: 'jsonv2', addressdetails: 1, lat, lon },
  });
  const suburbData = data.address ?? {};
  return {
    suburb: suburbData.suburb ?? 'unknown',
    state: suburbData.state ?? 'unknown',
    postcode: suburbData.postcode ?? 'unknown',
  };
};

export const getSuburbFromDb = async (payload: IGeocodeData): Promise<IApiSuburbData> => {
  const { data } = await httpClient.get<IApiSuburbData>('/suburbs/overview', {
    params: {
      suburb: payload.suburb,
      state: payload.state,
      postcode: payload.postcode,
    },
  });

  return data;
};
