import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Edit tokens here — they propagate to all components via the theme.

/** Spacing scale (4px base grid) */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Border radius scale */
export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Elevation / shadow presets (Android elevation values) */
export const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
} as const;

/** Severity color mapping — used for symptoms and status badges */
export const severityColors = {
  mild: '#F9A825',
  moderate: '#EF6C00',
  severe: '#C62828',
} as const;

/** Confidence color mapping */
export const confidenceColors = {
  high: '#2E7D32',
  moderate: '#EF6C00',
  low: '#C62828',
} as const;

export const getConfidenceColor = (score: number): string => {
  if (score >= 80) return confidenceColors.high;
  if (score >= 55) return confidenceColors.moderate;
  return confidenceColors.low;
};

export const getConfidenceLabel = (score: number): string => {
  if (score >= 80) return 'High Confidence';
  if (score >= 55) return 'Moderate Confidence';
  return 'Low Confidence';
};

// ─── Brand Colors ───────────────────────────────────────────────────────────────
const lightColors = {
  primary: '#1B7A3D',         // Deep professional green
  primaryContainer: '#C8F0D4',
  onPrimaryContainer: '#002109',
  secondary: '#D97706',       // Warm amber accent
  secondaryContainer: '#FFF0D6',
  onSecondaryContainer: '#261900',
  tertiary: '#1565C0',        // Info blue
  tertiaryContainer: '#D4E7FA',
  background: '#F5F7F5',      // Subtle warm off-white
  surface: '#FFFFFF',
  surfaceVariant: '#EDF2ED',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onBackground: '#191C19',
  onSurface: '#191C19',
  onSurfaceVariant: '#5C6B5E',
  outline: '#C5CCC6',
  outlineVariant: '#E0E7E1',
  inverseSurface: '#2E312E',
  inverseOnSurface: '#F0F1EC',
};

const darkColors = {
  primary: '#8BD99E',
  primaryContainer: '#0D5A2B',
  onPrimaryContainer: '#C8F0D4',
  secondary: '#FFB74D',
  secondaryContainer: '#5C3D00',
  onSecondaryContainer: '#FFF0D6',
  tertiary: '#90CAF9',
  tertiaryContainer: '#0D47A1',
  background: '#121412',
  surface: '#1E201E',
  surfaceVariant: '#2A2E2A',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  onPrimary: '#003918',
  onSecondary: '#3E2D00',
  onBackground: '#E2E3DE',
  onSurface: '#E2E3DE',
  onSurfaceVariant: '#BFC9BF',
  outline: '#6B7B6D',
  outlineVariant: '#3A413B',
  inverseSurface: '#E2E3DE',
  inverseOnSurface: '#2E312E',
};

// ─── Material 3 Theme Exports ───────────────────────────────────────────────────
export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
};

export const appDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
};