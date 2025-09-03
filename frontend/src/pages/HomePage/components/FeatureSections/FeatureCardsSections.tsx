import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Styled Components - Feature Detail Sections
const FeatureSection = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  margin: '0 auto',
  padding: theme.spacing(8, 2),

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
  },
}));

const LoanSection = styled(FeatureSection)(() => ({
  backgroundColor: '#f8f9fa',
}));

const FullCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: '12px',
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const ComingSoonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
  '& .MuiTypography-h6': {
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  '& .MuiTypography-body1': {
    fontWeight: 300,
    fontSize: '0.9rem',
  },
}));

const FeatureDetailSections = () => {
  return (
    <>
      {/* SettlyHome Section */}
      <FeatureSection id="home-section">
        <FullCard>
          <HomeIcon style={{ fontSize: 40, marginBottom: 16 }} />
          <Typography variant="h3" style={{ fontWeight: 400, textAlign: 'center', marginBottom: 16 }}>
            SettlyHome
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 200, textAlign: 'left' }}>
            Discover your perfect home with smart property insights and market analysis.
          </Typography>
        </FullCard>
        <ComingSoonContainer>
          <Typography variant="h6" gutterBottom>
            Coming Soon: Property Discovery Tools
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced suburb analysis, property recommendations, and market insights.
          </Typography>
        </ComingSoonContainer>
      </FeatureSection>

      {/* SettlyLoan Section */}
      <LoanSection id="loan-section">
        <FullCard>
          <AttachMoneyIcon style={{ fontSize: 40, marginBottom: 16 }} />
          <Typography variant="h3" style={{ fontWeight: 400, textAlign: 'center', marginBottom: 16 }}>
            SettlyLoan
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 200, textAlign: 'left' }}>
            Get personalized loan recommendations and calculate your borrowing capacity.
          </Typography>
        </FullCard>
        <ComingSoonContainer>
          <Typography variant="h6" gutterBottom>
            Coming Soon: Loan Calculator Tools
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Loan comparison, repayment calculators, and stress testing scenarios.
          </Typography>
        </ComingSoonContainer>
      </LoanSection>

      {/* SettlySuper Section */}
      <FeatureSection id="super-section">
        <FullCard>
          <TrendingUpIcon style={{ fontSize: 40, marginBottom: 16 }} />
          <Typography variant="h3" style={{ fontWeight: 400, textAlign: 'center', marginBottom: 16 }}>
            SettlySuper
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 200, textAlign: 'left' }}>
            Maximize your superannuation potential with smart property investment strategies.
          </Typography>
        </FullCard>
        <ComingSoonContainer>
          <Typography variant="h6" gutterBottom>
            Coming Soon: Super Optimization Tools
          </Typography>
          <Typography variant="body1" color="text.secondary">
            SMSF property investment strategies and retirement planning tools.
          </Typography>
        </ComingSoonContainer>
      </FeatureSection>
    </>
  );
};

export default FeatureDetailSections;
