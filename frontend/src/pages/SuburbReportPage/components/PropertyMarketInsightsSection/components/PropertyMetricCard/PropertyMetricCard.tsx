import { Card, CardContent, Tooltip, Typography, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
export interface PropertyMetricItem {
  label: string;
  value: string;
  subText?: string;
  hint?: string;
  growthValue?: number;
  isGrowthMetric?: boolean;
}
const PropertyMetricCard = ({
  label,
  value,
  subText,
  hint,
  growthValue,
  isGrowthMetric = false,
}: PropertyMetricItem) => {
  const getValueColor = (growthValue?: number, isGrowthMetric?: boolean) => {
    if (!isGrowthMetric) return 'primary.main';

    if (growthValue === undefined) return 'text.primary';
    if (growthValue > 0) return 'success.main';
    if (growthValue < 0) return 'error.main';
    return 'text.primary';
  };
  const valueColor = getValueColor(growthValue, isGrowthMetric);
  return (
    <Card
      variant="outlined"
      sx={{ height: 110, borderRadius: 2, position: 'relative' }}
    >
      {hint && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Tooltip title={hint}>
            <InfoOutlinedIcon
              fontSize="small"
              sx={{
                color: 'text.disabled',
                cursor: 'pointer',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            />
          </Tooltip>
        </Box>
      )}

      <CardContent
        sx={{
          minHeight: 80,
          display: 'grid',
          alignContent: 'center',
          p: 4,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: valueColor,
          }}
        >
          {value}
        </Typography>
        {subText && (
          <Typography variant="p1" sx={{ color: 'text.disabled', mt: 0.25 }}>
            {subText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyMetricCard;
