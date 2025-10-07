import React, { useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { exportSuburbReport, downloadBlob, type SuburbReportExportPayload } from '@/api/exportApi';
import { handleApiError } from '@/utils/handleApiError';
import GlobalButton from '@/components/GlobalButton';

export interface ExportPdfButtonProps {
  suburbId: string;
  formattedData: any;
  results: any[];
  disabled?: boolean;
  onSuccess?: (filename: string) => void;
  onError?: (error: string) => void;
}

const ExportPdfButton = ({
  suburbId,
  formattedData,
  results,
  disabled = false,
  onSuccess,
  onError,
}: ExportPdfButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Create export payload from raw data
  const exportPayload: SuburbReportExportPayload = useMemo(() => ({
    suburbId: parseInt(suburbId),
    suburbName: formattedData.suburbBasicInfo?.name || '',
    state: formattedData.suburbBasicInfo?.state || '',
    postcode: formattedData.suburbBasicInfo?.postcode || '',
    housingMarket: results[3]?.data || null,
    livability: formattedData.livability || null,
    incomeEmployment: formattedData.incomeEmployment || null,
    safetyScores: formattedData.safetyScores || null,
    generatedAtUtc: new Date().toISOString(),
    summary: `Comprehensive suburb report for ${formattedData.suburbBasicInfo?.name}, ${formattedData.suburbBasicInfo?.state} ${formattedData.suburbBasicInfo?.postcode}`,
    metrics: {},
    charts: [],
    options: {
      includeCharts: true,
      includeSummary: true
    }
  }), [suburbId, formattedData, results]);

  const handleExport = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    try {
      const { blob, filename } = await exportSuburbReport(exportPayload);
      downloadBlob(blob, filename);
      onSuccess?.(filename);
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('PDF export failed:', errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Exporting...';
    return 'Export PDF';
  };

  return (
    <GlobalButton
      variant="contained"
      color="primary"
      onClick={handleExport}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size="inherit" color="inherit" /> : undefined}
    >
      {getButtonText()}
    </GlobalButton>
  );
};

export default ExportPdfButton;
