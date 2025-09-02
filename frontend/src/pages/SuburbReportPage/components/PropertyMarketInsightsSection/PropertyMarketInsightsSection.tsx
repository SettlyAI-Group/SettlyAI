import { Grid, Stack, Typography, useMediaQuery, useTheme, styled } from '@mui/material';
import PropertyMetricCard from './components/PropertyMetricCard';
import type { PropertyMetricItem } from './components/PropertyMetricCard';

const SectionWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: theme.spacing(8),
}));

const PropertyMarketInsightsSection = ({
  title = 'Property Market Insights',
  items,
}: {
  title?: string;
  items: PropertyMetricItem[];
}) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  let columns = 3;
  if (isSmDown) {
    columns = 1;
  } else if (isMdDown) {
    columns = 2;
  }

  return (
    <SectionWrapper>
      <Typography variant="h4">{title}</Typography>

      <Grid
        container
        spacing={6}
        columns={columns}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item, index) => (
          <PropertyMetricCard key={index} {...item} />
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default PropertyMarketInsightsSection;
