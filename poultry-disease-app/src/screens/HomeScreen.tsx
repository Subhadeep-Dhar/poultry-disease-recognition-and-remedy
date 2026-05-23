import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { AppCard } from '../components/AppCard';
import { SectionHeader } from '../components/SectionHeader';
import { useAppStore } from '../store/appStore';

type Props = ScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const diseases = useAppStore((s) => s.diseases);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const devRoutes = [
    {
      label: 'Symptoms Screen',
      onPress: () => navigation.navigate('Symptoms'),
    },
    {
      label: 'Image Selection Screen',
      onPress: () =>
        navigation.navigate('ImageSelection', { mode: 'gallery' }),
    },
    {
      label: 'Analysis Screen',
      onPress: () => navigation.navigate('Analysis'),
    },
    {
      label: 'Result Screen',
      onPress: () => navigation.navigate('Result'),
    },
    {
      label: 'Remedy Screen',
      onPress: () => navigation.navigate('Remedy'),
    },
  ];

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* ── Header Banner ── */}
      <View
        style={[styles.banner, { backgroundColor: theme.colors.primary }]}
      >
        <Text variant="headlineSmall" style={styles.bannerTitle}>
          Poultry Health 🐓
        </Text>
        <Text variant="bodySmall" style={styles.bannerSubtitle}>
          Ranikhet Disease Detection
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Quick Actions ── */}
        <SectionHeader
          title="Quick Actions"
          subtitle="Start a detection session or browse diseases"
        />

        <AppCard
          title="🔍  Detect Disease"
          subtitle="Upload or capture a photo for analysis"
          onPress={() => navigation.navigate('DiseaseDetection')}
          rightIcon="chevron-right"
        />

        <AppCard
          title="🖼️  Disease Gallery"
          subtitle="Browse annotated reference images"
          onPress={() => navigation.navigate('DiseaseGallery')}
          rightIcon="chevron-right"
        />

        <AppCard
          title="📋  Reports"
          subtitle="View past detection sessions"
          onPress={() => navigation.navigate('Reports')}
          rightIcon="chevron-right"
        />

        <Divider style={styles.divider} />

        {/* ── Disease Registry ── */}
        <SectionHeader
          title="Disease Registry"
          subtitle={`${diseases.length} disease(s) in database`}
        />

        {diseases.map((disease) => (
          <AppCard
            key={disease.id}
            title={disease.name}
            subtitle={`${disease.localName}  ·  ${disease.imageCount} reference images`}
            onPress={() => {
              setSelectedDisease(disease);
              navigation.navigate('AboutDisease');
            }}
            rightIcon="chevron-right"
          />
        ))}

        <Divider style={styles.divider} />

        {/* ── Dev Nav (remove in production) ── */}
        <SectionHeader
          title="Dev Navigator"
          subtitle="Tap any screen to verify navigation — remove before release"
        />

        {devRoutes.map(({ label, onPress }) => (
          <Button
            key={label}
            mode="outlined"
            style={styles.devButton}
            onPress={onPress}
          >
            {label}
          </Button>
        ))}

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#FFFFFFBB',
    marginTop: 2,
  },
  scroll: {
    paddingTop: 4,
  },
  divider: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  devButton: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
});