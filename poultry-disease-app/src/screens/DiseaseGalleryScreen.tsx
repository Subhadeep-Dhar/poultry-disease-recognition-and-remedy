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
import { GalleryTile } from '../components/GalleryTile';
import { getGalleryImages } from '../data/imageRegistry';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'DiseaseGallery'>;

const NUM_COLUMNS = 3;

export default function DiseaseGalleryScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const selectedDisease = useAppStore((s) => s.selectedDisease);
  const diseases = getAllDiseases();

  const displayDisease = selectedDisease || diseases[0];

  const screenWidth = Dimensions.get('window').width;

  const availableWidth =
    screenWidth -
    spacing.md * 2 -
    spacing.sm * (NUM_COLUMNS - 1);

  const tileSize = Math.floor(
    availableWidth / NUM_COLUMNS
  );

  const galleryImages = useMemo(() => {
    if (!displayDisease) return [];
    return getGalleryImages(displayDisease.id);
  }, [displayDisease]);

  const totalCount =
    displayDisease?.imageCount ?? 0;

  return (
    <ScrollView
      style={{
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={[
        styles.scroll,
        {
          paddingBottom:
            insets.bottom + spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBanner
        icon="image-multiple-outline"
        title="Disease Gallery"
        subtitle={
          displayDisease
            ? displayDisease.name
            : 'Reference Images'
        }
      />

      {displayDisease && (
        <>
          <SectionHeader
            title="Reference Images"
            subtitle={
              galleryImages.length > 0
                ? `${galleryImages.length} of ${totalCount} images loaded`
                : `${totalCount} images available`
            }
          />

          <View style={styles.grid}>
            {galleryImages.length > 0 ? (
              galleryImages.map(
                (source, index) => (
                  <GalleryTile
                    key={index}
                    source={source}
                    size={tileSize}
                    label={`#${index + 1}`}
                  />
                )
              )
            ) : (
              Array.from(
                { length: totalCount },
                (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.placeholder,
                      {
                        width: tileSize,
                        height: tileSize,
                        backgroundColor:
                          theme.colors
                            .surfaceVariant,
                        borderColor:
                          theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      variant="labelSmall"
                      style={{
                        color:
                          theme.colors
                            .onSurfaceVariant,
                      }}
                    >
                      #{i + 1}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
        </>
      )}

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor:
              theme.colors.surfaceVariant,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={theme.colors.primary}
        />

        <Text
          variant="bodySmall"
          style={{
            color:
              theme.colors.onSurfaceVariant,
            flex: 1,
            lineHeight: 20,
          }}
        >
          {galleryImages.length > 0
            ? `Showing ${galleryImages.length} annotated reference images for ${displayDisease?.name}.`
            : `Reference images will appear here when registered in imageRegistry.ts.`}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 0,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },

  placeholder: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
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