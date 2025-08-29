import { Container, Box, Button, Typography, styled, useTheme, Stack, type ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBar from '../../../../components/Search/SearchBar';
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
  '& .searchRow': {
    position: 'relative',
    alignItems: 'stretch',
    gap: theme.spacing(4),
    width: '100%',
    maxWidth: 650,
    marginInline: 'auto',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(6),
    },
  },
}));

const HighligtedHeader = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ExploreButtonContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  width: '100%',
  marginInline: 'auto',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  maxWidth: 660,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
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

  //Explore Page is currently a placeholder, the page will be developed in the future
  const explorePagePath = selected ? `/explore/${encodeURIComponent(selected.name)}` : '/explore';

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

      <Stack className="searchRow">
        <SearchBar selected={selected} handleSelected={setSelected} handleGetReport={handleGetReport} />
      </Stack>

      <ExploreButtonContainer>
        <ExploreButton component={RouterLink} to={explorePagePath}>
          Not sure where to begin? Explore suburbs that match your lifestyle
        </ExploreButton>
      </ExploreButtonContainer>
    </HeroContainer>
  );
};

export default HeroSection;
