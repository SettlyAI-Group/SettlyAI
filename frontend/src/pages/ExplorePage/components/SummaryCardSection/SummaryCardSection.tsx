import { styled, Typography, Box, alpha } from '@mui/material';
import { useSelector } from 'react-redux';
import MetricSection from './components/MetricSection';
import HighlightSection from './components/HighlightSection';
import { selectSelectedOverview } from '@/redux/mapSuburbSlice';

const SectionContainer = styled('section')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  paddingTop: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
}));

const SummaryCardContainer = styled(Box)(({ theme }) => ({
  width: '1200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingInline: theme.spacing(4),
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  alignSelf: 'flex-start',
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  alignSelf: 'flex-start',
}));

const SummaryCardSection = () => {
  const overview = useSelector(selectSelectedOverview);
  return (
    <SectionContainer>
      <SummaryCardContainer>
        <Typography variant="h2">
          Explore {overview?.suburb?.name}, {overview?.suburb?.stateCode} {overview?.suburb?.postcode}
        </Typography>
        <MetricSection />
        <SummaryText>
          Glen Waverley's median price is $1.25M, with 10.5% growth over the past 3 years. Safety is rated High, and
          affordability is High.
        </SummaryText>
        <SubtitleText>What Makes This Suburb Stand Out</SubtitleText>
        <HighlightSection />
      </SummaryCardContainer>
    </SectionContainer>
  );
};

export default SummaryCardSection;
