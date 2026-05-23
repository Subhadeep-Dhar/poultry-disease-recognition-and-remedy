import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Chip, Divider, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { PlaceholderImage } from '../components/PlaceholderImage';

type Props = ScreenProps<'AboutDisease'>;

const SEVERITY_COLOR: Record<string, string> = {
  mild: '#F9A825',
  moderate: '#EF6C00',
  severe: '#C62828',
};

export default function AboutDiseaseScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  // Guard: if no disease selected (e.g. deep link), go home
  if (!disease) {
    return (
      <View style={styles.guardContainer}>
        <Text variant="bodyLarge">No disease selected.</Text>
        <Button onPress={() => navigation.navigate('Home')}>Go Home</Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Block ── */}
      <View
        style={[styles.hero, { backgroundColor: theme.colors.primary }]}
      >
        <PlaceholderImage width={88} height={88} label="Thumbnail" />
        <View style={styles.heroText}>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            {disease.name}
          </Text>
          <Text variant="bodyMedium" style={styles.heroLocal}>
            {disease.localName}
          </Text>
          <Text variant="bodySmall" style={styles.heroImages}>
            {disease.imageCount} reference images
          </Text>
        </View>
      </View>

      {/* ── Description ── */}
      <SectionHeader title="Overview" />
      <Text
        variant="bodyMedium"
        style={[styles.description, { color: theme.colors.onBackground }]}
      >
        {disease.description}
      </Text>

      {/* ── Species ── */}
      <SectionHeader title="Affects" />
      <View style={styles.chipRow}>
        {disease.species.map((s) => (
          <Chip key={s} style={styles.chip} compact>
            {s}
          </Chip>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* ── Symptoms Summary ── */}
      <SectionHeader
        title="Key Symptoms"
        subtitle={`${disease.symptoms.length} symptoms identified`}
      />
      {disease.symptoms.map((symptom) => (
        <View key={symptom.id} style={styles.symptomRow}>
          <View
            style={[
              styles.severityDot,
              { backgroundColor: SEVERITY_COLOR[symptom.severity] },
            ]}
          />
          <Text
            variant="bodyMedium"
            style={[styles.symptomText, { color: theme.colors.onBackground }]}
          >
            {symptom.description}
          </Text>
          <Text
            variant="labelSmall"
            style={[
              styles.severityLabel,
              { color: SEVERITY_COLOR[symptom.severity] },
            ]}
          >
            {symptom.severity}
          </Text>
        </View>
      ))}

      <Divider style={styles.divider} />

      {/* ── Action Buttons ── */}
      <SectionHeader title="Explore Further" />

      <Button
        mode="contained"
        style={styles.actionButton}
        onPress={() => navigation.navigate('Symptoms')}
        icon="checkbox-marked-circle-outline"
      >
        Check Symptoms
      </Button>

      <Button
        mode="contained-tonal"
        style={styles.actionButton}
        onPress={() => navigation.navigate('Remedy')}
        icon="medical-bag"
      >
        View Remedies
      </Button>

      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={() => navigation.navigate('DiseaseGallery')}
        icon="image-multiple-outline"
      >
        Disease Gallery
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroLocal: {
    color: '#FFFFFFCC',
  },
  heroImages: {
    color: '#FFFFFF99',
  },
  description: {
    marginHorizontal: 16,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  symptomText: {
    flex: 1,
    lineHeight: 20,
  },
  severityLabel: {
    textTransform: 'capitalize',
    fontWeight: '600',
    flexShrink: 0,
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 10,
  },
});