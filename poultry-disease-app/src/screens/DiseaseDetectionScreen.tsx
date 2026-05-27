import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { ScreenBanner } from '../components/ScreenBanner';
import { SectionHeader } from '../components/SectionHeader';
import { AnimatedCard } from '../components/AnimatedCard';
import { useAppStore } from '../store/appStore';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'DiseaseDetection'>;

export default function DiseaseDetectionScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);

  const startSession = (mode: 'camera' | 'gallery') => {
    setSelectedImageUri(null);
    setAnalysisResult(null);
    navigation.navigate('ImageSelection', { mode });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScreenBanner
        icon="stethoscope"
        title="Disease Detection"
        subtitle="Photograph or upload an image of a sick bird for analysis"
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Choose Input Method"
          subtitle="Select how you want to provide the image for analysis"
        />

        {/* Camera option */}
        <AnimatedCard delay={0} onPress={() => startSession('camera')} style={styles.card}>
          <View style={styles.cardBody}>
            <View style={[styles.iconArea, { backgroundColor: theme.colors.primary + '14' }]}>
              <MaterialCommunityIcons name="camera-outline" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Take a Photo
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
                Use your camera to capture a clear, well-lit photograph of the affected bird for best diagnostic results.
              </Text>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => startSession('camera')}
                style={styles.cardButton}
                contentStyle={{ paddingVertical: 2 }}
                compact
              >
                Open Camera
              </Button>
            </View>
          </View>
        </AnimatedCard>

        <Divider style={styles.divider} />

        {/* Gallery option */}
        <AnimatedCard delay={80} onPress={() => startSession('gallery')} style={styles.card}>
          <View style={styles.cardBody}>
            <View style={[styles.iconArea, { backgroundColor: theme.colors.secondary + '14' }]}>
              <MaterialCommunityIcons name="image-outline" size={32} color={theme.colors.secondary} />
            </View>
            <View style={styles.cardText}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Upload from Gallery
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
                Choose an existing photograph of the affected bird from your device's photo gallery.
              </Text>
              <Button
                mode="contained-tonal"
                icon="image"
                onPress={() => startSession('gallery')}
                style={styles.cardButton}
                contentStyle={{ paddingVertical: 2 }}
                compact
              >
                Open Gallery
              </Button>
            </View>
          </View>
        </AnimatedCard>

        {/* Info note */}
        <View style={[styles.infoBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color={theme.colors.tertiary}
            style={{ marginTop: 1 }}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 20 }}>
            The analysis engine processes your image and returns a disease probability. Currently running
            simulated analysis — real ML inference will be enabled in a future update.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: spacing.xs },
  card: { marginTop: spacing.xs },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconArea: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardText: { flex: 1, gap: spacing.sm },
  cardButton: { alignSelf: 'flex-start', marginTop: spacing.xs },
  divider: { marginHorizontal: spacing.md, marginVertical: spacing.xs },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
});