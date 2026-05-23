import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { getDiseaseById } from '../data/diseases';
import type { AnalysisResult } from '../store/appStore';
import { saveReport } from '../utils/reportsStorage';
import { diagnoseDisease } from '../services/diagnosisEngine';

type Props = ScreenProps<'Analysis'>;

const ANALYSIS_STEPS = [
  'Loading image…',
  'Preprocessing pixels…',
  'Extracting features…',
  'Matching disease patterns…',
  'Computing confidence score…',
  'Finalising result…',
];

const STEP_DURATION_MS = 500;

async function runAnalysis(imageUri: string): Promise<AnalysisResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, ANALYSIS_STEPS.length * STEP_DURATION_MS)
  );

  const diagnosis = diagnoseDisease();
  const disease = getDiseaseById(diagnosis.disease) ?? getDiseaseById('ranikhet');

  if (!disease) {
    throw new Error('Unable to resolve disease for analysis result');
  }

  return {
    diseaseId: disease.id,
    diseaseName: disease.name,
    confidence: Math.round(diagnosis.confidence * 100),
    matchedSymptomIds: disease.symptoms.slice(0, 3).map((symptom) => symptom.id),
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

  useEffect(() => {
    if (!imageUri) {
      navigation.replace('DiseaseDetection');
      return;
    }

    let isActive = true;
    let navigationTimeout: ReturnType<typeof setTimeout> | undefined;

    const stepInterval = setInterval(() => {
      if (!isActive) return;
      setStepIndex((prev) => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
      setProgress((prev) => Math.min(prev + 1 / ANALYSIS_STEPS.length, 1));
    }, STEP_DURATION_MS);

    runAnalysis(imageUri)
      .then(async (result) => {
        if (!isActive) return;

        clearInterval(stepInterval);
        setProgress(1);
        setStepIndex(ANALYSIS_STEPS.length - 1);

        await saveReport(result);

        setAnalysisResult(result);
        const disease = getDiseaseById(result.diseaseId);
        if (disease) setSelectedDisease(disease);

        navigationTimeout = setTimeout(() => {
          if (!isActive) return;
          navigation.replace('Result');
        }, 600);
      })
      .catch(() => {
        if (!isActive) return;
        clearInterval(stepInterval);
        navigation.replace('DiseaseDetection');
      });

    return () => {
      isActive = false;
      clearInterval(stepInterval);
      if (navigationTimeout) clearTimeout(navigationTimeout);
    };
  }, [imageUri, navigation, setAnalysisResult, setSelectedDisease]);

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
          🔬  Analysing Image
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

        <Text
          variant="titleSmall"
          style={[styles.stepLabel, { color: theme.colors.onBackground }]}
        >
          {ANALYSIS_STEPS[stepIndex]}
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

        <View style={styles.note}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
            }}
          >
            ⚙️  Your image is being processed by the local diagnosis flow.
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
  stepLabel: { fontWeight: '600', textAlign: 'center' },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressBar: { width: '100%', height: 8, borderRadius: 4 },
  note: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    width: '100%',
  },
});