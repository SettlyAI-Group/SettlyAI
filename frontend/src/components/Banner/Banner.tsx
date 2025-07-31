import { Box, Button, Input, styled, Typography } from '@mui/material';
import bgImage from '@/assets/images/BannerBg.jpg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchInput from '../TextFiled/SearchInput';
type BannerProps = {
  title?: string;
  description?: string;
  children?: string;
};

const BannerRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  width: '100%',
  height: '100%',
  display: 'flex',
  // flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));

const BannerOverly = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  // flexDirection: 'row',
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
  maxHeight: '40px',
}));

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  alignItems: 'flex-start',
  color: '#374151',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '85%',
  marginBottom: theme.spacing(10),
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
}));
const BannerSearchSection = styled(Box)(({ theme }) => ({
  color: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  width: '90%',
  alignItems: 'center',
  justifyContent: 'center',

}));

const BannerSearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4F46E5',
  color: 'white',
  display: 'flex',
  borderRadius: '6px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

function Banner({ title, description, children }: BannerProps) {
  return (
    <BannerRoot>
      <BannerOverly>
        <BackButtonContainer>
          <BackButton variant="contained" startIcon={<ArrowBackIcon />}>
            Back
          </BackButton>
        </BackButtonContainer>
        <ContentWrapper>
          <Typography variant="h4" color="white" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="white">
            {description}
          </Typography>
          <BannerSearchSection>
            {/* <Search/InputWrapper> */}
              <SearchInput placeholder="Paste your property address or suburb to get insights..." />
            {/* </SearchInputWrapper> */}

            <BannerSearchButton>Search</BannerSearchButton>
          </BannerSearchSection>
        </ContentWrapper>
      </BannerOverly>
      {children}
    </BannerRoot>
  );
}

export default Banner;
