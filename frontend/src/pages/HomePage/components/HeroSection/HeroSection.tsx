import { Box, Button, Typography, styled, useTheme, type ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBar from '../../../../components/SearchBar/SearchBar';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';

//Styling for container and components
const HeroContainer = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  paddingTop: theme.spacing(25),
  paddingInline: theme.spacing(6),
  [theme.breakpoints.between('sm', 'md')]: { paddingInline: theme.spacing(8) },
  [theme.breakpoints.up('md')]: { paddingInline: 0 },
}));

const BottomContainer = styled(Box)(() => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  maxWidth: '650px',
  textAlign: 'left',
}));

const HighligtedHeader = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ExploreButton = styled(Button)<LinkButtonProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  textTransform: 'none',
}));

//This is for passing the props "to" to the ExploreButton defined above, otherwise Typescript would have error
type LinkButtonProps = ButtonProps & {
  to?: RouterLinkProps['to'];
  component?: React.ElementType;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  //State to track selected suburb for ExploreButton path construction
  const [selectedSuburb, setSelectedSuburb] = useState<SuggestionOutputDto | null>(null);

  //Handle suburb selection from SearchBar - updates state and navigates to report page
  const handleSuburbSelected = (suburbData: SuggestionOutputDto) => {
    setSelectedSuburb(suburbData);
    navigate(`/suburb/${suburbData.suburbId}`);
  };

  //Explore Page is currently a placeholder, the page will be developed in the future
  const explorePagePath = selectedSuburb ? `/explore/${encodeURIComponent(selectedSuburb.name)}` : '/explore';

  return (
    <HeroContainer>
      <Typography variant="h2" maxWidth={{ xs: '100%', md: 770 }} paddingBottom={theme.spacing(10)}>
        Your AI-Powered Guide for <HighligtedHeader>Property, Loan & Super</HighligtedHeader> Planning
      </Typography>

      <Typography
        variant="subtitle1"
        maxWidth={{ xs: '100%', md: 650 }}
        color="text.secondary"
        align="left"
        paddingBottom={theme.spacing(8)}
      >
        No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home
        buyers and everyday Australians.
      </Typography>

      <BottomContainer>
        <SearchBar onSuburbSelected={handleSuburbSelected} />

        <ExploreButton component={RouterLink} to={explorePagePath}>
          Not sure where to begin? Explore suburbs that match your lifestyle
        </ExploreButton>
      </BottomContainer>
    </HeroContainer>
  );
};

export default HeroSection;
