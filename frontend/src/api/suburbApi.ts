import type { ILivability, ISuburbBasicInfo } from '@/interfaces/suburbReport';
import httpClient from './httpClient';
import type { IDemandAndDev } from '@/interfaces/DemandAndDev';
import type { IHousingMarket } from '@/interfaces/housingmarket';

export const getSuburbBasicInfo = async (suburbId: string): Promise<ISuburbBasicInfo> => {
  const response = await httpClient.get<ISuburbBasicInfo>(`/suburb/${suburbId}`);
  return response.data;
};

export const getSuburbLivability = async (suburbId: string): Promise<ILivability> => {
  const response = await httpClient.get<ILivability>(`/suburb/${suburbId}/livability`);
  return response.data;
};

// Get Demand and Development data by suburb ID
export const getDemandAndDev = async (suburbId: number): Promise<IDemandAndDev> => {
  const response = await httpClient.get<IDemandAndDev>(`/populationsupply/${suburbId}`);
  return response.data;
};
// Get Housing Market data by suburb ID
export const getHousingMarket = async (suburbId: number): Promise<IHousingMarket> => {
  const response = await httpClient.get<IHousingMarket>(`/suburb/${suburbId}/housingmarket`);
  return response.data;
};
