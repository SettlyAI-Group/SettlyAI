import { Box, Container, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import NavColumn from './NavColum';
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
  margin: theme.spacing(2, -30, 12, -35),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}));

const BottomFooterSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  paddingTop: theme.spacing(8),
  margin: theme.spacing(0, -30, 0, -35),
  textAlign: 'center',
}));

// Main Footer component
const Footer = ({ items }: FooterItems) => {
  // Navigation data
  const companyLinks = [
    { text: 'About Us', href: '#' },
    { text: 'Contact', href: '#' },
  ];

  const legalLinks = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Service', href: '#' },
  ];
  return (
    <FooterSection className={items}>
      <Container>
        <TopFooterSection>
          {/* Left Container */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                paddingLeft: theme => theme.spacing(10),
                mb: theme => theme.spacing(2),
              }}
            >
              <HomeIcon
                sx={{
                  color: theme => theme.palette.primary.main,
                  fontSize: theme => theme.typography.pxToRem(28),
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme => theme.palette.common.white,
                  fontWeight: theme => theme.typography.fontWeightBold,
                  fontSize: theme => theme.typography.pxToRem(20),
                  ml: theme => theme.spacing(2),
                }}
              >
                Settly AI
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                paddingLeft: theme => theme.spacing(10),
                color: theme => theme.palette.grey[400],
                lineHeight: theme => theme.typography.body2.lineHeight,
                maxWidth: theme => theme.spacing(95),
              }}
            >
              Your intelligent companion for finding the perfect suburb to call
              home.
            </Typography>
          </Box>
          {/* Right Container */}
          <Box
            sx={theme => ({
              flex: 1,
              display: 'flex',
              gap: theme.spacing(4),
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                gap: theme.spacing(2),
              },
            })}
          >
            <NavColumn title="Company" links={companyLinks} />
            <NavColumn title="Legal" links={legalLinks} />

            {/* Follow Us Column */}
            <Box sx={{ flex: 1, minWidth: theme => theme.spacing(15) }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme => theme.palette.common.white,
                  fontWeight: theme => theme.typography.fontWeightBold,
                  mb: theme => theme.spacing(2),
                  fontSize: theme => theme.typography.pxToRem(16),
                }}
              >
                Follow Us
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: theme => theme.spacing(4),
                }}
              >
                {[
                  { icon: <LinkedInIcon />, href: '#' },
                  { icon: <InstagramIcon />, href: '#' },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    sx={theme => ({
                      color: theme.palette.grey[400],
                      '&:hover': {
                        color: theme.palette.common.white,
                      },
                    })}
                  >
                    {social.icon}
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        </TopFooterSection>
        {/* Bottom Section - Copyright */}
        <BottomFooterSection>
          <Typography
            variant="body2"
            sx={{
              color: theme => theme.palette.grey[500],
              fontSize: theme => theme.typography.pxToRem(14),
            }}
          >
            © 2024 Settly AI. All rights reserved.
          </Typography>
        </BottomFooterSection>
      </Container>
    </FooterSection>
  );
};

export default Footer;
