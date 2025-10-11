import { styled, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSelectedOverview } from '@/redux/mapSuburbSlice';
import { TrendingUp, BadgeDollarSign, Shield, Trees } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

const MetricContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gap: 20,
  gridTemplateColumns: '1fr',
  paddingBottom: 30,
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

const MetricItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down(600)]: {
    alignItems: 'center',
  },
}));

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
}));

const MetricTextColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down(600)]: {
    alignItems: 'center',
  },
}));

const Metrictitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  [theme.breakpoints.down(600)]: {
    maxWidth: '12ch',
    lineHeight: 1.25,
  },
}));

const MetricValue = styled('p')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  color: theme.palette.primary.main,
}));

const MetricSection = () => {
  const overview = useSelector(selectSelectedOverview);
  const { palette } = useTheme();
  return (
    <MetricContainer>
      <MetricItem>
        <ItemContainer>
          <BadgeDollarSign size={30} strokeWidth={1.75} color={palette.text.secondary} />
          <MetricTextColumn>
            <Metrictitle>Median Price: </Metrictitle>
            <MetricValue>
              {overview?.metrics?.medianPriceFormatted ? `$${overview?.metrics?.medianPriceFormatted}` : '$2,217,600'}
            </MetricValue>
          </MetricTextColumn>
        </ItemContainer>
      </MetricItem>

      <MetricItem>
        <ItemContainer>
          <TrendingUp size={30} strokeWidth={1.75} color={palette.text.secondary} />
          <MetricTextColumn>
            <Metrictitle>Price Growth 3-Year: </Metrictitle>
            <MetricValue>
              {overview?.metrics?.priceGrowth3YrPct != null ? `${overview.metrics.priceGrowth3YrPct}%` : '10.78%'}
            </MetricValue>
          </MetricTextColumn>
        </ItemContainer>
      </MetricItem>

      <MetricItem>
        <ItemContainer>
          <Shield size={30} strokeWidth={1.75} color={palette.text.secondary} />
          <MetricTextColumn>
            <Metrictitle>Safety Rating: </Metrictitle>
            <MetricValue>{overview?.metrics?.safety?.safetyLabel ?? 'Medium'}</MetricValue>
          </MetricTextColumn>
        </ItemContainer>
      </MetricItem>
      <MetricItem>
        <ItemContainer>
          <Trees size={30} strokeWidth={1.75} color={palette.text.secondary} />
          <MetricTextColumn>
            <Metrictitle>Affordability: </Metrictitle>
            <MetricValue>{overview?.metrics?.affordability?.label ?? 'Medium'}</MetricValue>
          </MetricTextColumn>
        </ItemContainer>
      </MetricItem>
    </MetricContainer>
  );
};

export default MetricSection;
