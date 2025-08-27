import { Container, Box, Button, Typography, styled, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { useEffect, useRef, useState } from 'react';
import { fetchSuggestion } from '../../../../store/slices/searchSuggestSlice';
import SearchBar from '../../../../components/Search/SearchBar';

const HeroContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(25),
  paddingInline: theme.spacing(6),
  [theme.breakpoints.between('sm', 'md')]: {
    paddingInline: theme.spacing(8),
  },
  [theme.breakpoints.up('md')]: {
    paddingInline: theme.spacing(0),
  },
}));

const MainHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  ...theme.typography.h2,
}));

const Accent = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  textTransform: 'none',
}));

const HeroSectionContainer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // const dispatch = useAppDispatch();
  // const { query } = useAppSelector(selector => selector.explore);
  // const lastReqRef = useRef<any>(null);

  // useEffect(() => {
  //   const timeInterval = setTimeout(() => {
  //     const trimmedQuery = query.trim();

  //     if (trimmedQuery.length < 3) {
  //       lastReqRef.current?.abort?.();
  //       return;
  //     }

  //     lastReqRef.current?.abort?.();
  //     const p = dispatch(fetchSuggestion(trimmedQuery));
  //     lastReqRef.current = p;
  //   }, 300);

  //   return () => {
  //     clearTimeout(timeInterval);
  //     lastReqRef.current?.abort?.();
  //   };
  // }, [query, dispatch]);

  return (
    <Box
      sx={theme => ({
        width: '100%',
        backgroundColor: theme.palette.background.default,
      })}
    >
      <HeroContainer>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: 770 },
            mx: 'auto',
            pb: theme.spacing(10),
          }}
        >
          <MainHeader>
            Your AI-Powered Guide for <Accent>Property, Loan & Super</Accent> Planning
          </MainHeader>
        </Box>

        <Box
          sx={{
            maxWidth: { xs: '100%', md: 650 },
            mx: 'auto',
          }}
        >
          <Typography
            sx={theme => ({
              ...theme.typography.subtitle1,
              color: theme.palette.text.secondary,
            })}
          >
            No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home
            buyers and everyday Australians.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: theme.spacing(6) }}>
          <Box
            sx={theme => ({
              position: 'relative',
              width: { xs: '100%', md: 650 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: { xs: 4, md: 6 },
              overflow: 'visible',
              '& .MuiInputBase-input::placeholder': {
                ...theme.typography.p1,
              },
            })}
          >
            <SearchBar />
          </Box>
        </Box>

        <Box
          sx={theme => ({
            width: {
              xs: '100%',
              md: 660,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'stretch',
            },
            mx: 'auto',
            pt: { xs: 4, md: 4 },
            pb: 8,
          })}
        >
          <ExploreButton variant="text" onClick={() => navigate('/explore/:location')}>
            Not sure where to begin? Explore suburbs that match your lifestyle
          </ExploreButton>
        </Box>
      </HeroContainer>
    </Box>
  );
};

export default HeroSectionContainer;
