// components/SocialLoginButtons.tsx
import { Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GrayOutlinedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black, // 字体颜色
  borderColor: ' #E0E0E0', // 边框颜色
}));

export const SocialLoginButtons = () => {
  return (
    <Stack spacing={1}>
      <GrayOutlinedButton fullWidth variant="outlined">
        Sign In with Google
      </GrayOutlinedButton>
      <GrayOutlinedButton fullWidth variant="outlined">
        Sign In with Facebook
      </GrayOutlinedButton>
      <GrayOutlinedButton fullWidth variant="outlined">
        Sign In with LinkedIn
      </GrayOutlinedButton>
    </Stack>
  );
};
