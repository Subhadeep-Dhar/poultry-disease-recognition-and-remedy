import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { borderRadius, elevation } from '../theme/appTheme';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** Delay before animation starts (ms) */
  delay?: number;
}

/**
 * AnimatedCard — wraps react-native-paper Card with a subtle fade-in + scale
 * entrance animation using the built-in Animated API.
 */
export function AnimatedCard({ children, onPress, style, delay = 0 }: AnimatedCardProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, scale]);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          style,
        ]}
        onPress={onPress}
        mode="elevated"
      >
        {children}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: borderRadius.md,
    elevation: elevation.md,
  },
});
