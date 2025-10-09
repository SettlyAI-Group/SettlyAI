import { styled, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSelectedOverview } from '@/redux/mapSuburbSlice';
import GlobalButton from '@/components/GlobalButton';
import { ShieldCheck, TrendingUp, BadgeDollarSign, Star } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
}));

const HighlightTextColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

const ReportButton = styled(GlobalButton)(({ theme }) => ({
  height: 44,
  width: 400,
  fontSize: theme.typography.subtitle1.fontSize,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: 8,
}));

const HighlightIcon = (label: string) => {
  const { palette } = useTheme();
  switch (label.trim().toLowerCase()) {
    case 'low crime':
      return <ShieldCheck size={30} strokeWidth={1.75} color={palette.primary.main} />;
    case 'strong growth':
      return <TrendingUp size={30} strokeWidth={1.75} color={palette.primary.main} />;
    case 'affordable choice':
      return <BadgeDollarSign size={30} strokeWidth={1.75} color={palette.primary.main} />;
    default:
      return <Star size={30} strokeWidth={1.75} color={palette.primary.main} />;
  }
};

const HighlightSection = () => {
  const navigate = useNavigate();
  const overview = useSelector(selectSelectedOverview);
  const suburbId = overview?.suburb?.id;
  const highlights = useSelector(selectSelectedOverview)?.highlights.filter(Boolean) ?? [];
  return (
    <HighlightContainer>
      <LeftContainer>
        {highlights.length > 0 &&
          highlights.map((highlight, index) => (
            <ItemContainer key={highlight || index}>
              {HighlightIcon(highlight)}
              <HighlightTextColumn>
                <Highlight variant="subtitle2">{highlight}</Highlight>
              </HighlightTextColumn>
            </ItemContainer>
          ))}
      </LeftContainer>

      <ReportButton onClick={() => suburbId && navigate(`/suburb/${suburbId}`)} disabled={!suburbId}>
        View Suburb Report
      </ReportButton>
    </HighlightContainer>
  );
};

export default HighlightSection;
