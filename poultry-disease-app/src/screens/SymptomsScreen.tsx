import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Checkbox, Divider, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { ScreenBanner } from '../components/ScreenBanner';
import { spacing, borderRadius, severityColors } from '../theme/appTheme';

type Props = ScreenProps<'Symptoms'>;

export default function SymptomsScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);
  const setSelectedSymptomIds = useAppStore((s) => s.setSelectedSymptomIds);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleSymptom = (id: string) => {
    setChecked((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      setSelectedSymptomIds(Object.keys(updated).filter((k) => updated[k]));
      return updated;
    });
  };

  const checkedCount = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const hasSevereChecked = useMemo(() => {
    if (!disease) return false;
    return disease.symptoms.some((s) => checked[s.id] && s.severity === 'severe');
  }, [checked, disease]);

  if (!disease) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons name="clipboard-alert-outline" size={36} color={theme.colors.onSurfaceVariant} />
        </View>
        <Text variant="titleSmall" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
          No Disease Selected
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.btn} icon="home">
          Go Home
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScreenBanner
        icon="checkbox-marked-circle-outline"
        title="Symptom Checker"
        subtitle={`Select observed symptoms for ${disease.name}`}
      />

      {hasSevereChecked && (
        <View style={[styles.warningBanner, { backgroundColor: theme.colors.errorContainer }]}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} />
          <Text variant="bodySmall" style={[styles.warningText, { color: theme.colors.error }]}>
            One or more severe symptoms selected. Seek veterinary advice and view remedies immediately.
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Symptom List" subtitle="Tick all symptoms you have observed in your flock" />

        <View style={styles.listContainer}>
          {disease.symptoms.map((symptom, index) => (
            <React.Fragment key={symptom.id}>
              <View style={styles.symptomRow}>
                <Checkbox.Android
                  status={checked[symptom.id] ? 'checked' : 'unchecked'}
                  onPress={() => toggleSymptom(symptom.id)}
                  color={theme.colors.primary}
                />
                <View style={[styles.severityDot, { backgroundColor: severityColors[symptom.severity] }]} />
                <View style={styles.symptomContent}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
                    {symptom.description}
                  </Text>
                </View>
                <View style={[styles.severityChip, { backgroundColor: severityColors[symptom.severity] + '14' }]}>
                  <Text variant="labelSmall" style={[styles.severityTag, { color: severityColors[symptom.severity] }]}>
                    {symptom.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              {index < disease.symptoms.length - 1 && <Divider style={styles.rowDivider} />}
            </React.Fragment>
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.summary}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
            {checkedCount === 0 ? 'No symptoms selected yet.' : `${checkedCount} of ${disease.symptoms.length} symptoms selected.`}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            style={styles.actionButton}
            disabled={checkedCount === 0}
            onPress={() => navigation.navigate('Remedy')}
            icon="medical-bag"
          >
            View Recommended Remedies
          </Button>
          <Button mode="outlined" style={styles.actionButton} onPress={() => { setChecked({}); setSelectedSymptomIds([]); }} icon="refresh">
            Clear Selection
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  btn: { marginTop: spacing.lg, width: '100%' },
  scroll: { paddingTop: 0 },
  warningBanner: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  warningText: { flex: 1, fontWeight: '600' },
  listContainer: { marginTop: spacing.sm },
  symptomRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, gap: spacing.xs },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginLeft: spacing.xs, marginRight: spacing.sm },
  symptomContent: { flex: 1 },
  severityChip: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  severityTag: { fontWeight: '700', fontSize: 10, letterSpacing: 0.5 },
  rowDivider: { marginLeft: 64, marginRight: spacing.md },
  divider: { marginHorizontal: spacing.md, marginTop: spacing.md },
  summary: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  actions: { paddingHorizontal: spacing.md, gap: spacing.sm },
  actionButton: { width: '100%' },
});