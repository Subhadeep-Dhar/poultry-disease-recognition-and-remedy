import { MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Brand tokens — edit here, propagates everywhere
const brandColors = {
  primary: '#2E7D32',       // Deep green — poultry/agriculture feel
  secondary: '#FF8F00',     // Amber — warning/alert accent
  background: '#F9FBF9',    // Off-white
  surface: '#FFFFFF',
  error: '#C62828',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#1A1A1A',
  onSurface: '#1A1A1A',
};

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    background: brandColors.background,
    surface: brandColors.surface,
    error: brandColors.error,
    onPrimary: brandColors.onPrimary,
    onSecondary: brandColors.onSecondary,
    onBackground: brandColors.onBackground,
    onSurface: brandColors.onSurface,
  },
};