import { alpha, getContrastRatio, darken } from '@mui/material/styles';

// Color set interface
export interface ColorSet {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

/**
 * Creates a color set including main, light, dark, and contrast text colors
 * @param baseColor Base color
 * @param lightFactor Factor for lightening (0-1)
 * @param darkFactor Factor for darkening (0-1)
 * @returns Object containing main, light, dark, and contrast text colors
 */
export const createColorSet = (
  baseColor: string,
  lightFactor = 0.5,
  darkFactor = 0.2
): ColorSet => {
  const main = baseColor;
  const light = alpha(baseColor, lightFactor);
  const dark = darken(baseColor, darkFactor);
  const contrastText = getContrastRatio(main, '#fff') > 4.5 ? '#fff' : '#111';

  return {
    main,
    light,
    dark,
    contrastText,
  };
};
