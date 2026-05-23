import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { getDiseaseById } from '../data/diseases';
import type { AnalysisResult } from '../store/appStore';

type Props = ScreenProps<'Analysis'>;

// ─────────────────────────────────────────────────────────────
// Simulated analysis pipeline.
// Phase 5: replace runSimulatedAnalysis() with real ML inference.
// Everything else — store write, navigation — stays identical.
// ─────────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  'Loading image…',
  'Preprocessing pixels…',
  'Extracting features…',
  'Matching disease patterns…',
  'Computing confidence score…',
  'Finalising result…',
];

const STEP_DURATION_MS = 500; // 6 steps × 500ms = 3 s total

async function runSimulatedAnalysis(imageUri: string): Promise<AnalysisResult> {
  // Simulated delay matching ANALYSIS_STEPS count
  await new Promise((resolve) =>
    setTimeout(resolve, ANALYSIS_STEPS.length * STEP_DURATION_MS)
  );

  // Hardcoded result — Phase 5 replaces this with real model output
  return {
    diseaseId: 'ranikhet',
    diseaseName: 'Ranikhet Disease',
    confidence: 87,
    matchedSymptomIds: ['rnk-s1', 'rnk-s2', 'rnk-s3'],
    analysedAt: new Date().toISOString(),
    imageUri,
  };
}

export default function AnalysisScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const imageUri = useAppStore((s) => s.selectedImageUri);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!imageUri) {
      navigation.replace('DiseaseDetection');
      return;
    }

    // Advance step label every STEP_DURATION_MS
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= ANALYSIS_STEPS.length) {
          clearInterval(stepInterval);
        }
        return Math.min(next, ANALYSIS_STEPS.length - 1);
      });
      setProgress((prev) =>
        Math.min(prev + 1 / ANALYSIS_STEPS.length, 1)
      );
    }, STEP_DURATION_MS);

    // Run the (simulated) analysis
    runSimulatedAnalysis(imageUri).then((result) => {
      clearInterval(stepInterval);
      setProgress(1);
      setStepIndex(ANALYSIS_STEPS.length - 1);

      // Write result to store
      setAnalysisResult(result);

      // Also set selectedDisease so ResultScreen / RemedyScreen can read it
      const disease = getDiseaseById(result.diseaseId);
      if (disease) setSelectedDisease(disease);

      // Brief pause so user sees 100% before transitioning
      setTimeout(() => {
        navigation.replace('Result');
      }, 600);
    });

    return () => clearInterval(stepInterval);
  }, []);

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
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          🔬  Analysing Image
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          Please wait — do not close the app
        </Text>
      </View>

      <View style={styles.body}>
        {/* Image thumbnail */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={[styles.thumbnail, { borderColor: theme.colors.outline }]}
            resizeMode="cover"
          />
        )}

        {/* Step label */}
        <Text
          variant="titleSmall"
          style={[styles.stepLabel, { color: theme.colors.onBackground }]}
        >
          {ANALYSIS_STEPS[stepIndex]}
        </Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 6 }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <View style={styles.note}>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
          >
            ⚙️  Simulated analysis — real ML inference arrives in Phase 5
          </Text>
        </View>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  thumbnail: {
    width: 200,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepLabel: {
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  note: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    width: '100%',
  },
});