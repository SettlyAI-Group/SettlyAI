import { Box, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { alpha } from '@mui/material/styles';
import GlobalButton from '@/components/GlobalButton';
import type { TransformedPropertyData } from '@/interfaces/property';

/* ==============================
   Layout Containers
============================== */
const OuterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3, 16),
}));

const InnerContainer = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 1120,   
  },
}));


const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.spacing(10),
  padding: theme.spacing(5, 8, 4, 8),
  alignItems: 'stretch',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    padding: theme.spacing(4, 3),
  },
}));

const ContentLimiter = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 760,
  },
}));

/* ==============================
   Typography
============================== */
const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

const AssistanceSectionTitle = styled(SectionTitle)(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  marginBottom: theme.spacing(1.5),
}));

const DetailText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
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

const FeatureText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
}));

const AssistanceText = styled(Typography)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
  lineHeight: 1.3,
}));

const EstimatedText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

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

/* ==============================
   Property Details
============================== */
const DetailsColumn = styled(ContentLimiter)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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

/* ==============================
   AI Summary
============================== */

const AISummaryContainer = styled(ContentLimiter)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  minHeight: theme.spacing(22),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

/* ==============================
   Features
============================== */
const RightColumn = styled(ContentLimiter)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: theme.spacing(6),
  rowGap: theme.spacing(2),
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

/* ==============================
   Government Assistance 
============================== */

const GovernmentAssistanceContainer = styled(ContentLimiter)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.45),
  borderRadius: theme.spacing(1.25),
  padding: theme.spacing(3, 6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
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

const SavingsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));

const SavingsIcon = styled(AutoAwesomeOutlinedIcon)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.secondary.dark,
  flexShrink: 0,
  marginTop: theme.spacing(0.25),
}));

const CheckEligibilityButton = styled(GlobalButton)(({ theme }) => ({
  alignSelf: 'flex-end',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(3),
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
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
          {/* Left Column */}
          <DetailsColumn>
            <Box>
              <SectionTitle>Property Details</SectionTitle>
              <DetailsList>
                {propertyDetails.map((d, i) => (
                  <DetailItem key={i}>
                    <DetailText>{d.label}</DetailText>
                    <DetailText>{d.value}</DetailText>
                  </DetailItem>
                ))}
              </DetailsList>
            </Box>

            <AISummaryContainer>
              <AISummaryTitle>AI Summary</AISummaryTitle>
              <AISummaryText>{property.summary}</AISummaryText>
            </AISummaryContainer>
          </DetailsColumn>

          {/* Right Column */}
          <RightColumn>
            <Box>
              <SectionTitle>Features</SectionTitle>
              <FeaturesContainer>
                {property.features.map((f, i) => (
                  <FeatureItem key={i}>
                    <FeatureIcon />
                    <FeatureText>{f}</FeatureText>
                  </FeatureItem>
                ))}
              </FeaturesContainer>
            </Box>

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

              <SavingsRow>
                <SavingsIcon />
                <Box>
                  <EstimatedText>Estimated saving:</EstimatedText>
                  <SavingsText>≈$12,750</SavingsText>
                  <SourceText>source: VIC</SourceText>
                </Box>
              </SavingsRow>

              <CheckEligibilityButton>Check Eligibility</CheckEligibilityButton>
            </GovernmentAssistanceContainer>
          </RightColumn>
        </MainContainer>
      </InnerContainer>
    </OuterContainer>
  );
};

export default PropertyDetailsSection;
