import { Button as MuiButton, styled, Typography } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface GlobalButtonProps extends Omit<MuiButtonProps, 'size'> {
  width?: '100' | '180' | '240' | 'full';
  height?: '40' | '50';
}

interface StyledButtonProps {
  width?: '100' | '180' | '240' | 'full';
  height?: '40' | '50';
}

const StyledButton = styled(MuiButton)<StyledButtonProps>(({
  theme,
  width,
  height,
}) => {
  return {
    width: width === 'full' ? '100%' : `${width}px`,
    height: `${height}px`,
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '14px',
    fontFamily: theme.typography.fontFamily,
  };
});

const GlobalButton = ({
  children,
  width = '180',
  height = '40',
  variant = 'contained',
  ...props
}: GlobalButtonProps) => {
  return (
    <StyledButton width={width} height={height} variant={variant} {...props}>
      <Typography variant="body1">{children}</Typography>
    </StyledButton>
  );
};

export default GlobalButton;
