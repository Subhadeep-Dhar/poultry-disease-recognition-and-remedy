import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';

interface GalleryTileProps {
  source: number;          // require() result
  size: number;            // width and height in px
  label: string;           // e.g. "#1"
  onPress?: () => void;
}

export function GalleryTile({ source, size, label, onPress }: GalleryTileProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      {/* Real image */}
      {!error && (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}

      {/* Loading spinner overlay */}
      {loading && !error && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {/* Fallback if image fails */}
      {error && (
        <View style={styles.overlay}>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {label}
          </Text>
        </View>
      )}

      {/* Label badge at bottom */}
      {!loading && !error && (
        <View style={styles.labelBadge}>
          <Text variant="labelSmall" style={styles.labelText}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000055',
    paddingVertical: 2,
    alignItems: 'center',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});