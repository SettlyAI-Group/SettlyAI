import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';


const StyledBanner = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: 400,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  width:'100%',
}));

const BannerConatiner = ({ children }:PropsWithChildren) => {
  return <StyledBanner>{children}</StyledBanner>;
};

export default BannerConatiner;
