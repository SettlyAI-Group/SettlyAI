import { Box, Button, styled, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchInput from '@/components/SearchInput/SearchInput';
import theme from '@/styles/theme';
import bgImage from '@/assets/images/BannerBg.jpg';

type BannerProps = {
  title?: string;
  description?: string;

};

const BannerContainer = styled(Box)(({ theme }) => {
  const gradientOverlay =
    'linear-gradient(90deg, rgba(79, 70, 229, 0.6) 0%, rgba(111, 66, 193, 0.6) 100%)';
  const composedBackgroundImage = `${gradientOverlay}, url(${bgImage})`;
  return {
    backgroundColor: theme.palette.primary.light,
    width: '100vw',
    minHeight: 400,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundImage: composedBackgroundImage,
    backgroundSize: 'cover, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center',
    marginBottom: theme.spacing(10),
    marginLeft: 'calc(-50vw + 50%)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(2),
      padding: `${theme.spacing(6)} ${theme.spacing(6)}`,
    },
  };
});

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  alignItems: 'flex-start',
  color: theme.palette.text.primary,
  maxWidth: 120,
  maxHeight: 40,
  textTransform: 'capitalize',
  margin: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
    margin: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const BackButtonWrapper = styled(Box)(() => ({
  width: '15%',
  display: 'flex',
  alignItems: 'flex-start',
}));

const ContentWrapper = styled(Box)<{ withBackButton?: boolean }>(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginTop: theme.spacing(16),
    marginLeft: theme.spacing(2),
    paddingRight: '10%',
    gap: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2),
      justifyContent: 'center',
    },
  })
);

const Banner = ({ title, description }: BannerProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const placeholder =
    'Paste your property address or suburb to get insights...';
  
  const handleBack = () => {
    window.history.back();
  };

  return (
    <BannerContainer>
      <BackButtonWrapper>
        <BackButton 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          {!isMobile && 'Back'}
        </BackButton>
      </BackButtonWrapper>

      <ContentWrapper>
        {title && (
          <Typography variant="h2" color="white" fontWeight="bold">
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="subtitle1" color="white">
            {description}
          </Typography>
        )}
        <SearchInput
          placeholder={placeholder}
          onSearch={(searchText: string) => {
            console.log('Searching for:', searchText);
            // TODO: Add search logic here
          }}
        />
      </ContentWrapper>
    </BannerContainer>
  );
};

export default Banner;
