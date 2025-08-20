import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    cardTitle: React.CSSProperties;
    cardValue: React.CSSProperties;
    p1: React.CSSProperties;
    p2: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    cardTitle?: React.CSSProperties;
    cardValue?: React.CSSProperties;
    p1?: React.CSSProperties;
    p2?: React.CSSProperties;
  }

  interface TypeText {
    cardHint: string;
  }

  interface TypeTextOptions {
    cardHint?: string;
  }

  interface Palette {
    black: Palette['primary'];
  }

  interface PaletteOptions {
    black?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    cardTitle: true;
    cardValue: true;
    p1: true;
    p2: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}

declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}
