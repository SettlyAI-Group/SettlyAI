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
  [theme.breakpoints.down(1000)]: {
    width: 250,
  },
  [theme.breakpoints.down(600)]: {
    width: '100%',
  },
}));

const HighlightIcon = (label: string, color: string) => {
  switch (label.trim().toLowerCase()) {
    case 'low crime':
      return <ShieldCheck size={30} strokeWidth={1.75} color={color} />;
    case 'strong growth':
      return <TrendingUp size={30} strokeWidth={1.75} color={color} />;
    case 'affordable choice':
      return <BadgeDollarSign size={30} strokeWidth={1.75} color={color} />;
    default:
      return <Star size={30} strokeWidth={1.75} color={color} />;
  }
};

const HighlightSection = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const overview = useSelector(selectSelectedOverview);
  const suburbId = overview?.suburb?.id ? overview?.suburb?.id : 1;
  const highlightFromRedux = overview?.highlights?.filter(Boolean) ?? [];
  const highlights =
    overview == null ? ['Strong Growth'] : highlightFromRedux && highlightFromRedux.length ? highlightFromRedux : [];

  return (
    <HighlightContainer>
      <LeftContainer>
        {highlights.length > 0 &&
          highlights.map((highlight, index) => (
            <ItemContainer key={highlight || index}>
              {HighlightIcon(highlight, palette.primary.main)}
              <HighlightTextColumn>
                <Highlight variant="subtitle2">{highlight}</Highlight>
              </HighlightTextColumn>
            </ItemContainer>
          ))}
      </LeftContainer>
      <RightContainer>
        <ReportButton onClick={() => suburbId && navigate(`/suburb/${suburbId}`)} disabled={!suburbId}>
          View Suburb Report
        </ReportButton>
      </RightContainer>
    </HighlightContainer>
  );
};

export default HighlightSection;
