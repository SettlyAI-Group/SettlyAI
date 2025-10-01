import React from 'react';
import { Card, CardContent, Typography, Tooltip } from '@mui/material';
interface MetricCardProps {
  label: string;
  value: string | number | null | undefined;
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, tooltip }) => (
  <Tooltip title={tooltip || ''} placement="top" arrow>
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          {value ?? '—'}
        </Typography>
      </CardContent>
    </Card>
  </Tooltip>
);
export default MetricCard;
