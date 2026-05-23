import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface AppCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightIcon?: string; // Material icon name
  children?: React.ReactNode;
}

export function AppCard({
  title,
  subtitle,
  onPress,
  rightIcon,
  children,
}: AppCardProps) {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      mode="elevated"
    >
      <Card.Title
        title={title}
        subtitle={subtitle}
        titleStyle={{ color: theme.colors.onSurface }}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        right={
          rightIcon
            ? () => (
                <View style={styles.iconContainer}>
                  <Text style={{ color: theme.colors.primary, fontSize: 20 }}>
                    ›
                  </Text>
                </View>
              )
            : undefined
        }
      />
      {children && <Card.Content>{children}</Card.Content>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  iconContainer: {
    paddingRight: 16,
  },
});