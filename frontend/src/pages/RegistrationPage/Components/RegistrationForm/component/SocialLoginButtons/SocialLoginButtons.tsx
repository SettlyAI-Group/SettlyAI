// components/SocialLoginButtons.tsx
import { Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GrayOutlinedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black, // 字体颜色
  borderColor: ' #E0E0E0', // 边框颜色
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
