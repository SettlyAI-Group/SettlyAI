import { Box, Typography, styled, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import type { TransformedPropertyData } from '@/interfaces/property';

const MainContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    maxWidth: 1120,
    height: 482,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    marginInline: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(5, 4, 4, 4),
    overflow: 'hidden',
  }));
  

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

const DetailsColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const DetailsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBlock: theme.spacing(0.75),
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
}));

const AISummaryContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  marginTop: theme.spacing(0.5),
}));

const AISummaryTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const AISummaryText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.disabled,
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: theme.spacing(6),
  rowGap: theme.spacing(1),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const FeatureIcon = styled(CheckIcon)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: 16,
  marginRight: theme.spacing(1),
}));

const FeatureText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
}));

const GovernmentAssistanceContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(4),
    bottom: theme.spacing(30),
    width: 520,
    height: 170,
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.spacing(1.25),
    padding: theme.spacing(3),
  }));

const AssistanceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const AssistanceIcon = styled(CheckIcon)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: 16,
  marginRight: theme.spacing(1),
}));

const AssistanceText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
}));

const SavingsText = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  color: theme.palette.success.main,
  marginTop: theme.spacing(1),
}));

const SourceText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p2,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const CheckEligibilityButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  bottom: theme.spacing(3),
  width: 180,
  height: 40,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(0.75),
  color: theme.palette.text.primary,
  ...theme.typography.p1,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

interface PropertyDetailsSectionProps {
  property: TransformedPropertyData;
}

const PropertyDetailsSection = ({ property }: PropertyDetailsSectionProps) => {
  const propertyDetails = [
    { label: 'Bedrooms', value: property.bedrooms },
    { label: 'Bathrooms', value: property.bathrooms },
    { label: 'Car Spaces', value: property.carSpaces },
    { label: 'Internal Area', value: property.formattedInternalArea },
    { label: 'Land Size', value: property.formattedLandSize },
    { label: 'Year Built', value: property.yearBuilt },
  ];

  return (
    <MainContainer>
      <DetailsColumn>
        <SectionTitle>Property Details</SectionTitle>

        <DetailsList>
          {propertyDetails.map((detail, index) => (
            <DetailItem key={index}>
              <DetailLabel>{detail.label}</DetailLabel>
              <DetailValue>{detail.value}</DetailValue>
            </DetailItem>
          ))}
        </DetailsList>

        <AISummaryContainer>
          <AISummaryTitle>AI Summary</AISummaryTitle>
          <AISummaryText>{property.summary}</AISummaryText>
        </AISummaryContainer>
      </DetailsColumn>

      <Box sx={{ marginLeft: (theme) => theme.spacing(6) }}>
  <SectionTitle>Features</SectionTitle>
  <FeaturesContainer>
    {property.features.map((feature, index) => (
      <FeatureItem key={index}>
        <FeatureIcon />
        <FeatureText>{feature}</FeatureText>
      </FeatureItem>
    ))}
  </FeaturesContainer>
</Box>

      <GovernmentAssistanceContainer>
        <SectionTitle>Government Assistance for First-Home Buyers</SectionTitle>

        <AssistanceItem>
          <AssistanceIcon />
          <AssistanceText>First Home Owner Grant</AssistanceText>
        </AssistanceItem>

        <AssistanceItem>
          <AssistanceIcon />
          <AssistanceText>Stamp Duty Concession</AssistanceText>
        </AssistanceItem>

        <Typography
          sx={{
            marginTop: 1,
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Estimated saving:
        </Typography>
        <SavingsText>≈$12,750</SavingsText>
        <SourceText>source: VIC</SourceText>

        <CheckEligibilityButton>Check Eligibility</CheckEligibilityButton>
      </GovernmentAssistanceContainer>
    </MainContainer>
  );
};

export default PropertyDetailsSection;
