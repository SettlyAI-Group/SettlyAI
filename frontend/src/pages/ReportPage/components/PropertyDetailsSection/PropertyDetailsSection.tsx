import { Box, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { alpha } from '@mui/material/styles';
import GlobalButton from '@/components/GlobalButton';
import type { TransformedPropertyData } from '@/interfaces/property';

/* ==============================
   Layout Containers
============================== */
const MainContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(5, 6, 4, 8),
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.spacing(6),
  alignItems: 'start',
  '& *': {
    fontWeight: theme.typography.fontWeightMedium,
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    padding: theme.spacing(4, 3),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

const AssistanceSectionTitle = styled(SectionTitle)(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  marginBottom: theme.spacing(1.5),
}));

/* ==============================
   Property Details
============================== */
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
  paddingBlock: theme.spacing(1.75),
  '&:last-child': { borderBottom: 'none' },
}));

const DetailText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
}));

/* ==============================
   AI Summary
============================== */
const AISummaryContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  marginTop: theme.spacing(0.5),
  minHeight: theme.spacing(22),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const AISummaryTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(5.5),
}));

const AISummaryText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(5.5),
}));

/* ==============================
   Features
============================== */
const FeaturesContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: 48,
  rowGap: 16,
  marginTop: 60,
}));

const FeatureItem = styled(Box)(() => ({
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

/* ==============================
   Government Assistance Block
============================== */
const GovernmentAssistanceContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(8),
  bottom: theme.spacing(4),
  width: 500,
  height: 'auto',
  minHeight: theme.spacing(24),
  backgroundColor: alpha(theme.palette.secondary.main, 0.45),
  borderRadius: theme.spacing(1.25),
  padding: theme.spacing(3, 10),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    position: 'static',
    width: '100%',
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
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
  lineHeight: 1.3,
}));

/* ==============================
   Savings Display
============================== */
const SavingsText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.success.main,
  marginTop: theme.spacing(1),
}));

const SourceText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p2,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const CheckEligibilityButton = styled(GlobalButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(10),
  bottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  [theme.breakpoints.down('md')]: {
    position: 'static',
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
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

/* ==============================
   Component Definition
============================== */
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
    <OuterContainer>
      <InnerContainer>
        <MainContainer>
        {/* Property Details Column */}
        <DetailsColumn>
          <SectionTitle>Property Details</SectionTitle>
          <DetailsList>
            {propertyDetails.map((d, i) => (
              <DetailItem key={i}>
                <DetailText>{d.label}</DetailText>
                <DetailText>{d.value}</DetailText>
              </DetailItem>
            ))}
          </DetailsList>

          <AISummaryContainer>
            <AISummaryTitle>AI Summary</AISummaryTitle>
            <AISummaryText>{property.summary}</AISummaryText>
          </AISummaryContainer>
        </DetailsColumn>

        {/* Features Column */}
        <Box>
          <SectionTitle 
          sx={{ marginLeft: (t) => t.spacing(8) }}>
            Features
            </SectionTitle>
          <FeaturesContainer sx={{ marginLeft: (t) => t.spacing(8), 
            marginTop: (t) => t.spacing(8) }}>
            {property.features.map((f, i) => (
              <FeatureItem key={i}>
                <FeatureIcon />
                <FeatureText>{f}</FeatureText>
              </FeatureItem>
            ))}
          </FeaturesContainer>
        </Box>

        {/* Government Assistance */}
        <GovernmentAssistanceContainer>
          <AssistanceItem>
            <AssistanceIcon />
            <AssistanceSectionTitle>
              Government Assistance for First-Home Buyers
            </AssistanceSectionTitle>
          </AssistanceItem>

          <AssistanceItem>
            <AssistanceIcon />
            <AssistanceText>First Home Owner Grant</AssistanceText>
          </AssistanceItem>

          <AssistanceItem>
            <AssistanceIcon />
            <AssistanceText>Stamp Duty Concession</AssistanceText>
          </AssistanceItem>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: (t) => t.spacing(1.5),
              marginTop: (t) => t.spacing(1),
            }}
          >
            <AutoAwesomeOutlinedIcon
              sx={{
                fontSize: 16,
                color: (t) => t.palette.secondary.dark,
                flexShrink: 0,
                alignSelf: 'flex-start',
                marginTop: (t) => t.spacing(0.25),
              }}
            />
            <Box>
              <Typography
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightMedium,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                })}
              >
                Estimated saving:
              </Typography>
              <SavingsText>≈$12,750</SavingsText>
              <SourceText>source: VIC</SourceText>
            </Box>
          </Box>

          <CheckEligibilityButton>Check Eligibility</CheckEligibilityButton>
        </GovernmentAssistanceContainer>
        </MainContainer>
      </InnerContainer>
    </OuterContainer>
  );
};

export default PropertyDetailsSection;
