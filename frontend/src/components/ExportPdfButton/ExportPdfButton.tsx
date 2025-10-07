import React, { useState } from 'react';
import { Button, CircularProgress, styled } from '@mui/material';
import { exportSuburbReport, downloadBlob, type SuburbReportExportPayload } from '@/api/exportApi';
import { handleApiError } from '@/utils/handleApiError';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  '&:disabled': {
    opacity: 0.6,
  },
}));

export interface ExportPdfButtonProps {
  exportType: 'suburb' | 'property' | 'loan';
  payload: SuburbReportExportPayload;
  disabled?: boolean;
  onSuccess?: (filename: string) => void;
  onError?: (error: string) => void;
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  exportType,
  payload,
  disabled = false,
  onSuccess,
  onError,
}) => {
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
    <StyledButton
      variant="contained"
      color="primary"
      onClick={handleExport}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
    >
      {getButtonText()}
    </StyledButton>
  );
};

export default ExportPdfButton;
