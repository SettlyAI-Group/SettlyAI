import { styled, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSelectedOverview } from '@/redux/mapSuburbSlice';
import GlobalButton from '@/components/GlobalButton';

const HighlightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  textAlign: 'left',
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  flex: 1,
  minWidth: 0,
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignSelf: 'flex-end',
  marginLeft: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const Highlight = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
}));

const ReportButton = styled(GlobalButton)(({ theme }) => ({
  height: 44,
  width: 400,
  fontSize: theme.typography.subtitle1.fontSize,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: 8,
}));

const HighlightSection = () => {
  const highlights = useSelector(selectSelectedOverview)?.highlights.filter(Boolean) ?? [];
  return (
    <HighlightContainer>
      <LeftContainer>
        {highlights.length > 0 &&
          highlights.map((highlight, index) => (
            <Highlight key={highlight || index} variant="subtitle2">
              {highlight}
            </Highlight>
          ))}
      </LeftContainer>

      <RightContainer>
        <ReportButton>View Suburb Report</ReportButton>
      </RightContainer>
    </HighlightContainer>
  );
};

export default HighlightSection;
