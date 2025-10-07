import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';

// retain for future use
interface FooterItems {
  items?: string;
}

const FooterSection = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.grey[400],
  padding: theme.spacing(16, 0),
  width: '100%',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  width: '100%',
}));

const TopFooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(10),
    paddingLeft: theme.spacing(4),
  },
}));

const BottomFooterSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  paddingTop: theme.spacing(8),
  textAlign: 'center',
  width: '100vw',
  marginLeft: `calc(-50vw + 50%)`,
}));

// ===== Brand  =====
const BrandSection = styled(Box)({
  flex: 1,
});

const BrandHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledHomeIcon = styled(HomeIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(1),
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
}));

const BrandDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  maxWidth: theme.spacing(95),
}));

// ===== Navigation  =====
const NavigationSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const Column = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(15),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ColumnTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.subtitle2.fontWeight,
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.subtitle2.fontSize,
}));

const LinkItem = styled('a')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '14px',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.common.white,
  },
  marginBottom: theme.spacing(1),
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(5),
}));

// ===== Copyright =====
const CopyrightText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

// Main Footer component
const Footer = () => {
  return (
    <FooterSection>
      <FooterContent>
        <TopFooterSection>
          <BrandSection>
            <BrandHeader>
              <StyledHomeIcon />
              <BrandTitle variant="h6">Settly AI</BrandTitle>
            </BrandHeader>
            <BrandDescription variant="body2">
              Your intelligent companion for finding the perfect suburb to call home.
            </BrandDescription>
          </BrandSection>

          <NavigationSection>
            <Column>
              <ColumnTitle variant="subtitle2">Company</ColumnTitle>
              <LinkItem href="#">About Us</LinkItem>
              <LinkItem href="#">Contact</LinkItem>
            </Column>

            <Column>
              <ColumnTitle variant="subtitle2">Legal</ColumnTitle>
              <LinkItem href="#">Privacy Policy</LinkItem>
              <LinkItem href="#"> Terms of Service</LinkItem>
            </Column>

            <Column>
              <ColumnTitle variant="subtitle2">Follow Us</ColumnTitle>
              <SocialIconsContainer>
                <LinkItem href="#">
                  {' '}
                  <LinkedInIcon />
                </LinkItem>
                <LinkItem href="#">
                  {' '}
                  <InstagramIcon />
                </LinkItem>
              </SocialIconsContainer>
            </Column>
          </NavigationSection>
        </TopFooterSection>

        <BottomFooterSection>
          <CopyrightText variant="body2">© 2024 Settly AI. All rights reserved.</CopyrightText>
        </BottomFooterSection>
      </FooterContent>
    </FooterSection>
  );
};

export default Footer;
