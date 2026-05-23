import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { SectionHeader } from '../components/SectionHeader';
import { useAppStore } from '../store/appStore';

type Props = ScreenProps<'DiseaseDetection'>;

export default function DiseaseDetectionScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);

  // Clear any previous session when starting fresh
  const startSession = (mode: 'camera' | 'gallery') => {
    setSelectedImageUri(null);
    setAnalysisResult(null);
    navigation.navigate('ImageSelection', { mode });
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          Disease Detection
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          Photograph a sick bird or upload an existing image
        </Text>
      </View>

      <SectionHeader
        title="Choose Input Method"
        subtitle="Select how you want to provide the image"
      />

      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="elevated"
      >
        <Card.Title
          title="📷  Take a Photo"
          subtitle="Use your camera to capture the bird"
          titleStyle={{ color: theme.colors.onSurface }}
        />
        <Card.Content>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Point your camera at the sick bird and capture a clear, well-lit
            photo for best results.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => startSession('camera')}
            icon="camera"
          >
            Open Camera
          </Button>
        </Card.Actions>
      </Card>

      <Divider style={styles.divider} />

      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="elevated"
      >
        <Card.Title
          title="🖼️  Upload from Gallery"
          subtitle="Select an existing photo from your device"
          titleStyle={{ color: theme.colors.onSurface }}
        />
        <Card.Content>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Choose a previously taken photo of the affected bird from your
            device gallery.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained-tonal"
            onPress={() => startSession('gallery')}
            icon="image"
          >
            Open Gallery
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.infoBox}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          🔬  The analysis engine will process the image and return a disease
          match. Currently running simulated analysis — real ML in Phase 5.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  bannerTitle: { color: '#FFFFFF', fontWeight: '700' },
  bannerSub: { color: '#FFFFFFBB' },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  divider: { marginHorizontal: 16, marginTop: 16 },
  infoBox: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
});