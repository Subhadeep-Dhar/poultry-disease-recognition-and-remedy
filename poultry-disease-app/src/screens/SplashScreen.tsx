import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';

type Props = ScreenProps<'Splash'>;

const SPLASH_DURATION_MS = 2000;

export default function SplashScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Replace so user cannot back-navigate to splash
      navigation.replace('Home');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.logoArea}>
        {/* Phase 3: replace with real logo asset */}
        <View
          style={[
            styles.logoPlaceholder,
            { backgroundColor: theme.colors.onPrimary + '22' },
          ]}
        >
          <Text style={[styles.logoEmoji]}>🐓</Text>
        </View>
        <Text variant="headlineLarge" style={[styles.appName]}>
          Poultry Health
        </Text>
        <Text variant="bodyMedium" style={[styles.tagline]}>
          Detect. Diagnose. Remedy.
        </Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator color={theme.colors.onPrimary} size="small" />
        <Text variant="bodySmall" style={styles.footerText}>
          Loading...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 52,
  },
  appName: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagline: {
    color: '#FFFFFFBB',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#FFFFFF99',
  },
});