import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { Link, styled } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Hero container
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '548px',
  background: '#F8F9FB',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4, 2),
  maxWidth: '960px',
  margin: '0 auto',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4, 4) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(8, 4) },
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
  fontSize: '19px',
  lineHeight: 1.5,
  textAlign: 'left',
  color: '#6B7280',
  maxWidth: '700px',
  marginBottom: theme.spacing(7),
}));

// Search row
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: '100%',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
    maxWidth: '800px',
  },
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
  width: '100%',
  height: 56,
  background: '#7B61FF',
  boxShadow:
    '0px 0px 2px rgba(23, 26, 31, 0.12), 0px 4px 9px rgba(23, 26, 31, 0.11)',
  borderRadius: 12,
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#FFFFFF',
  textTransform: 'none',
  '&:hover': { background: '#6B51E8' },
  [theme.breakpoints.up('sm')]: { width: '206px' },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',   
  gap: theme.spacing(15),          
  marginTop: theme.spacing(4),
  width: '100%',
  maxWidth: '750px',              
  marginLeft: 'auto',
  marginRight: 'auto',
}));


const ChatLink = styled('a')(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '26px',
  color: '#4F46E5',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const ExploreSuburbButton = styled(Button)(({ theme }) => ({
  height: 44,
  background: '#E0E7FF',
  boxShadow:
    '0px 0px 2px rgba(23, 26, 31, 0.12), 0px 8px 17px rgba(23, 26, 31, 0.15)',
  borderRadius: 12,
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4F46E5',
  textTransform: 'none',
  border: 'none',
  px: 7,
    padding: theme.spacing(4, 7),
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
