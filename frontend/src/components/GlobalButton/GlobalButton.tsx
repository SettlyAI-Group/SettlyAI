import { Button as MuiButton, styled } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface GlobalButtonProps extends Omit<MuiButtonProps, 'size'> {
  width?: '100' | '180' | '240' | 'full';
  height?: '40' | '50';
  textColor?: 'default' | 'white' | 'black';
}

interface StyledButtonProps {
  customWidth?: '100' | '180' | '240' | 'full';
  customHeight?: '40' | '50';
  textColor?: 'default' | 'white' | 'black';
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: prop => prop !== 'customWidth' && prop !== 'customHeight',
})<StyledButtonProps>(
  ({ theme, customWidth = '180', customHeight = '40' }) => ({
    width: customWidth === 'full' ? '100%' : `${customWidth}px`,
    height: `${customHeight}px`,
    textTransform: 'none',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0),
  })
);

const GlobalButton = ({
  children,
  width = '180',
  height = '40',
  ...props
}: GlobalButtonProps) => {
  return (
    <StyledButton
      customWidth={width}
      customHeight={height}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default GlobalButton;
