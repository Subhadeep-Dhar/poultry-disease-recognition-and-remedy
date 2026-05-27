import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'Splash'>;

const SPLASH_DURATION_MS = 2200;

export default function SplashScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Text fades in slightly after
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 700,
      delay: 400,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity, logoScale, textOpacity]);

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
      <View style={styles.body}>
        {/* Logo mark */}
        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={[styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <MaterialCommunityIcons
              name="bird"
              size={56}
              color="#FFFFFF"
            />
          </View>
        </Animated.View>

        {/* App name + tagline */}
        <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
          <Text variant="headlineMedium" style={styles.appName}>
            Poultry Health
          </Text>
          <Text variant="bodyMedium" style={styles.tagline}>
            Detect · Diagnose · Remedy
          </Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ActivityIndicator color="rgba(255,255,255,0.7)" size="small" />
        <Text variant="labelSmall" style={styles.footerText}>
          Initialising…
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
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  appName: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagline: {
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
});