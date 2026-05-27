import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { spacing, borderRadius, severityColors } from '../theme/appTheme';

type Props = ScreenProps<'AboutDisease'>;

export default function AboutDiseaseScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  if (!disease) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="book-remove-multiple-outline" size={48} color={theme.colors.onSurfaceVariant} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
          No disease selected.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')} style={{ marginTop: spacing.lg }} icon="home">
          Go Home
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <View style={[styles.hero, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.heroInner}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <MaterialCommunityIcons name="virus-outline" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.heroTextContainer}>
            <Text variant="headlineSmall" style={styles.heroTitle}>
              {disease.name}
            </Text>
            <Text variant="bodyLarge" style={styles.heroSubtitle}>
              {disease.localName}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.secondary }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSecondary, fontWeight: '700' }}>
            {disease.imageCount} REF IMAGES
          </Text>
        </View>
      </View>

      {/* Overview */}
      <SectionHeader title="Overview" />
      <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onBackground }]}>
        {disease.description}
      </Text>

      {/* Affects */}
      <SectionHeader title="Affects" />
      <View style={styles.chipRow}>
        {disease.species.map((spec) => (
          <View key={spec} style={[styles.chip, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons name="bird" size={16} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'capitalize' }}>
              {spec}
            </Text>
          </View>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Key Symptoms Overview */}
      <SectionHeader title="Key Symptoms" subtitle={`${disease.symptoms.length} known symptoms`} />
      <View style={styles.listContainer}>
        {disease.symptoms.slice(0, 5).map((symptom, idx) => (
          <React.Fragment key={symptom.id}>
            <View style={styles.symptomRow}>
              <View style={[styles.severityDot, { backgroundColor: severityColors[symptom.severity] }]} />
              <Text variant="bodyMedium" style={{ flex: 1, color: theme.colors.onBackground }}>
                {symptom.description}
              </Text>
              <View style={[styles.severityChip, { backgroundColor: severityColors[symptom.severity] + '14' }]}>
                <Text variant="labelSmall" style={[styles.severityTag, { color: severityColors[symptom.severity] }]}>
                  {symptom.severity.toUpperCase()}
                </Text>
              </View>
            </View>
            {idx < Math.min(disease.symptoms.length, 5) - 1 && <Divider style={styles.rowDivider} />}
          </React.Fragment>
        ))}
        {disease.symptoms.length > 5 && (
          <Text variant="bodySmall" style={{ marginHorizontal: spacing.md, marginTop: spacing.sm, color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
            + {disease.symptoms.length - 5} more symptoms
          </Text>
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Actions */}
      <SectionHeader title="Disease Actions" />
      <View style={styles.actions}>
        <Button mode="contained" style={styles.actionButton} onPress={() => navigation.navigate('Symptoms')} icon="checkbox-marked-circle-outline">
          Check Symptoms
        </Button>
        <Button mode="contained-tonal" style={styles.actionButton} onPress={() => navigation.navigate('Remedy')} icon="medical-bag">
          View Remedies
        </Button>
        <Button mode="outlined" style={styles.actionButton} onPress={() => navigation.navigate('DiseaseGallery')} icon="image-multiple-outline">
          Disease Gallery
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  scroll: { paddingTop: 0 },
  hero: { padding: spacing.lg, gap: spacing.md },
  heroInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  heroTextContainer: { flex: 1 },
  heroTitle: { color: '#FFFFFF', fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full },
  description: { marginHorizontal: spacing.md, lineHeight: 22 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: spacing.md, gap: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: borderRadius.md, gap: 4 },
  divider: { marginHorizontal: spacing.md, marginTop: spacing.lg },
  listContainer: { marginTop: spacing.xs },
  symptomRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  severityChip: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  severityTag: { fontWeight: '700', fontSize: 10, letterSpacing: 0.5 },
  rowDivider: { marginLeft: 36, marginRight: spacing.md },
  actions: { paddingHorizontal: spacing.md, marginTop: spacing.xs, gap: spacing.sm },
  actionButton: { width: '100%' },
});