/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme as useNativeColorScheme } from 'react-native';
import { colors } from '@/constants/colors';

export function useTheme() {
  const scheme = useNativeColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return colors[theme];
}