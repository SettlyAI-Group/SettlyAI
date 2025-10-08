import { styled, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSelectedOverview } from '@/redux/mapSuburbSlice';

const MetricContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gap: 12,
  gridTemplateColumns: '1fr',
  paddingBottom: 12,
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

const MetricItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const Metrictitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
}));

const MetricValue = styled('p')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  color: theme.palette.primary.main,
}));

const MetricSection = () => {
  const overview = useSelector(selectSelectedOverview);
  return (
    <MetricContainer>
      <MetricItem>
        <Metrictitle>Median Price: </Metrictitle>
        <MetricValue>
          {overview?.metrics?.medianPriceFormatted ? `$${overview?.metrics?.medianPriceFormatted}` : ''}
        </MetricValue>
      </MetricItem>
      <MetricItem>
        <Metrictitle>Price Growth 3-Year: </Metrictitle>
        <MetricValue>
          {overview?.metrics?.priceGrowth3YrPct ? `${overview?.metrics?.priceGrowth3YrPct}%` : ''}
        </MetricValue>
      </MetricItem>
      <MetricItem>
        <Metrictitle>Safety Rating: </Metrictitle>
        <MetricValue>{overview?.metrics?.safety?.safetyLabel}</MetricValue>
      </MetricItem>
      <MetricItem>
        <Metrictitle>Affordability: </Metrictitle>
        <MetricValue>{overview?.metrics?.affordability?.label}</MetricValue>
      </MetricItem>
    </MetricContainer>
  );
};

export default MetricSection;
