import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Chip, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { isModelReady } from '../ml/inferenceEngine';

type Props = ScreenProps<'Result'>;

// Confidence thresholds
const confidenceLabel = (score: number): string => {
  if (score >= 80) return 'High Confidence';
  if (score >= 55) return 'Moderate Confidence';
  return 'Low Confidence';
};

const confidenceColor = (score: number): string => {
  if (score >= 80) return '#2E7D32';
  if (score >= 55) return '#EF6C00';
  return '#C62828';
};

export default function ResultScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const result = useAppStore((s) => s.analysisResult);
  const disease = useAppStore((s) => s.selectedDisease);

  if (!result || !disease) {
    return (
      <View style={styles.guardContainer}>
        <Text variant="bodyLarge">No analysis result found.</Text>
        <Button onPress={() => navigation.navigate('Home')}>Go Home</Button>
      </View>
    );
  }

  const matchedSymptoms = disease.symptoms.filter((s) =>
    result.matchedSymptomIds.includes(s.id)
  );

  const labelColor = confidenceColor(result.confidence);
  const label = confidenceLabel(result.confidence);
  const analysedDate = new Date(result.analysedAt).toLocaleString();
  const usedRealModel = isModelReady();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Result Hero */}
      <View style={[styles.hero, { backgroundColor: labelColor }]}>
        <Text variant="headlineSmall" style={styles.heroDisease}>
          {result.diseaseName}
        </Text>
        <View style={styles.confidenceRow}>
          <Text variant="displaySmall" style={styles.confidenceScore}>
            {result.confidence}%
          </Text>
          <View>
            <Text variant="bodyLarge" style={styles.confidenceLabel}>
              {label}
            </Text>
            <Text variant="bodySmall" style={styles.analysedAt}>
              {analysedDate}
            </Text>
          </View>
        </View>

        <View style={styles.simulatedBadge}>
          <Text variant="labelSmall" style={styles.simulatedText}>
            {usedRealModel
              ? '✓  REAL ML — TFLite on-device inference'
              : '⚙️  SIMULATED — add model to assets/models/ to enable ML'}
          </Text>
        </View>
      </View>

      {/* Analysed Image */}
      <SectionHeader title="Analysed Image" />
      <Image
        source={{ uri: result.imageUri }}
        style={[styles.resultImage, { borderColor: theme.colors.outline }]}
        resizeMode="cover"
      />

      <Divider style={styles.divider} />

      {/* Matched Symptoms */}
      <SectionHeader
        title="Matched Symptoms"
        subtitle={`${matchedSymptoms.length} symptom(s) detected`}
      />
      {matchedSymptoms.length === 0 ? (
        <Text
          variant="bodyMedium"
          style={{ marginHorizontal: 16, color: theme.colors.onSurfaceVariant }}
        >
          No specific symptoms matched.
        </Text>
      ) : (
        matchedSymptoms.map((s) => (
          <View key={s.id} style={styles.symptomRow}>
            <Text style={styles.bullet}>•</Text>
            <Text
              variant="bodyMedium"
              style={{ flex: 1, color: theme.colors.onBackground }}
            >
              {s.description}
            </Text>
            <Chip compact style={{ backgroundColor: '#FFEBEE' }}>
              <Text variant="labelSmall" style={{ color: '#C62828' }}>
                {s.severity}
              </Text>
            </Chip>
          </View>
        ))
      )}

      <Divider style={styles.divider} />

      {/* Actions */}
      <SectionHeader title="Next Steps" />

      <Button
        mode="contained"
        style={styles.actionButton}
        onPress={() => navigation.navigate('Remedy')}
        icon="medical-bag"
      >
        View Remedies
      </Button>

      <Button
        mode="contained-tonal"
        style={styles.actionButton}
        onPress={() => navigation.navigate('AboutDisease')}
        icon="information-outline"
      >
        About {disease.name}
      </Button>

      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={() => {
          navigation.navigate('DiseaseDetection');
        }}
        icon="camera-retake"
      >
        New Detection
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  guardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scroll: {},
  hero: {
    padding: 20,
    gap: 12,
  },
  heroDisease: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  confidenceScore: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  confidenceLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  analysedAt: {
    color: '#FFFFFFBB',
  },
  simulatedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#00000033',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  simulatedText: {
    color: '#FFFFFFCC',
    letterSpacing: 0.4,
  },
  resultImage: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
  },
  divider: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 22,
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 10,
  },
});