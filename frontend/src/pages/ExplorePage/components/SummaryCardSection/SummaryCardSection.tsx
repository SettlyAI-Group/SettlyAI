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
  paddingInline: theme.spacing(6),
  paddingBlock: theme.spacing(4),
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
}));

const TitleText = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
  alignSelf: 'flex-start',
  paddingBottom: 4,
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  alignSelf: 'flex-start',
  paddingBottom: 4,
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  alignSelf: 'flex-start',
  paddingBottom: 8,
}));

const SummaryCardSection = () => {
  const overview = useSelector(selectSelectedOverview);
  return (
    <SectionContainer>
      <SummaryCardContainer>
        <TitleText>
          {overview?.suburb?.name
            ? `${overview.suburb.name}, ${overview.suburb.stateCode} ${overview.suburb.postcode}`
            : 'Please select a suburb from the map'}
        </TitleText>
        <MetricSection />
        <SummaryText>{overview?.summary?.text}</SummaryText>
        <SubtitleText>{overview?.highlights?.length > 0 ? `What Makes This Suburb Stand Out` : ''}</SubtitleText>
        <HighlightSection />
      </SummaryCardContainer>
    </SectionContainer>
  );
};

export default SummaryCardSection;
