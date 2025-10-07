import httpClient from './httpClient';

export interface SuburbReportExportPayload {
  suburbId: number;
  suburbName?: string;
  state?: string;
  postcode?: string;
  housingMarket?: any;
  livability?: any;
  incomeEmployment?: any;
  safetyScores?: any[];
  generatedAtUtc?: string;
  summary?: string;
  metrics?: Record<string, any>;
  charts?: string[];
  options?: {
    includeCharts?: boolean;
    includeSummary?: boolean;
  };
}

// export const exportSuburbReport = async (payload: SuburbReportExportPayload): Promise<Blob> => {
//   const response = await httpClient.post('/export/pdf/suburb', payload, {
//     responseType: 'blob',
//   });
//   return response.data;
// };

export async function exportSuburbReport(payload: SuburbReportExportPayload): Promise<{ blob: Blob; filename: string }> {
  console.log('Sending export request for suburb ID:', payload.suburbId);
  
  try {
    // Use the new endpoint that fetches data from database
    const response = await httpClient.post(`/export/pdf/suburb/${payload.suburbId}`, {}, {
      responseType: 'blob',
      timeout: 60000, // ✅ override default 10s timeout just for this call
    });
    
    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'SettlyAI_SuburbReport.pdf'; // fallback filename
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    return { blob: response.data, filename };
  } catch (error: any) {
    console.error('Export API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    // Try to extract error message from blob response
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        console.error('Error details from backend:', errorText);
      } catch (blobError) {
        console.error('Could not read error blob:', blobError);
      }
    }
    
    throw error;
  }
}


export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};