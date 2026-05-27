import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { getAllDiseases } from '../services/diseaseService';
import { SectionHeader } from '../components/SectionHeader';
import { ScreenBanner } from '../components/ScreenBanner';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'DiseaseGallery'>;

export default function DiseaseGalleryScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const selectedDisease = useAppStore((s) => s.selectedDisease);
  const diseases = getAllDiseases();
  
  const displayDisease = selectedDisease || diseases[0];

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  // Subtracting horizontal padding and gaps
  const availableWidth = screenWidth - (spacing.md * 2) - (spacing.sm * (numColumns - 1));
  const tileSize = availableWidth / numColumns;

  // Generate an array of dummy indices for the grid
  const imagePlaceholders = useMemo(() => {
    if (!displayDisease) return [];
    return Array.from({ length: displayDisease.imageCount }, (_, i) => i + 1);
  }, [displayDisease]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBanner
        icon="image-multiple-outline"
        title="Disease Gallery"
        subtitle={displayDisease ? displayDisease.name : 'Reference Images'}
      />

      {displayDisease && (
        <>
          <SectionHeader
            title="Reference Images"
            subtitle={`${displayDisease.imageCount} annotated images available`}
          />

          <View style={styles.grid}>
            {imagePlaceholders.map((num) => (
              <PlaceholderImage
                key={num}
                width={tileSize}
                height={tileSize}
                label={`#${num}`}
              />
            ))}
          </View>
        </>
      )}

      <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.primary} />
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 20 }}>
          Real annotated images will replace these placeholders when the image asset pipeline is connected in Phase 3.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 0 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
});