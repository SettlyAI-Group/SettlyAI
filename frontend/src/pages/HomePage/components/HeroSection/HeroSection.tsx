import { InputAdornment, Container, Box, TextField, Button, Typography, styled, useTheme } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const HeroSectionContainer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const HeroContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(25),
    paddingInline: theme.spacing(6),
    [theme.breakpoints.between('sm', 'md')]: {
      paddingInline: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
      paddingInline: theme.spacing(0),
    },
  }));

  const MainHeader = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    ...theme.typography.h2,
  }));

  const Accent = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
  }));

  const ReportButton = styled(Button)(({ theme }) => ({
    position: 'static',
    width: '100%',
    height: 48,
    whiteSpace: 'nowrap',
    color: '#fff',
    ...theme.typography.subtitle1,
    [theme.breakpoints.up(1150)]: {
      position: 'absolute',
      width: 200,
      left: '100%',
      height: 56,
      transform: 'translateX(36px)',
    },
  }));

  const ExploreButton = styled(Button)(({ theme }) => ({
    width: 'min(100%, 220px)',
    height: 60,
    backgroundColor: lighten(theme.palette.secondary.light, 0.75),
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    ...theme.typography.subtitle2,
  }));
  const RotbotButton = styled(Button)(({ theme }) => ({
    ...theme.typography.p1,
  }));

  return (
    <Box
      sx={theme => ({
        width: '100%',
        backgroundColor: theme.palette.background.default,
      })}
    >
      <HeroContainer>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: 770 },
            mx: 'auto',
            pb: theme.spacing(10),
          }}
        >
          <MainHeader>
            Your AI-Powered Guide for <Accent>Property, Loan & Super</Accent> Planning
          </MainHeader>
        </Box>

        <Box
          sx={{
            maxWidth: { xs: '100%', md: 650 },
            mx: 'auto',
          }}
        >
          <Typography
            sx={theme => ({
              ...theme.typography.subtitle1,
              color: theme.palette.text.secondary,
            })}
          >
            No jargon, just clarity. Plan your future with confidence using smart reports and tools built for first-home
            buyers and everyday Australians.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: theme.spacing(6) }}>
          <Box
            sx={theme => ({
              position: 'relative',
              width: { xs: '100%', md: 650 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: { xs: 4, md: 6 },
              overflow: 'visible',
              '& .MuiInputBase-input::placeholder': {
                ...theme.typography.p1,
              },
            })}
          >
            <TextField
              variant="outlined"
              fullWidth
              id="fullWidth"
              placeholder="Paste your property address or suburb to get insights..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="disabled" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={theme => ({
                height: { xs: 48, md: 56 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius,
                },
              })}
            />
            <ReportButton variant="contained" onClick={() => navigate('/report')}>
              GET MY REPORT
            </ReportButton>
          </Box>
        </Box>

        <Box
          sx={theme => ({
            width: {
              xs: '100%',
              md: 640,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'stretch',
            },
            mx: 'auto',
            gap: { xs: 4, md: 8 },
            pt: { xs: 4, md: 4 },
            pb: 8,
          })}
        >
          <ExploreButton variant="text">Explore Suburb</ExploreButton>

          <RotbotButton>Not sure where to begin? Chat with Settly Robot</RotbotButton>
        </Box>
      </HeroContainer>
    </Box>
  );
};

export default HeroSectionContainer;
