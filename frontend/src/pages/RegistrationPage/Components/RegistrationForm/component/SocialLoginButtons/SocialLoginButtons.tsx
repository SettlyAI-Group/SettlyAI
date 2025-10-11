// components/SocialLoginButtons.tsx
import { Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { signIn } from '@/utils/oidcClient';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

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
      <CustomGrayOutlinedButton
        fullWidth
        variant="outlined"
        onClick={() => signIn('google')}
        startIcon={<GoogleIcon />}
      >
        Sign In with Google
      </CustomGrayOutlinedButton>
      <CustomGrayOutlinedButton
        fullWidth
        variant="outlined"
        onClick={() => signIn('facebook')}
        startIcon={<FacebookIcon />}
      >
        Sign In with Facebook
      </CustomGrayOutlinedButton>
      <CustomGrayOutlinedButton
        fullWidth
        variant="outlined"
        onClick={() => signIn('linkedin')}
        startIcon={<LinkedInIcon />}
      >
        Sign In with LinkedIn
      </CustomGrayOutlinedButton>
    </Stack>
  );
};
