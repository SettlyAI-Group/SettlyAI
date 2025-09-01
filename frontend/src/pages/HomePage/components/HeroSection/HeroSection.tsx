import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  type TypographyProps
} from '@mui/material';
import { styled } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Hero container
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '548px',
  background: theme.palette.background.default,
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
const MainHeading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '32px',
  textAlign: 'center',
  color: theme.palette.text.primary,
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

const HighlightSpan = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "inline",
  fontFamily: 'Poppins',
  fontWeight: 400,
  fontSize: '32px',
  letterSpacing: '-0.01em',
  [theme.breakpoints.up('sm')]: {
    fontSize: '40px',
    lineHeight: '50px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '48px',
    lineHeight: '60px',
  },
})) as typeof Typography;


// Subheading
const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '28px',
  color: theme.palette.text.secondary,
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
  width: '653px', 
  height: 60, 
  background: theme.palette.background.paper, 
  border: `1px solid ${theme.palette.divider}`, 
  borderRadius: 8, 
  padding: theme.spacing(0, 2),
}));

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: theme.palette.text.disabled,
  marginRight: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '22px',
    color: theme.palette.text.secondary,
  },
}));

// Primary CTA
const GetReportButton = styled(Button)(({ theme }) => ({
  width: '206px',
  height: '60px',
  background: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
  borderRadius: '12px',
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: theme.palette.primary.contrastText,
  textTransform: 'none',
  '&:hover': {
    background: theme.palette.primary.dark,
    boxShadow: theme.shadows[8]
  },
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  width: '653px',
  height: '52px',
}));

const ChatLink = styled('a')(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '26px',
  color: theme.palette.primary.main, // '#4F46E5'
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  width: '581px',
  height: '52px',
  '&:hover': {
    textDecoration: 'underline',
  },
}));


// Component without React.FC
const HeroSection = () => {
  return (
    <HeroContainer>
      <MainHeading component="h1">
        Your AI-Powered Guide for <br />
        <HighlightSpan component="span">
          Property, Loan & Super
        </HighlightSpan>{" "}
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
        <ChatLink href="#">
          Not sure where to begin? Chat with Settly Robot
        </ChatLink>
      </ActionButtonsContainer>
    </HeroContainer>
  );
};

export default HeroSection;
