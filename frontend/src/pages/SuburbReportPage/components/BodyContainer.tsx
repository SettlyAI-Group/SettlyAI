
import { Container, Typography, Box, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';

type BodyContainerProps = {
  minHeight?: string | number;
  title?: string;
};

const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight?: string | number }>(({ theme, minHeight }) => ({
  minHeight: minHeight,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const StyledBox = styled(Box)({
  height: '100%',
});

const BodyContainer = ({ minHeight, title, children }:PropsWithChildren<BodyContainerProps>) =>{
  return (
    <StyledContainer maxWidth="lg" minHeight={minHeight}>
      <StyledBox>
        {title && (
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </StyledBox>
    </StyledContainer>
  );
};

export default BodyContainer;
