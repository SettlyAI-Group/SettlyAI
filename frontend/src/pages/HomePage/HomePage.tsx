import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  styled
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { setSuburbId } from '@/store/slices/suburbSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FeatureCardsSection from './components/FeatureCardsSection';
import Card from './components/Card';
import { 
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';

// Styled Components - Theme-aware approach
const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '548px',
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4, 2),
  width: '100%',
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4, 4),
  },
  
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 4),
  },
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.primary,
  maxWidth: '768px',
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.up('sm')]: {
    fontSize: '40px',
    lineHeight: '50px',
  },
  
  [theme.breakpoints.up('md')]: {
    fontSize: '48px',
    lineHeight: '60px',
  },
}));

const HighlightSpan = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxWidth: '653px',
  marginBottom: theme.spacing(5),
  
  [theme.breakpoints.up('md')]: {
    fontSize: '18px',
    lineHeight: '28px',
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '100%',
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
    maxWidth: '900px',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '59px',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0, 2),
  
  [theme.breakpoints.up('sm')]: {
    width: '653px',
  },
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: theme.palette.text.disabled,
  marginRight: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    fontSize: '14px',
    lineHeight: '22px',
    color: theme.palette.text.secondary,
  },
}));

const GetReportButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '60px',
  background: theme.palette.primary.main,
  boxShadow: theme.shadows[2],
  borderRadius: theme.spacing(1),
  fontSize: '18px',
  lineHeight: '28px',
  color: theme.palette.primary.contrastText,
  textTransform: 'none',
  
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  
  [theme.breakpoints.up('sm')]: {
    width: '206px',
  },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '800px',
  
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(4),
  },
}));

const ExploreSuburbButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '60px',
  background: theme.palette.action.hover,
  boxShadow: theme.shadows[4],
  borderRadius: theme.spacing(1),
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '28px',
  color: theme.palette.primary.main,
  textTransform: 'none',
  border: 'none',
  
  '&:hover': {
    background: theme.palette.action.selected,
  },
  
  [theme.breakpoints.up('sm')]: {
    width: '213px',
  },
}));

const ChatButton = styled(Button)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '26px',
  color: theme.palette.primary.main,
  textTransform: 'none',
  textAlign: 'center',
  
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
  
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
  },
}));

const ToolsSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '576px',
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 4),
  },
}));

const ToolsTextContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  maxWidth: '800px',
}));

const ToolsHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const ToolsSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  fontWeight: 400,
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: 1.6,
}));

const FeatureSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(8, 2),
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
  },
}));

const LoanSection = styled(FeatureSection)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
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

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');

    interface ISuburb {
        suburbName: string;
        state: string;
        suburbId: number;
    }
    
    // Keep existing suburb logic for backwards compatibility
    const melbourne = { suburbName: 'Melbourn', state: 'VIC', suburbId: 1 };
    const sydney = { suburbName: 'Sydney', state: 'NSW', suburbId: 2 };

  const checkSuburb = (suburb: Suburb) => {
    const { suburbId } = suburb;

    localStorage.setItem('suburbId', suburbId.toString());

    navigate(`/suburb/1`);
  };

    return (
        <PageContainer>
            {/* Hero Section - Refactored with Flexbox for Responsive Centering */}
            <HeroSection>
                {/* Main Heading - Centered with Flexbox */}
                <MainHeading variant="h2">
                    Your AI-Powered Guide for<br />
                    <HighlightSpan component="span">
                        Property, Loan & Super
                    </HighlightSpan> Planning
                </MainHeading>

                {/* Subtitle - Centered with Flexbox */}
                <Subtitle variant="body1">
                    No jargon, just clarity. Plan your future with confidence using smart 
                    reports and tools built for first-home buyers and everyday Australians.
                </Subtitle>

                {/* Search Container - Flexbox Layout for Input + Button */}
                <SearchContainer>
                    {/* Input Container */}
                    <InputContainer>
                        <StyledSearchIcon />
                        
                        <StyledTextField
                            fullWidth
                            placeholder="Paste your property address or suburb to get insights..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                disableUnderline: true
                            }}
                            variant="standard"
                        />
                    </InputContainer>

                    {/* eport Button */}
                    <GetReportButton
                        variant="contained"
                        onClick={handleSearch}
                    >
                        Get My Report
                    </GetReportButton>
                </SearchContainer>

                {/* Action Buttons - Centered with Flexbox */}
                <ActionButtonsContainer>
                    {/* Explore Suburb Button */}
                    <ExploreSuburbButton variant="outlined">
                        Explore Suburb
                    </ExploreSuburbButton>

                    {/* Chat with Settly Robot Text */}
                    <ChatButton variant="text">
                        Not sure where to begin? Chat with Settly Robot
                    </ChatButton>
                </ActionButtonsContainer>
            </HeroSection>

            {/* All-in-One Tools Section - Updated to modern container specs */}
            <ToolsSection>
                <ToolsTextContainer>
                    <ToolsHeading 
                        variant="h4"
                    >
                        All-in-One Tools to Simplify Your Journey
                    </ToolsHeading>
                    <ToolsSubtitle variant="body1">
                        Let's plan smarter: from viewing a home to securing a loan and optimizing your super
                    </ToolsSubtitle>
                </ToolsTextContainer>
                
                {/* Feature Cards Section */}
                <FeatureCardsSection />
            </ToolsSection>

            {/* SettlyHome Section */}
            <FeatureSection id="home-section">
                <Card
                    title="SettlyHome"
                    description="Discover your perfect home with smart property insights and market analysis. Explore smart suburb picks and lifestyle-friendly neighbourhoods."
                    icon={<HomeIcon />}
                    ctaText="Explore Suburb & Homes 🏠"
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
                    ctaText="Calculate Loan 💰"
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
                    icon={<SavingsIcon />}
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
        </PageContainer>
    );
};

export default HomePage;