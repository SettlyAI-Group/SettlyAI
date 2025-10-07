import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { exportSuburbReport, downloadBlob, type SuburbReportExportPayload } from '@/api/exportApi';
import { handleApiError } from '@/utils/handleApiError';
import GlobalButton from '@/components/GlobalButton';

export interface ExportPdfButtonProps {
  exportType: 'suburb' | 'property' | 'loan';
  payload: SuburbReportExportPayload;
  disabled?: boolean;
  onSuccess?: (filename: string) => void;
  onError?: (error: string) => void;
}

const ExportPdfButton = ({
  exportType,
  payload,
  disabled = false,
  onSuccess,
  onError,
}: ExportPdfButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    try {
      const { blob, filename } = await exportSuburbReport(payload);
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
