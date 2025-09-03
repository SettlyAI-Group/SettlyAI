import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import theme from '@/styles/theme';

interface FooterItems {
  items?: string;
}

const FooterSection = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.grey[400],
  padding: theme.spacing(16, 0),
}));

const TopFooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  margin: theme.spacing(2, -40, 12, -35),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}));

const BottomFooterSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  paddingTop: theme.spacing(8),
  margin: theme.spacing(0, -40, 0, -35),
  textAlign: 'center',
}));

const BrandSection = styled(Box)({
  flex: 1,
});

const BrandHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const NavigationSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  gap: theme.spacing(4),
}));

const CompanyNavigationColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(15),
}));

const LegalNavigationColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(15),
}));

const SocialMediaColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(15),
}));

const CompanyLinksContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
});

const LegalLinksContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
});

const SocialIconsContainer = styled(Box)({
  display: 'flex',
  gap: theme.spacing(5),
});

const StyledHomeIcon = styled(HomeIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(15),
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
}));

const BrandDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(15),
  maxWidth: theme.spacing(95),
}));

const CompanyTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.subtitle2.fontWeight,
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.subtitle2.fontSize,
}));

const LegalTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.subtitle2.fontWeight,
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.subtitle2.fontSize,
}));

const SocialMediaTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.subtitle2.fontWeight,
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.subtitle2.fontSize,
}));

const AboutUsLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '14px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const ContactLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '14px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const PrivacyPolicyLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '14px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const TermsOfServiceLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '14px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const LinkedInLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const InstagramLink = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  '&:hover': {
    color: theme.palette.common.white,
  },
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

// Main Footer component
const Footer = ({ items }: FooterItems) => {
  return (
    <FooterSection className={items}>
      <Container maxWidth="lg">
        <TopFooterSection>
          <BrandSection>
            <BrandHeader>
              <StyledHomeIcon />
              <BrandTitle variant="h6">Settly AI</BrandTitle>
            </BrandHeader>
            <BrandDescription variant="body1">
              Your intelligent companion for finding the perfect suburb to call
              home.
            </BrandDescription>
          </BrandSection>

          <NavigationSection>
            <CompanyNavigationColumn>
              <CompanyTitle variant="subtitle2">Company</CompanyTitle>
              <CompanyLinksContainer>
                <AboutUsLink href="#">About Us</AboutUsLink>
                <ContactLink href="#">Contact</ContactLink>
              </CompanyLinksContainer>
            </CompanyNavigationColumn>

            <LegalNavigationColumn>
              <LegalTitle variant="subtitle2">Legal</LegalTitle>
              <LegalLinksContainer>
                <PrivacyPolicyLink href="#">Privacy Policy</PrivacyPolicyLink>
                <TermsOfServiceLink href="#">
                  Terms of Service
                </TermsOfServiceLink>
              </LegalLinksContainer>
            </LegalNavigationColumn>

            <SocialMediaColumn>
              <SocialMediaTitle variant="subtitle2">Follow Us</SocialMediaTitle>
              <SocialIconsContainer>
                <LinkedInLink href="#">
                  <LinkedInIcon />
                </LinkedInLink>
                <InstagramLink href="#">
                  <InstagramIcon />
                </InstagramLink>
              </SocialIconsContainer>
            </SocialMediaColumn>
          </NavigationSection>
        </TopFooterSection>

        <BottomFooterSection>
          <CopyrightText variant="body1">
            © 2024 Settly AI. All rights reserved.
          </CopyrightText>
        </BottomFooterSection>
      </Container>
    </FooterSection>
  );
};

export default Footer;
