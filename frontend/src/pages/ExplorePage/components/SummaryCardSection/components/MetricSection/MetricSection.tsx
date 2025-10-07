import { styled, Typography, Box, alpha } from '@mui/material';

const MetricContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

const MetricItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const MetricSection = () => {
  return (
    <MetricContainer>
      <MetricItem>
        <Typography variant="subtitle2">Median Price: </Typography>
        <p>$1.25M</p>
      </MetricItem>
      <MetricItem>
        <Typography variant="subtitle2">Price Growth 3-Year: </Typography>
        <p>10.5%</p>
      </MetricItem>
      <MetricItem>
        <Typography variant="subtitle2">Safety Rating: </Typography>
        <p>8.5/10</p>
      </MetricItem>
      <MetricItem>
        <Typography variant="subtitle2">Affordability: </Typography>
        <p>8.5/10</p>
      </MetricItem>
    </MetricContainer>
  );
};

export default MetricSection;
