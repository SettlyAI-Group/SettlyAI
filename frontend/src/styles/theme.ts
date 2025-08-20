import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { createColorSet } from '../utils/themeUtils';

// Base colors
const primaryBase = '#7B61FF';
const secondaryBase = '#4F88F7';
const errorBase = '#FF0000';
const warningBase = '#E67E22';
const infoBase = '#22D3EE';
const successBase = '#10B981';

// Other colors
const backgroundColor = '#F8F9FB';
const paperColor = '#ffffff';
const textPrimaryColor = '#1F2937';
const textSecondaryColor = '#4B5563';
const textDisabledColor = '#8C8D8B';
const textHint = '#6B7280';
const dividerColor = '#E5E7EB';

// Spacing and shape
const spacing = 4;
const borderRadius = 4;

// Font variables
const fontFamily = 'Poppins, Arial, sans-serif';

// Typography based on design specs
const typographyH1 = {
  fontSize: '48px',
  fontWeight: 700,
  lineHeight: '48px',
};

const typographyH2 = {
  fontSize: '48px',
  fontWeight: 400,
  lineHeight: '60px',
};

const typographyH3 = {
  fontSize: '36px',
  fontWeight: 400,
  lineHeight: '40px',
};

const typographyH4 = {
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '30.46px',
};

const typographyH5 = {
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '28px',
};

const typographySubtitle1 = {
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '27.57px',
};

const typographySubtitle2 = {
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '22px',
};

const typographyBody1 = {
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '24px',
};

const typographyBody2 = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
};

const typographyP1 = {
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
};

const typographyP2 = {
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '16px',
};

const typographyCardTitle = {
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
};

const typographyCardValue = {
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '32px',
};

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: backgroundColor,
      paper: paperColor,
    },
    text: {
      primary: textPrimaryColor,
      secondary: textSecondaryColor,
      disabled: textDisabledColor,
      cardHint: textHint,
    },
    primary: createColorSet(primaryBase),
    secondary: createColorSet(secondaryBase),
    error: createColorSet(errorBase),
    warning: createColorSet(warningBase),
    info: createColorSet(infoBase),
    success: createColorSet(successBase),
    black: createColorSet(textPrimaryColor),
    divider: dividerColor,
  },
  typography: {
    fontFamily: fontFamily,
    h1: typographyH1,
    h2: typographyH2,
    h3: typographyH3,
    h4: typographyH4,
    h5: typographyH5,
    subtitle1: typographySubtitle1,
    subtitle2: typographySubtitle2,
    body1: typographyBody1,
    body2: typographyBody2,
    cardTitle: typographyCardTitle,
    cardValue: typographyCardValue,
    p1: typographyP1,
    p2: typographyP2,
  },
  spacing: spacing,
  shape: {
    borderRadius: borderRadius,
  },
};

const theme = createTheme(themeOptions);

export default theme;
