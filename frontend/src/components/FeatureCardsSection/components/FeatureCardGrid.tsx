import { Box, styled, Typography } from '@mui/material';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';
import { alpha } from '@mui/material/styles';

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(14),
  justifyContent: 'center',
  flexWrap: 'wrap',
  paddingInline: theme.spacing(20),
  marginInline: theme.spacing(6),
}));

const StyledCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.spacing(2),
  padding: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  cursor: 'pointer',
  flex: 1,
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  minWidth: theme.spacing(95),
  minHeight: theme.spacing(75),

}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.secondary.main, 0.15),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const StyledIcon = styled('div')(({ theme }) => ({
  color: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: 'inherit',
    fontSize: theme.spacing(8),
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  fontSize: theme.typography.h6.fontSize,
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  flex: 1,
}));

const StyledGlobalButton = styled(GlobalButton)(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: alpha(theme.palette.secondary.main, 0.15),
  color: theme.palette.secondary.main,
  minHeight: theme.spacing(5),
  minWidth: theme.spacing(23),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  textTransform: 'none',
  whiteSpace: 'nowrap',
  alignSelf: 'flex-end',
  letterSpacing: '-0.8px',
}));


const FeatureCardGrid = () => {
  const featureCards = [
    {
      title: 'SettlyHome',
      description:
        "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
      icon: <Home />,
      ctaText: 'Let AI Guide me',
      onClick: () => console.log('Navigate to home features'),
    },
    {
      title: 'SettlyLoan',
      description:
        'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
      icon: <AttachMoney />,
      ctaText: 'Simulate Loan',
      onClick: () => console.log('Navigate to loan calculator'),
    },
    {
      title: 'SettlySuper',
      description: 'Use Your Super Wisely to Boost Your Home Plan',
      icon: <TrendingUp />,
      ctaText: 'Compare Super Strategy',
      onClick: () => console.log('Navigate to super optimization'),
    },
  ];

  return (
    <FlexContainer>
      {featureCards.map((card, index) => (
        <StyledCard key={index} onClick={card.onClick}>
          <IconContainer>
            <StyledIcon>{card.icon}</StyledIcon>
          </IconContainer>
          <CardTitle variant="h5">{card.title}</CardTitle>
          <CardDescription variant="body2">{card.description}</CardDescription>
          <StyledGlobalButton
            onClick={(e) => {
              e.stopPropagation();
              card.onClick();
            }}
            variant="contained"
          >
            {card.ctaText}
          </StyledGlobalButton>
        </StyledCard>
      ))}
    </FlexContainer>
  );
};

export default FeatureCardGrid;
