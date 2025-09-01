import {
  Box,
  Container,
  Typography,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from "@mui/icons-material/Home";
interface FooterProps {
  className?: string;
}

// Footer main container
const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.grey[400],
  padding:theme.spacing(12, 4, 12, 4),
}));

// Top section - contains left and right containers
const TopSection = styled(Box)(({ theme }) => ({
  display: 'flex', gap: theme.spacing(4),marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {flexDirection: 'column',gap: theme.spacing(3),},
}));

// Bottom section - copyright
const BottomSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  paddingTop: theme.spacing(3),textAlign: 'center',
}));

// Reusable navigation column component
const NavColumn = ({ title, links }: { title: string; links: Array<{ text: string; href: string }> }) => (
  <Box sx={theme => ({ flex: 1, minWidth: theme.spacing(15) })}>
    <Typography  variant="h6" 
      sx={{ 
        color: theme => theme.palette.common.white,
        fontWeight: theme => theme.typography.fontWeightBold,
        mb: theme => theme.spacing(2),
        fontSize: theme => theme.typography.pxToRem(16)
      }}
    >
      {title}
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: theme => theme.spacing(1) 
    }}>
      {links.map((link, index) => (
        <Link 
          key={index}
          href={link.href} 
          sx={{
            color: theme => theme.palette.grey[400],
            textDecoration: 'none',
            fontSize: theme => theme.typography.pxToRem(14),
            '&:hover': { 
              color: theme => theme.palette.common.white,
              textDecoration: 'none' 
            }
          }}
        >
          {link.text}
        </Link>
      ))}
    </Box>
  </Box>
);

// Main Footer component
const Footer  = ({ className }:FooterProps) => {
  // Navigation data
  const companyLinks = [
    { text: 'About Us', href: '#' },
    { text: 'Contact', href: '#' }
  ];

  const legalLinks = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Service', href: '#' }
  ];

  return (
    <FooterContainer className={className}>
      <Container maxWidth="lg">
        <TopSection>
          {/* Left Container */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: theme => theme.spacing(2) 
            }}>
              <HomeIcon sx={{ color: theme => theme.palette.common.white, fontSize: theme => theme.typography.pxToRem(28) }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme => theme.palette.common.white,
                  fontWeight: theme => theme.typography.fontWeightBold,
                  fontSize: theme => theme.typography.pxToRem(20),
                  ml: theme => theme.spacing(2)
                }}
              >
                Settly AI
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme => theme.palette.grey[400],
                lineHeight: theme => theme.typography.body2.lineHeight,
                maxWidth: theme => theme.spacing(37.5)
              }}
            >
              Your intelligent companion for finding the perfect suburb to call home.
            </Typography>
          </Box>
          {/* Right Container */}
          <Box sx={theme => ({ 
            flex: 1, 
            display: 'flex', 
            gap: theme.spacing(4),
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              gap: theme.spacing(2),
            }
          })}>

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
                  fontSize: theme => theme.typography.pxToRem(16)
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: theme => theme.spacing(1) 
              }}>
              {[
                  { icon: <LinkedInIcon />, href: '#' },
                  { icon: <InstagramIcon />, href: '#' }
                ].map((social, index) => (
                  <Link 
                    key={index}
                    href={social.href} 
                    sx={theme => ({
                      color: theme.palette.grey[400],
                      '&:hover': {
                        color: theme.palette.common.white,
                      }
                    })}
                  >
                    {social.icon}
                  </Link>
                ))}
                  </Box>
              </Box>
            </Box>
        </TopSection>

        {/* Bottom Section - Copyright */}
        <BottomSection>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme => theme.palette.grey[500],
              fontSize: theme => theme.typography.pxToRem(14)
            }}
          >
            © 2024 Settly AI. All rights reserved.
          </Typography>
        </BottomSection>
      </Container>
    </FooterContainer>
  );
};

export default Footer;