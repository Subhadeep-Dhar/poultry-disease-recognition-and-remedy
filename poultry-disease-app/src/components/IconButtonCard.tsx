import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, spacing, elevation } from '../theme/appTheme';

interface IconButtonCardProps {
  /** MaterialCommunityIcons name */
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  /** Icon background tint — defaults to primary with low alpha */
  iconColor?: string;
}

/**
 * IconButtonCard — a touchable card with a circular icon,
 * title/subtitle, and a trailing chevron.
 */
export function IconButtonCard({
  icon,
  title,
  subtitle,
  onPress,
  iconColor,
}: IconButtonCardProps) {
  const theme = useTheme();
  const tint = iconColor ?? theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: tint + '14' }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={tint} />
      </View>
      <View style={styles.content}>
        <Text
          variant="titleSmall"
          style={{ color: theme.colors.onSurface, fontWeight: '600' }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={theme.colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    elevation: elevation.sm,
    gap: spacing.md,
    // Subtle shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
