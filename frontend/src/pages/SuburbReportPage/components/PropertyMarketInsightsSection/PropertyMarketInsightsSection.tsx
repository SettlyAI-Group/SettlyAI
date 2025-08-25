import { Box, Typography, styled } from '@mui/material';
import PropertyMetricCard from './components/PropertyMetricCard';
import type { PropertyMetricItem } from './components/PropertyMetricCard';
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 16),
  margin: theme.spacing(3, 0),
}));
const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(8),
}));
const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, min(300px))',
  gap: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));
const PropertyMarketInsightsSection = ({
  title = 'Property Market Insights',
  items,
}: {
  title?: string;
  items: PropertyMetricItem[];
}) => {
  return (
    <SectionContainer>
      <TitleWrapper>
        <Typography variant="h4">{title}</Typography>
      </TitleWrapper>

      <CardGrid>
        {items.map((item, index) => (
          <PropertyMetricCard key={index} {...item} />
        ))}
      </CardGrid>
    </SectionContainer>
  );
};
export default PropertyMarketInsightsSection;
