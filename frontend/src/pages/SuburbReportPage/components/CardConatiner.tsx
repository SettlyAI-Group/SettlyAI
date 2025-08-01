import React from 'react';
import { Box, Typography, Container, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';

type CustomContainerProps = {
  minHeight?: string | number;
  title: string;
  children?: React.ReactNode;
};

const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight?: string | number }>(({ theme, minHeight }) => ({
  minHeight,
  maxWidth: '1440px',
  margin: '20px',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));


const CardContainer = ({minHeight,title,children}:PropsWithChildren<CustomContainerProps>) => {
  return (
    <StyledContainer maxWidth="lg" minHeight={minHeight}>
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </StyledContainer>
  );
};

export default CardContainer;
