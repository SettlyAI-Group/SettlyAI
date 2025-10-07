import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { exportSuburbReport, downloadBlob, type SuburbReportExportPayload } from '@/api/exportApi';

interface ExportPdfButtonProps {
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
  onError 
}: ExportPdfButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (loading || disabled) return;

    setLoading(true);
    try {
      let blob: Blob;
      
      switch (exportType) {
        case 'suburb':
          blob = await exportSuburbReport(payload);
          break;
        case 'property':
          // TODO: Implement property export
          throw new Error('Property export not implemented yet');
        case 'loan':
          // TODO: Implement loan export
          throw new Error('Loan export not implemented yet');
        default:
          throw new Error(`Unknown export type: ${exportType}`);
      }

      // Extract filename from Content-Disposition header or generate default
      const filename = `SettlyAI_${exportType}_report_${Date.now()}.pdf`;
      downloadBlob(blob, filename);
      
      onSuccess?.(filename);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleExport}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
      sx={{
        minWidth: '140px',
      }}
    >
      {loading ? 'Generating...' : 'Export PDF'}
    </Button>
  );
};

export default ExportPdfButton;