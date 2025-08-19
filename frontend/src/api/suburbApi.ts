import type { ILivability, ISuburbReport } from '@/interfaces/suburbReport';
import httpClient from './httpClient';
import type { IDemandAndDev } from '@/interfaces/DemandAndDev';

// Get suburb report by suburb ID
export const getSuburbReport = async (
  suburbId: string
): Promise<ISuburbReport> => {
  const response = await httpClient.get<ISuburbReport>(`/suburb/${suburbId}`);
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
