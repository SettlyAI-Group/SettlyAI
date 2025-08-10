import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CtaBannerContainer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        py: theme.spacing(6),
        mt: theme.spacing(20),
      }}
    >
      <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          What’s Next?
        </Typography>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            textAlign: 'center',
          }}
        >
          Ready to explore other suburbs or need financing options?
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mt: theme.spacing(6),
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate('/explore')}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              ml: theme.spacing(10),
              width: 230,
              hight: 40,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Explore Suburbs
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/simulate')}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              ml: theme.spacing(8),
              width: 310,
              hight: 40,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Try Simulate Loan Calculator
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CtaBannerContainer;
