import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../theme/appTheme';

interface ScreenBannerProps {
  /** MaterialCommunityIcons name */
  icon?: string;
  title: string;
  subtitle?: string;
  /** Override background color (defaults to theme primary) */
  backgroundColor?: string;
}

/**
 * ScreenBanner — reusable header banner for screens.
 * Replaces the ad-hoc banner Views that were duplicated across every screen.
 */
export function ScreenBanner({
  icon,
  title,
  subtitle,
  backgroundColor,
}: ScreenBannerProps) {
  const theme = useTheme();
  const bg = backgroundColor ?? theme.colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.row}>
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={22}
            color="#FFFFFFDD"
            style={styles.icon}
          />
        )}
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
      </View>
      {subtitle ? (
        <Text variant="bodySmall" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subtitle: {
    color: '#FFFFFFBB',
  },
});
