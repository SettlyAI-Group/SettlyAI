import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const footerStyle = {
    backgroundColor: '#2c2f3e',
    color: '#9ca3af',
    paddingTop: '48px',
    paddingBottom: '48px',
    paddingLeft: '16px',
    paddingRight: '16px',
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '32px',
  };

  const brandSectionStyle = {
    flex: '1 1 300px', // minwidth 300px in small screens
    minWidth: '300px',
  };

  const navSectionStyle = {
    flex: '1 1 300px', // take 50% width in large screens
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap' as const,
  };

  const brandContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const logoStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: '#6366f1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
  };

  const logoTextStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  };

  const brandNameStyle = {
    color: 'white',
    fontWeight: 600,
    fontSize: '20px',
  };

  const descriptionStyle = {
    color: '#9ca3af',
    lineHeight: 1.6,
    maxWidth: '300px',
  };

  const sectionTitleStyle = {
    color: 'white',
    fontWeight: 600,
    marginBottom: '16px',
    fontSize: '16px',
  };

  const linkContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const linkStyle = {
    color: '#9ca3af',
    textDecoration: 'none' as const,
    fontSize: '14px',
    cursor: 'pointer' as const,
  };

  const socialContainerStyle = {
    display: 'flex',
    gap: '8px',
  };

  const copyrightContainerStyle = {
    borderTop: '1px solid #374151',
    marginTop: '32px',
    paddingTop: '24px',
    textAlign: 'center' as const,
  };

  const copyrightTextStyle = {
    color: '#6b7280',
    fontSize: '14px',
  };

  const navColumnStyle = {
    flex: '1', // divide the space equally within nav section
    minWidth: '120px',
  };

  // window size state for responsiveness
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 768;

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'white';
    e.currentTarget.style.textDecoration = 'none';
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#9ca3af';
  };

  return (
    <Box
      component="footer"
      className={className}
      style={footerStyle}
    >
      <Container maxWidth="lg">
        <Box style={isLargeScreen ? {
          ...containerStyle,
          justifyContent: 'space-between',
        } : {
          ...containerStyle,
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Left Brand Section */}
          <Box style={isLargeScreen ? {
            ...brandSectionStyle,
            flex: '0 0 48%',
          } : brandSectionStyle}>
            <Box style={brandContainerStyle}>
              <Box style={logoStyle}>
                <Typography
                  variant="h6"
                  style={logoTextStyle}
                >
                  🏠
                </Typography>
              </Box>
              <Typography
                variant="h6"
                style={brandNameStyle}
              >
                Settly AI
              </Typography>
            </Box>
            <Typography
              variant="body2"
              style={descriptionStyle}
            >
              Your intelligent companion for finding the perfect suburb to call home.
            </Typography>
          </Box>

          {/* Right Navigation Section - includes Company, Legal and Follow Us */}
          <Box style={isLargeScreen ? {
            ...navSectionStyle,
            flex: '0 0 48%',
            justifyContent: 'space-between',
          } : navSectionStyle}>
            {/* Company */}
            <Box style={navColumnStyle}>
              <Typography
                variant="h6"
                style={sectionTitleStyle}
              >
                Company
              </Typography>
              <Box style={linkContainerStyle}>
                <Link
                  href="#"
                  style={linkStyle}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  style={linkStyle}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  Contact
                </Link>
              </Box>
            </Box>

            {/* Legal */}
            <Box style={navColumnStyle}>
              <Typography
                variant="h6"
                style={sectionTitleStyle}
              >
                Legal
              </Typography>
              <Box style={linkContainerStyle}>
                <Link
                  href="#"
                  style={linkStyle}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  style={linkStyle}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  Terms of Service
                </Link>
              </Box>
            </Box>

            {/* Follow Us */}
            <Box style={navColumnStyle}>
              <Typography
                variant="h6"
                style={sectionTitleStyle}
              >
                Follow Us
              </Typography>
              <Box style={socialContainerStyle}>
              <a
                  href="#"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LinkedInIcon />
                  </a>
                <a
                  href="#"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <InstagramIcon />
                  </a>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom */}
        <Box style={copyrightContainerStyle}>
          <Typography
            variant="body2"
            style={copyrightTextStyle}
          >
            © 2024 Settly AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;