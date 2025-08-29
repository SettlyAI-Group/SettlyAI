import { Container, Box, Button, Typography, styled, useTheme, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBar from '../../../../components/Search/SearchBar';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';

//Styling for container and components
const HeroContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(25),
  paddingInline: theme.spacing(6),
  textAlign: 'center',
  [theme.breakpoints.between('sm', 'md')]: {
    paddingInline: theme.spacing(8),
  },
  [theme.breakpoints.up('md')]: {
    paddingInline: theme.spacing(0),
  },
}));

const HighligtedHeader = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  textTransform: 'none',
}));

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  //State passed to sub-component Searchbar for receiving the user's selected option data from the suggestion list(Backend SearchSuggest Api)
  const [selected, setSelected] = useState<SuggestionOutputDto | null>(null);

  const handleSelected = () => {
    setSelected(selected);
  };

  //Handle function passing suburbId data (received from the above state "selected", from the Backend SearchSuggest Api) as parameter for navigating to Suburb Report page
  const handleGetReport = () => {
    if (!selected) return;
    navigate(`/suburb/${selected.suburbId}`);
  };

  const handleExplore = () => {
    if (!selected) return;
    const encoded = encodeURIComponent(`${selected.name}`);
    navigate(`/explore/${encoded}`);
  };

  return (
    <HeroContainer>
      <Typography
        variant="h2"
        align="center"
        mx="auto"
        maxWidth={{ xs: '100%', md: 770 }}
        paddingBottom={theme.spacing(10)}
      >
        Your AI-Powered Guide for <HighligtedHeader>Property, Loan & Super</HighligtedHeader> Planning
      </Typography>

      <Typography
        variant="subtitle1"
        color="textSecondary"
        mx="auto"
        maxWidth={{ xs: '100%', md: 650 }}
        paddingBottom={theme.spacing(8)}
      >
        No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home
        buyers and everyday Australians.
      </Typography>

      <SearchBarContainer>
        <Stack
          position="relative"
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          gap={{ xs: 4, md: 6 }}
          width={{ xs: '100%', md: 650 }}
          sx={{ overflow: 'visible' }}
        >
          <SearchBar selected={selected} handleSelected={setSelected} handleGetReport={handleGetReport} />
        </Stack>
      </SearchBarContainer>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        width={{ xs: '100%', md: 660 }}
        mx="auto"
        pt={{ xs: 4, md: 4 }}
        pb={8}
      >
        <ExploreButton onClick={handleExplore}>
          Not sure where to begin? Explore suburbs that match your lifestyle
        </ExploreButton>
      </Stack>
    </HeroContainer>
  );
};

export default HeroSection;
