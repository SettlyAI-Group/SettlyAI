import { Box, Card, styled, Typography } from '@mui/material';

interface IMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
}

const CardWrapper = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: theme.spacing(2),
  height: theme.spacing(51),
}));

const CardIcon = styled(Box)(({ theme }) => ({
  fontSize: '24px',
  color: theme.palette.primary.main,
}));

const MetricCard = ({ icon, title, value, subtitle }: IMetricCardProps) => {
  return (
    <CardWrapper variant="outlined">
      <CardIcon>{icon}</CardIcon>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="cardValue" color="primary">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="p1" sx={{ color: 'text.cardHint' }}>
          {subtitle}
        </Typography>
      )}
    </CardWrapper>
  );
};

export default MetricCard;
