import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Checkbox,
  Divider,
  Button,
  Banner,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';

type Props = ScreenProps<'Symptoms'>;

const SEVERITY_COLOR: Record<string, string> = {
  mild: '#F9A825',
  moderate: '#EF6C00',
  severe: '#C62828',
};

export default function SymptomsScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  // Local UI state — which symptoms has the farmer ticked?
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleSymptom = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const hasSevereChecked = useMemo(() => {
    if (!disease) return false;
    return disease.symptoms.some(
      (s) => checked[s.id] && s.severity === 'severe'
    );
  }, [checked, disease]);

  if (!disease) {
    return (
      <View style={styles.guardContainer}>
        <Text variant="bodyLarge">No disease selected.</Text>
        <Button onPress={() => navigation.navigate('Home')}>Go Home</Button>
      </View>
    );
  }

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      {/* Urgent warning banner */}
      <Banner
        visible={hasSevereChecked}
        icon="alert-circle"
        actions={[
          {
            label: 'View Remedies',
            onPress: () => navigation.navigate('Remedy'),
          },
        ]}
        style={{ backgroundColor: '#FFEBEE' }}
      >
        <Text style={{ color: '#C62828' }}>
          One or more severe symptoms selected. Seek veterinary advice and view
          remedies immediately.
        </Text>
      </Banner>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title={`Symptoms — ${disease.name}`}
          subtitle="Tick all symptoms you have observed in your flock"
        />

        {disease.symptoms.map((symptom, index) => (
          <React.Fragment key={symptom.id}>
            <View style={styles.symptomRow}>
              <Checkbox
                status={checked[symptom.id] ? 'checked' : 'unchecked'}
                onPress={() => toggleSymptom(symptom.id)}
                color={SEVERITY_COLOR[symptom.severity]}
              />
              <View style={styles.symptomContent}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onBackground }}
                >
                  {symptom.description}
                </Text>
                <Text
                  variant="labelSmall"
                  style={[
                    styles.severityTag,
                    { color: SEVERITY_COLOR[symptom.severity] },
                  ]}
                >
                  {symptom.severity.toUpperCase()}
                </Text>
              </View>
            </View>
            {index < disease.symptoms.length - 1 && (
              <Divider style={styles.rowDivider} />
            )}
          </React.Fragment>
        ))}

        <Divider style={styles.divider} />

        {/* Summary + CTA */}
        <View style={styles.summary}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onBackground }}
          >
            {checkedCount === 0
              ? 'No symptoms selected yet.'
              : `${checkedCount} of ${disease.symptoms.length} symptoms selected.`}
          </Text>
        </View>

        <Button
          mode="contained"
          style={styles.actionButton}
          disabled={checkedCount === 0}
          onPress={() => navigation.navigate('Remedy')}
          icon="medical-bag"
        >
          View Recommended Remedies
        </Button>

        <Button
          mode="outlined"
          style={styles.actionButton}
          onPress={() => {
            setChecked({});
          }}
          icon="refresh"
        >
          Clear All
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  guardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  root: {
    flex: 1,
  },
  scroll: {},
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  symptomContent: {
    flex: 1,
    gap: 2,
  },
  severityTag: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rowDivider: {
    marginLeft: 60,
  },
  divider: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 10,
  },
});