import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  label?: string;
}

// Used wherever real images will appear in Phase 3.
// Drop-in replacement: remove this and add <Image> with same dimensions.
export function PlaceholderImage({
  width = 120,
  height = 120,
  label = 'Image',
}: PlaceholderImageProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});