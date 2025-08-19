import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { styled } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Hero container
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '548px',
  background: '#F8F9FB',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  maxWidth: '1440px',
  margin: '0 auto',
}));

// H1
const MainHeading = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,       
  fontSize: '32px',     
  textAlign: 'center',
  color: '#1F2937',
  maxWidth: '768px',
  maxHeight:'180px',
  margin: '0 auto',
  marginBottom: theme.spacing(14),
  letterSpacing: '-0.01em',
  [theme.breakpoints.up('sm')]: {
    fontSize: '40px',
    lineHeight: '50px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '48px',
    lineHeight: '60px',
  },
}));

const HighlightSpan = styled(Box)(() => ({
  color: '#6366f1',
}));

// Subheading
const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '28px',
  color: '#4B5563',
  width: '653px',
  height: '84px',
  marginBottom: theme.spacing(4),
  textAlign: 'left',
}));

// Search row
const SearchContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '653px',
  height: '59px',
  marginBottom: 16,
}));


const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 56,
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: { width: '720px' },
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: '#9CA3AF',
  marginRight: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiInput-root': {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '22px',
    color: '#6B7280',
  },
}));

// Primary CTA
const GetReportButton = styled(Button)(({ theme }) => ({
  width: '206px',
  height: '60px',
  background: '#7B61FF',
  boxShadow:
    '0px 0px 2px rgba(23, 26, 31, 0.12), 0px 4px 9px rgba(23, 26, 31, 0.11)',
  borderRadius: '12px',
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#FFFFFF',
  textTransform: 'none',
  '&:hover': { background: '#6B51E8' },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '30px',
  marginTop: theme.spacing(2),
  width: '653px',
  height: '60px',
}));


const ChatLink = styled('a')(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4F46E5',
  textDecoration: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const ExploreSuburbButton = styled(Button)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '213px',
  height: '60px',
  minWidth: '213px',
  minHeight: '60px',
  background: '#E0E7FF',
  boxShadow: '0px 0px 2px rgba(23, 26, 31, 0.12), 0px 8px 17px rgba(23, 26, 31, 0.15)',
  borderRadius: '8px',
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4F46E5',
  textTransform: 'none',
  border: 'none',
  padding: 0,
  '&.MuiButton-root': {
    width: '213px',
    height: '60px',
    minWidth: '213px',
    minHeight: '60px',
    padding: 0,
  },
}));

const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <MainHeading component="h1">
        Your AI-Powered Guide for<br />
        <HighlightSpan component="span">Property, Loan & Super</HighlightSpan>{' '}
        Planning
      </MainHeading>

<Subtitle>
  No jargon, just clarity. Plan your future with confidence using smart
  reports and tools built for first-home buyers and everyday Australians.
</Subtitle>

      <SearchContainer>
        <InputContainer>
          <StyledSearchIcon />
          <StyledTextField
            fullWidth
            placeholder="Paste your property address or suburb to get insights..."
            InputProps={{ disableUnderline: true }}
            variant="standard"
          />
        </InputContainer>

        <GetReportButton variant="contained" onClick={() => { }}>
          Get My Report
        </GetReportButton>
      </SearchContainer>

      <ActionButtonsContainer>
        <ExploreSuburbButton>Explore Suburb</ExploreSuburbButton>
        <ChatLink href="#">
          Not sure where to begin? Chat with Settly Robot
        </ChatLink>
      </ActionButtonsContainer>

    </HeroContainer>
  );
};

export default HeroSection;
