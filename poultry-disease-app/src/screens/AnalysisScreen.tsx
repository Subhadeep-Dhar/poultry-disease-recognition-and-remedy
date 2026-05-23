import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, ProgressBar, Banner, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { getDiseaseById } from '../data/diseases';
import type { AnalysisResult } from '../store/appStore';
import { saveReport } from '../utils/reportsStorage';
import { runInference, isModelReady } from '../ml/inferenceEngine';

type Props = ScreenProps<'Analysis'>;

// ─── Simulated fallback (unchanged from Phase 4/5) ────────────────────────
const ANALYSIS_STEPS = [
  'Loading image…',
  'Preprocessing pixels…',
  'Extracting features…',
  'Matching disease patterns…',
  'Computing confidence score…',
  'Finalising result…',
];
const STEP_DURATION_MS = 500;

async function runSimulatedAnalysis(imageUri: string): Promise<AnalysisResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, ANALYSIS_STEPS.length * STEP_DURATION_MS)
  );
  return {
    diseaseId: 'ranikhet',
    diseaseName: 'Ranikhet Disease',
    confidence: 87,
    matchedSymptomIds: ['rnk-s1', 'rnk-s2', 'rnk-s3'],
    analysedAt: new Date().toISOString(),
    imageUri,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

// Real inference steps shown when model IS loaded
const REAL_STEPS = [
  'Loading image…',
  'Resizing to 224×224…',
  'Normalising pixels…',
  'Running TFLite inference…',
  'Parsing model output…',
  'Finalising result…',
];

export default function AnalysisScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const imageUri = useAppStore((s) => s.selectedImageUri);
  const modelReady = useAppStore((s) => s.modelReady);
  const modelLoadFailed = useAppStore((s) => s.modelLoadFailed);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const usingRealModel = modelReady && isModelReady();
  const steps = usingRealModel ? REAL_STEPS : ANALYSIS_STEPS;

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inferenceError, setInferenceError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUri) {
      navigation.replace('DiseaseDetection');
      return;
    }

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      setProgress((prev) => Math.min(prev + 1 / steps.length, 1));
    }, STEP_DURATION_MS);

    const analyse = async () => {
      let result: AnalysisResult;

      try {
        if (usingRealModel) {
          result = await runInference(imageUri);
        } else {
          result = await runSimulatedAnalysis(imageUri);
        }
      } catch (e) {
        // Real inference failed mid-run — fall back to simulation
        console.warn('[AnalysisScreen] Inference error, falling back:', e);
        setInferenceError(
          'Real inference failed. Showing simulated result as fallback.'
        );
        result = await runSimulatedAnalysis(imageUri);
      }

      clearInterval(stepInterval);
      setProgress(1);
      setStepIndex(steps.length - 1);

      await saveReport(result);
      setAnalysisResult(result);

      const disease = getDiseaseById(result.diseaseId);
      if (disease) setSelectedDisease(disease);

      setTimeout(() => navigation.replace('Result'), 600);
    };

    analyse();

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
      {/* Model status banners */}
      <Banner
        visible={modelLoadFailed && !inferenceError}
        icon="alert-circle-outline"
        style={{ backgroundColor: '#FFF9C4' }}
        actions={[]}
      >
        <Text style={{ color: '#F57F17' }}>
          ML model not loaded — running simulated analysis. Add
          ranikhet_classifier.tflite to assets/models/ and rebuild.
        </Text>
      </Banner>

      <Banner
        visible={!!inferenceError}
        icon="alert"
        style={{ backgroundColor: '#FFEBEE' }}
        actions={[]}
      >
        <Text style={{ color: theme.colors.error }}>{inferenceError}</Text>
      </Banner>

      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          {usingRealModel ? '🤖  Running ML Inference' : '🔬  Analysing Image'}
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          Please wait — do not close the app
        </Text>
      </View>

      <View style={styles.body}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={[styles.thumbnail, { borderColor: theme.colors.outline }]}
            resizeMode="cover"
          />
        )}

        {/* Real vs simulated badge */}
        <View
          style={[
            styles.modeBadge,
            {
              backgroundColor: usingRealModel ? '#E8F5E9' : '#FFF9C4',
            },
          ]}
        >
          <Text
            variant="labelSmall"
            style={{
              color: usingRealModel ? '#2E7D32' : '#F57F17',
              fontWeight: '700',
              letterSpacing: 0.4,
            }}
          >
            {usingRealModel ? '✓  REAL ML — TFLite on-device' : '⚙  SIMULATED'}
          </Text>
        </View>

        <Text
          variant="titleSmall"
          style={[styles.stepLabel, { color: theme.colors.onBackground }]}
        >
          {steps[stepIndex]}
        </Text>

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
    gap: 20,
  },
  thumbnail: {
    width: 200,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepLabel: { fontWeight: '600', textAlign: 'center' },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressBar: { width: '100%', height: 8, borderRadius: 4 },
});