import { Box, Button, Typography, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '400px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundImage: `
    linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="cityscape" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="%23ffffff" opacity="0.05"/><rect x="2" y="8" width="3" height="12" fill="%23ffffff" opacity="0.1"/><rect x="6" y="5" width="3" height="15" fill="%23ffffff" opacity="0.1"/><rect x="10" y="10" width="3" height="10" fill="%23ffffff" opacity="0.1"/><rect x="14" y="3" width="3" height="17" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23cityscape)"/></svg>')
  `,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  padding: theme.spacing(4),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  border: '1px solid red',
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(8),
  left: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const MainTitle = styled(Typography)(({ theme }) => ({}));

const SubTitle = styled(Typography)(({ theme }) => ({}));

const SearchPlaceholder = styled(Box)(() => ({
  width: '100%',
  maxWidth: '600px',
  height: '60px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  backdropFilter: 'blur(10px)',
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

  const displayTitle =
    suburb && state && postcode
      ? `Welcome to ${suburb}, ${state} ${postcode}`
      : 'Welcome to Suburb Report';

  return (
    <BannerContainer>
      <BackButton startIcon={<ArrowBackIcon />} onClick={handleBack}>
        Back
      </BackButton>

      <ContentContainer>
        <MainTitle variant="h1">{displayTitle}</MainTitle>

        <SubTitle variant="body2">
          Smart data to help you decide — from affordability to growth to
          lifestyle.
        </SubTitle>

        <SearchPlaceholder>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Search section placeholder
          </Typography>
        </SearchPlaceholder>
      </ContentContainer>
    </BannerContainer>
  );
};

export default Banner;
