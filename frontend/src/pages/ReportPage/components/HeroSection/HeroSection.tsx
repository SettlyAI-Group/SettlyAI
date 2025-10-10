import { Box, Typography, Chip, styled, useTheme } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GlobalButton from '@/components/GlobalButton';
import type { TransformedPropertyData } from '@/interfaces/property';

const HeroContainer = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 'min(1120px, 100%)', // keeps 1120px cap but flexible
  height: 'clamp(280px, 40vw, 450px)', // responsive height
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  marginInline: 'auto',
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
  position: 'absolute',
  top: theme.spacing(50),
  left: theme.spacing(12),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
  minHeight: theme.spacing(8),
  maxWidth: 'fit-content', 
  '& .MuiChip-label': {
    paddingInline: theme.spacing(3),
  },
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(3.5),
    left: theme.spacing(2),
  },
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

const TextGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(15), // lifts the two text lines upward
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


interface HeroSectionProps {
  property: TransformedPropertyData;
}

const HeroSection = ({ property }: HeroSectionProps) => {
  const theme = useTheme();

  const handleSaveToFavorites = () => {
    console.log('Save to favorites clicked for property:', property.id);
  };

  return (
    <HeroContainer>
      {property.hasImage ? (
        <HeroImage src={property.imageUrl} alt={property.address} />
      ) : (
        <ImagePlaceholder>
          <Typography variant="h6">Image coming soon</Typography>
        </ImagePlaceholder>
      )}

      <GradientOverlay />

      <PropertyTypeChip label={property.propertyType} />

      <OverlayContent>
  <TextGroup>
    <AddressText variant="h4">{property.address}</AddressText>
    <PriceText variant="h3">{property.formattedPrice}</PriceText>
  </TextGroup>

  <SaveButton
    variant="contained"
    startIcon={<FavoriteBorderIcon />}
    onClick={handleSaveToFavorites}
  >
    Save to Favourites
  </SaveButton>
</OverlayContent>

    </HeroContainer>
  );
};

export default HeroSection;
