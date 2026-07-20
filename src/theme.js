export const colors = {
  primary: '#000000',
  onPrimary: '#ffffff',
  primaryContainer: '#131b2e',
  onPrimaryContainer: '#7c839b',
  primaryFixed: '#dae2fd',
  primaryFixedDim: '#bec6e0',

  secondary: '#006591',
  onSecondary: '#ffffff',
  secondaryContainer: '#39b8fd',
  onSecondaryContainer: '#004666',
  secondaryFixed: '#c9e6ff',
  secondaryFixedDim: '#89ceff',

  tertiary: '#000000',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00201c',
  onTertiaryContainer: '#009485',
  tertiaryFixed: '#62fae3',
  tertiaryFixedDim: '#3cddc7',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  background: '#f7f9fb',
  onBackground: '#191c1e',

  surface: '#f7f9fb',
  onSurface: '#191c1e',
  surfaceDim: '#d8dadc',
  surfaceBright: '#f7f9fb',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  surfaceContainerHighest: '#e0e3e5',
  surfaceVariant: '#e0e3e5',
  onSurfaceVariant: '#45464d',
  surfaceTint: '#565e74',

  inverseSurface: '#2d3133',
  inverseOnSurface: '#eff1f3',
  inversePrimary: '#bec6e0',

  outline: '#76777d',
  outlineVariant: '#c6c6cd',

  warning: '#f59e0b',
  success: '#2dd4bf',
};

export const typography = {
  fonts: {
    sans: 'Inter',
    mono: 'JetBrains Mono',
  },
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  headlineLg: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  headlineLgMobile: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  dataDisplay: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'JetBrains Mono',
  },
};

export const spacing = {
  base: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  edgeMargin: 20,
  gutter: 12,
};

export const rounded = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};
