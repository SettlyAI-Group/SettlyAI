import React, { type ReactNode } from 'react';
import { Card, CardContent, Typography, Tooltip } from '@mui/material';

interface MetricCardProps {
  label: string;
  value: string | number | null | undefined;
  tooltip?: string;
  secondary?: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, tooltip, secondary }) => (
  <Tooltip title={tooltip || ''} placement="top" arrow>
    <Card sx={{ height: '100%', backgroundColor: 'grey.50' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="text.secondary" sx={{ textTransform: 'none' }}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          {value ?? '--'}
        </Typography>
        {secondary ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {secondary}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  </Tooltip>
);

export default MetricCard;



