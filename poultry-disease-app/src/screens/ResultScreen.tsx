import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { isModelReady } from '../ml/inferenceEngine';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { spacing, borderRadius, getConfidenceColor, getConfidenceLabel, severityColors } from '../theme/appTheme';

type Props = ScreenProps<'Result'>;

export default function ResultScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const result = useAppStore((s) => s.analysisResult);
  const disease = useAppStore((s) => s.selectedDisease);

  if (!result || !disease) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="text-search" size={48} color={theme.colors.onSurfaceVariant} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
          No analysis result found.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')} style={{ marginTop: spacing.lg }} icon="home">
          Go Home
        </Button>
      </View>
    );
  }

  const matchedSymptoms = disease.symptoms.filter((s) => result.matchedSymptomIds.includes(s.id));
  const labelColor = getConfidenceColor(result.confidence);
  const label = getConfidenceLabel(result.confidence);
  const analysedDate = new Date(result.analysedAt).toLocaleString();
  const usedRealModel = FEATURE_FLAGS.ENABLE_REAL_ML && isModelReady();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
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
          <MaterialCommunityIcons name={usedRealModel ? 'check-circle-outline' : 'cog-outline'} size={14} color="#FFFFFFCC" style={{ marginRight: 4 }} />
          <Text variant="labelSmall" style={styles.simulatedText}>
            {usedRealModel ? 'REAL ML \u2014 TFLite inference' : 'SIMULATED \u2014 placeholder'}
          </Text>
        </View>
      </View>

      {/* Analysed Image */}
      <SectionHeader title="Analysed Image" />
      <Image source={{ uri: result.imageUri }} style={[styles.resultImage, { borderColor: theme.colors.outline }]} resizeMode="cover" />

      <Divider style={styles.divider} />

      {/* Matched Symptoms */}
      <SectionHeader title="Matched Symptoms" subtitle={`${matchedSymptoms.length} symptom(s) detected`} />
      <View style={styles.listContainer}>
        {matchedSymptoms.length === 0 ? (
          <Text variant="bodyMedium" style={{ marginHorizontal: spacing.md, color: theme.colors.onSurfaceVariant }}>
            No specific symptoms matched.
          </Text>
        ) : (
          matchedSymptoms.map((s, idx) => (
            <React.Fragment key={s.id}>
              <View style={styles.symptomRow}>
                <View style={[styles.severityDot, { backgroundColor: severityColors[s.severity] }]} />
                <Text variant="bodyMedium" style={{ flex: 1, color: theme.colors.onBackground }}>
                  {s.description}
                </Text>
                <View style={[styles.severityChip, { backgroundColor: severityColors[s.severity] + '14' }]}>
                  <Text variant="labelSmall" style={[styles.severityTag, { color: severityColors[s.severity] }]}>
                    {s.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              {idx < matchedSymptoms.length - 1 && <Divider style={styles.rowDivider} />}
            </React.Fragment>
          ))
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Actions */}
      <SectionHeader title="Next Steps" />
      <View style={styles.actions}>
        <Button mode="contained" style={styles.actionButton} onPress={() => navigation.navigate('Remedy')} icon="medical-bag">
          View Remedies
        </Button>
        <Button mode="contained-tonal" style={styles.actionButton} onPress={() => navigation.navigate('AboutDisease')} icon="information-outline">
          About {disease.name}
        </Button>
        <Button mode="outlined" style={styles.actionButton} onPress={() => navigation.navigate('DiseaseDetection')} icon="camera-retake">
          New Detection
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  scroll: { paddingTop: 0 },
  hero: { padding: spacing.lg, gap: spacing.md },
  heroDisease: { color: '#FFFFFF', fontWeight: '700' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  confidenceScore: { color: '#FFFFFF', fontWeight: '800' },
  confidenceLabel: { color: '#FFFFFF', fontWeight: '600' },
  analysedAt: { color: '#FFFFFFBB' },
  simulatedBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#00000033', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  simulatedText: { color: '#FFFFFFCC', letterSpacing: 0.4 },
  resultImage: { marginHorizontal: spacing.md, height: 200, borderRadius: borderRadius.md, borderWidth: 1 },
  divider: { marginHorizontal: spacing.md, marginTop: spacing.md },
  listContainer: { marginTop: spacing.sm },
  symptomRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  severityChip: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  severityTag: { fontWeight: '700', fontSize: 10, letterSpacing: 0.5 },
  rowDivider: { marginLeft: 36, marginRight: spacing.md },
  actions: { paddingHorizontal: spacing.md, marginTop: spacing.sm, gap: spacing.sm },
  actionButton: { width: '100%' },
});