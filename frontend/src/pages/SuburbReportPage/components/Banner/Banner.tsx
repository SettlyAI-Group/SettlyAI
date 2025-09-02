import { Box, Typography, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import GlobalButton from '@/components/GlobalButton';
import street from './assets/street.jpg';
import SearchBar from '@/components/SearchBar';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundImage: ` linear-gradient(to right,${theme.palette.primary.light}, ${theme.palette.primary.light}), url(${street})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  padding: theme.spacing(6),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

const BackButton = styled(GlobalButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(8),
  left: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: theme.typography.h3.lineHeight,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.lineHeight,
  },
}));

// Responsive subtitle
const Subtitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.p1,
  },
}));

interface BannerProps {
  suburb?: string;
  state?: string;
  postcode?: string;
}

const Banner = ({ suburb, state, postcode }: BannerProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  //Handle suburb selection from SearchBar - navigate to new suburb report
  const handleSuburbSelected = (suburbData: SuggestionOutputDto) => {
    navigate(`/suburb/${suburbData.suburbId}`);
  };

  const displayTitle =
    suburb && state && postcode ? `Welcome to ${suburb}, ${state} ${postcode}` : 'Welcome to Suburb Report';

  return (
    <BannerContainer>
      <BackButton variant="contained" width="100" startIcon={<ArrowBackIcon />} onClick={handleBack} color="white">
        Back
      </BackButton>
      <ContentContainer>
        <MainTitle variant="h1">{displayTitle}</MainTitle>
        <Subtitle variant="body2">Smart data to help you decide — from affordability to growth to lifestyle.</Subtitle>
        <SearchBar onSuburbSelected={handleSuburbSelected} breakpoint={1350} />
      </ContentContainer>
    </BannerContainer>
  );
};

export default Banner;
