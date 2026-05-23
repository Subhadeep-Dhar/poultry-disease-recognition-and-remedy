import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { PlaceholderImage } from '../components/PlaceholderImage';

type Props = ScreenProps<'DiseaseGallery'>;

// Grid config
const COLUMNS = 3;
const IMAGE_SIZE = 100;

export default function DiseaseGalleryScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  // Fallback: show all diseases if no selection (gallery from Home)
  const diseases = useAppStore((s) => s.diseases);
  const displayDisease = disease ?? diseases[0];

  if (!displayDisease) {
    return (
      <View style={styles.guardContainer}>
        <Text variant="bodyLarge">No disease data found.</Text>
        <Button onPress={() => navigation.navigate('Home')}>Go Home</Button>
      </View>
    );
  }

  // Build placeholder tile array from imageCount
  const tiles = Array.from(
    { length: displayDisease.imageCount },
    (_, i) => i + 1
  );

  // Chunk into rows of COLUMNS
  const rows: number[][] = [];
  for (let i = 0; i < tiles.length; i += COLUMNS) {
    rows.push(tiles.slice(i, i + COLUMNS));
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
      {/* Banner */}
      <View
        style={[styles.banner, { backgroundColor: theme.colors.primary }]}
      >
        <Text variant="titleMedium" style={styles.bannerTitle}>
          {displayDisease.name} — Reference Images
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          {displayDisease.imageCount} annotated images · Phase 4: real images
        </Text>
      </View>

      <SectionHeader
        title="Image Gallery"
        subtitle="Each tile represents one annotated reference image"
      />

      {/* Grid */}
      <View style={styles.grid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((tileNum) => (
              <View key={tileNum} style={styles.tile}>
                <PlaceholderImage
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  label={`#${tileNum}`}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          🖼️  Real annotated images will replace these placeholders in Phase 4
          when the image asset pipeline is connected.
        </Text>
      </View>
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
  banner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerSub: {
    color: '#FFFFFFBB',
  },
  grid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {},
  note: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
});