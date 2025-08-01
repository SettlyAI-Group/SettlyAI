import { Box, Button, styled, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchInput from '../TextField/SearchInput';
import theme from '@/styles/theme';

type BannerProps = {
  title?: string;
  description?: string;
  backgroundImage?: string;
  withBackButton?: boolean;
  withSearchSection?: boolean;
  searchPlaceholder: string;
  children?: React.ReactNode;
};

const BannerRoot = styled(Box)<{ backgroundImage?: string }>(
  ({ theme, backgroundImage }) => ({
    backgroundColor: theme.palette.primary.light,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  })
);

const BannerOverlay = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  background:
    'linear-gradient(90deg, rgba(79, 70, 229, 0.6) 0%, rgba(111, 66, 193, 0.6) 100%)',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const BackButtonContainer = styled(Box)(() => ({
  display: 'flex',
  width: '15%',
  maxHeight: 40,
}));

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  alignItems: 'flex-start',
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 2),
  minWidth: 'auto',
  textTransform: 'capitalize',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    minWidth: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ContentWrapper = styled(Box, {
  shouldForwardProp: prop => prop !== 'withBackButton',
})<{ withBackButton?: boolean }>(({ theme, withBackButton }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(10),
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
  width: withBackButton ? '85%' : '100%',
  // Always full width on mobile
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));
const BannerSearchSection = styled(Box)(({ theme }) => ({
  color: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  width: '90%',
  alignItems: 'center',
  textTransform: 'capitalize',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
  },
}));

const BannerSearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4F46E5',
  color: 'white',
  display: 'flex',
  borderRadius: '6px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  textTransform: 'capitalize',
}));

function Banner({
  title,
  description,
  backgroundImage,
  withBackButton = true,
  withSearchSection = true,
  searchPlaceholder,
  children,
}: BannerProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <BannerRoot backgroundImage={backgroundImage}>
      <BannerOverlay>
        {withBackButton && (
          <BackButtonContainer>
            <BackButton variant="contained" startIcon={<ArrowBackIcon />}>
              {!isMobile && 'Back'}
            </BackButton>
          </BackButtonContainer>
        )}
        <ContentWrapper withBackButton={withBackButton}>
          {title && (
            <Typography variant="h4" color="white" fontWeight="bold">
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="subtitle2" color="white">
              {description}
            </Typography>
          )}
          {withSearchSection && (
            <BannerSearchSection>
              <SearchInput placeholder={searchPlaceholder} />
              <BannerSearchButton>Search</BannerSearchButton>
            </BannerSearchSection>
          )}
        </ContentWrapper>

        {children}
      </BannerOverlay>
    </BannerRoot>
  );
}

export default Banner;
