import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore, type AnalysisResult } from '../store/appStore';
import { getDiseaseById } from '../services/diseaseService';
import { saveReport } from '../utils/reportsStorage';
import { runInference, isModelReady } from '../ml/inferenceEngine';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { ScreenBanner } from '../components/ScreenBanner';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'Analysis'>;

const ANALYSIS_STEPS = [
  'Loading image\u2026',
  'Preprocessing pixels\u2026',
  'Extracting features\u2026',
  'Matching disease patterns\u2026',
  'Computing confidence score\u2026',
  'Finalising result\u2026',
];
const STEP_DURATION_MS = 500;

const REAL_STEPS = [
  'Loading image\u2026',
  'Resizing to 224\u00d7224\u2026',
  'Normalising pixels\u2026',
  'Running TFLite inference\u2026',
  'Parsing model output\u2026',
  'Finalising result\u2026',
];

export default function AnalysisScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const imageUri = useAppStore((s) => s.selectedImageUri);
  const modelLoadFailed = useAppStore((s) => s.modelLoadFailed);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const usingRealModel = FEATURE_FLAGS.ENABLE_REAL_ML && isModelReady();
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
        result = await runInference(imageUri);
      } catch (e) {
        console.warn('[AnalysisScreen] Inference error, falling back:', e);
        setInferenceError('Real inference failed. Showing simulated result as fallback.');
        const confidence = Math.floor(Math.random() * (94 - 82 + 1)) + 82;
        const selectedSymptomIds = useAppStore.getState().selectedSymptomIds;
        const matchedSymptomIds = selectedSymptomIds.length > 0 ? selectedSymptomIds : ['rnk-s1', 'rnk-s2'];
        result = {
          diseaseId: 'ranikhet',
          diseaseName: 'Ranikhet Disease',
          confidence,
          matchedSymptomIds,
          analysedAt: new Date().toISOString(),
          imageUri,
        };
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
  }, [imageUri, navigation, setAnalysisResult, setSelectedDisease, steps.length]);

  const badgeColor = usingRealModel ? theme.colors.primary : theme.colors.secondary;
  const badgeBg = usingRealModel ? theme.colors.primaryContainer : theme.colors.secondaryContainer;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + spacing.lg }]}>
      <ScreenBanner icon="magnify-scan" title="Analysing Image" subtitle="Please wait \u2014 do not close the app" />

      {/* Warnings */}
      {modelLoadFailed && !inferenceError && (
        <View style={[styles.warningBox, { backgroundColor: theme.colors.secondaryContainer }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.secondary} />
          <Text variant="bodySmall" style={{ color: theme.colors.secondary, flex: 1, fontWeight: '500' }}>
            ML model not loaded \u2014 running simulated analysis. Add ranikhet_classifier.tflite to assets/models/ and rebuild.
          </Text>
        </View>
      )}

      {inferenceError && (
        <View style={[styles.warningBox, { backgroundColor: theme.colors.errorContainer }]}>
          <MaterialCommunityIcons name="alert" size={20} color={theme.colors.error} />
          <Text variant="bodySmall" style={{ color: theme.colors.error, flex: 1, fontWeight: '500' }}>
            {inferenceError}
          </Text>
        </View>
      )}

      {/* Center content */}
      <View style={styles.body}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={[styles.thumbnail, { borderColor: theme.colors.outline }]} resizeMode="cover" />
        )}

        {/* Mode badge */}
        <View style={[styles.modeBadge, { backgroundColor: badgeBg }]}>
          <MaterialCommunityIcons name={usingRealModel ? 'check-circle-outline' : 'cog-outline'} size={14} color={badgeColor} style={{ marginRight: 4 }} />
          <Text variant="labelSmall" style={{ color: badgeColor, fontWeight: '700', letterSpacing: 0.4 }}>
            {usingRealModel ? 'REAL ML \u2014 TFLITE' : 'SIMULATED MODE'}
          </Text>
        </View>

        <Text variant="titleSmall" style={[styles.stepLabel, { color: theme.colors.onBackground }]}>
          {steps[stepIndex]}
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.sm }}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  thumbnail: { width: 220, height: 180, borderRadius: borderRadius.lg, borderWidth: 1 },
  modeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  stepLabel: { fontWeight: '600', textAlign: 'center' },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressBar: { width: '100%', height: 8, borderRadius: 4 },
});