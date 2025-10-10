import { Box, Typography, Chip, styled } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GlobalButton from '@/components/GlobalButton';
import type { TransformedPropertyData } from '@/interfaces/property';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 'clamp(280px, 40vw, 450px)',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: 'clamp(220px, 45vw, 300px)',
  },
}));


const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
}));

const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to top, ${theme.palette.common.black} 0%, transparent 60%)`,
}));

const PropertyTypeChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
  minHeight: theme.spacing(8),
  maxWidth: 'fit-content',
  marginBottom: theme.spacing(2),
  '& .MuiChip-label': {
    paddingInline: theme.spacing(3),
  },
  borderRadius: theme.spacing(2),
}));


const OverlayContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(5),
  left: theme.spacing(12),
  right: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  color: theme.palette.common.white,
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(3),
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
}));



const AddressText = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.h5.fontWeight,
  fontSize: `calc(${theme.typography.h4.fontSize} * 1.4)`,
  lineHeight: theme.typography.h4.lineHeight,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.h5.fontSize,
    lineHeight: theme.typography.h5.lineHeight,
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.h5.fontWeight,
  fontSize: theme.typography.h3.fontSize,
  lineHeight: theme.typography.h3.lineHeight,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.lineHeight,
  },
}));

const SaveButton = styled(GlobalButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  fontSize: `calc(${theme.typography.body1.fontSize} * 0.9)`, 
  fontWeight: theme.typography.fontWeightRegular, 
  textTransform: 'none', 
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const OuterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3, 16),
}));

const InnerContainer = styled(Box)(() => ({
  maxWidth: 1280,
  width: '100%',
}));


interface HeroSectionProps {
  property: TransformedPropertyData;
}

const HeroSection = ({ property }: HeroSectionProps) => {
  const handleSaveToFavorites = () => {
    console.log('Save to favorites clicked for property:', property.id);
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <HeroContainer>
          {property.hasImage ? (
            <HeroImage src={property.imageUrl} alt={property.address} />
          ) : (
            <ImagePlaceholder>
              <Typography variant="h6">Image coming soon</Typography>
            </ImagePlaceholder>
          )}

          <GradientOverlay />

          <OverlayContent>
  <PropertyTypeChip label={property.propertyType} />
  <AddressText variant="h4">{property.address}</AddressText>
  <PriceText variant="h3">{property.formattedPrice}</PriceText>
  <SaveButton
    variant="contained"
    startIcon={<FavoriteBorderIcon />}
    onClick={handleSaveToFavorites}
  >
    Save to Favourites
  </SaveButton>
</OverlayContent>
        </HeroContainer>
      </InnerContainer>
    </OuterContainer>
  );
};

export default HeroSection;
