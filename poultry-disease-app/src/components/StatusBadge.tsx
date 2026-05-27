import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { getConfidenceColor, getConfidenceLabel, borderRadius, spacing } from '../theme/appTheme';

interface StatusBadgeProps {
  /** 0–100 confidence score */
  score: number;
  /** Optional custom label override */
  label?: string;
  /** Compact variant omits the label text */
  compact?: boolean;
}

/**
 * StatusBadge — displays a confidence/severity indicator with
 * color-coded background and label.
 */
export function StatusBadge({ score, label, compact = false }: StatusBadgeProps) {
  const theme = useTheme();
  const color = getConfidenceColor(score);
  const displayLabel = label ?? getConfidenceLabel(score);

  return (
    <View style={[styles.container, { backgroundColor: color + '18' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      {!compact && (
        <Text variant="labelMedium" style={[styles.label, { color }]}>
          {displayLabel}
        </Text>
      )}
      <Text variant="labelMedium" style={[styles.score, { color }]}>
        {score}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontWeight: '600',
  },
  score: {
    fontWeight: '700',
  },
});
