import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { 
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as StockIcon
} from '@mui/icons-material';
import Card from '../Card';

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

const FeatureDetailSections: React.FC = () => {
  return (
    <>
      {/* SettlyHome Section */}
      <FeatureSection id="home-section">
        <Card
          title="SettlyHome"
          description="Discover your perfect home with smart property insights and market analysis. Explore smart suburb picks and lifestyle-friendly neighbourhoods."
          icon={<HomeIcon />}
          ctaText="Explore Suburb & Homes  →"
          variant="full"
        />
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
        <Card
          title="SettlyLoan"
          description="Get personalized loan recommendations and calculate your borrowing capacity. Compare fixed vs variable, estimate repayments, and test loan stress scenarios."
          icon={<AttachMoneyIcon />}
          ctaText="Simulate Loan  →"
          variant="full"
        />
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
        <Card
          title="SettlySuper"
          description="Optimize your superannuation strategy for property investment and retirement. Maximize your superannuation potential with smart property investment strategies."
          icon={<StockIcon />}
          ctaText="Optimize Super  →"
          variant="full"
        />
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