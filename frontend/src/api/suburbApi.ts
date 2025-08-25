import type { ILivability, ISuburbBasicInfo } from '@/interfaces/suburbReport';
import httpClient from './httpClient';
import type { IDemandAndDev } from '@/interfaces/DemandAndDev';

export const getSuburbBasicInfo = async (
  suburbId: string
): Promise<ISuburbBasicInfo> => {
  const response = await httpClient.get<ISuburbBasicInfo>(
    `/suburb/${suburbId}`
  );
  return response.data;
};

export const getSuburbLivability = async (
  suburbId: string
): Promise<ILivability> => {
  const response = await httpClient.get<ILivability>(
    `/suburb/${suburbId}/livability`
  );
  return response.data;
};

// Get Demand and Development data by suburb ID
export const getDemandAndDev = async (
  suburbId: number
): Promise<IDemandAndDev> => {
  const response = await httpClient.get<IDemandAndDev>(
    `/populationsupply/${suburbId}`
  );
  return response.data;
};
