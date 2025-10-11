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
  [theme.breakpoints.down(1250)]: {
    paddingInline: theme.spacing(8),
  },
}));

const SummaryCardContainer = styled(Box)(({ theme }) => ({
  width: '1200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingInline: theme.spacing(8),
  paddingBlock: theme.spacing(8),
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
  borderRadius: theme.spacing(8),
  [theme.breakpoints.down(1250)]: {
    width: '100%',
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
  alignSelf: 'flex-start',
  paddingBottom: 30,
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  alignSelf: 'flex-start',
  paddingBottom: 20,
  textAlign: 'left',
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  alignSelf: 'flex-start',
  paddingBottom: 20,
  textAlign: 'left',
}));

const SummaryCardSection = () => {
  const overview = useSelector(selectSelectedOverview);
  return (
    <SectionContainer>
      <SummaryCardContainer>
        <TitleText>
          {overview?.suburb?.name
            ? `${overview.suburb.name}, ${overview.suburb.stateCode} ${overview.suburb.postcode}`
            : 'Melbourne, VIC 3000'}
        </TitleText>
        <MetricSection />
        <SummaryText>
          {overview?.summary?.text
            ? `${overview?.summary?.text}`
            : "Melbourne's median price is $2.2M, with 10.78% growth over the past 3 years. Safety is rated Medium, and affordability is Medium."}
        </SummaryText>
        <SubtitleText>What Makes This Suburb Stand Out</SubtitleText>
        <HighlightSection />
      </SummaryCardContainer>
    </SectionContainer>
  );
};

export default SummaryCardSection;
