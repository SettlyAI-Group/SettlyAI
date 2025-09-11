import { Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GrayOutlinedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  borderColor: ' #E0E0E0', 
}));

const CustomGrayOutlinedButton = styled(GrayOutlinedButton)(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: 'none',
}));

export const SocialLoginButtons = () => {
  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <CustomGrayOutlinedButton fullWidth variant="outlined">
        Sign In with Google
      </CustomGrayOutlinedButton>
      <CustomGrayOutlinedButton fullWidth variant="outlined">
        Sign In with Facebook
      </CustomGrayOutlinedButton>
      <CustomGrayOutlinedButton fullWidth variant="outlined">
        Sign In with LinkedIn
      </CustomGrayOutlinedButton>
    </Stack>
  );
};
