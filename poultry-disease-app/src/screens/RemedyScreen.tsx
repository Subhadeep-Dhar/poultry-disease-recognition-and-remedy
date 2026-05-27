import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';
import { ScreenBanner } from '../components/ScreenBanner';
import { AnimatedCard } from '../components/AnimatedCard';
import { useAudio } from '../utils/audioHelpers';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'Remedy'>;

const AUDIO_ASSETS: Record<string, any> = {
  'ranikhet_remedy_hi.mp3': require('../../assets/audio/hindi_remedy/ranikhet_remedy_hi.mp3'),
};

function RemedyAudioPlayer({ audioFileRef }: { audioFileRef: string }) {
  const theme = useTheme();
  const asset = AUDIO_ASSETS[audioFileRef] || null;
  const { status, error, play, pause } = useAudio(asset);

  const handlePress = () => {
    if (status === 'playing') pause();
    else play();
  };

  let iconName = 'play-circle';
  let label = 'Play in Hindi';
  let color = theme.colors.primary;
  let bg = theme.colors.primaryContainer;

  if (status === 'loading') {
    iconName = 'loading';
    label = 'Loading\u2026';
    color = theme.colors.onSurfaceVariant;
    bg = theme.colors.surfaceVariant;
  } else if (status === 'playing') {
    iconName = 'pause-circle';
    label = 'Pause';
  } else if (status === 'paused') {
    iconName = 'play-circle';
    label = 'Resume';
  } else if (status === 'error' || !asset) {
    iconName = 'alert-circle';
    label = 'Audio Unavailable';
    color = theme.colors.error;
    bg = theme.colors.errorContainer;
  }

  return (
    <View style={styles.audioSection}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={status === 'loading' || status === 'error' || !asset}
        activeOpacity={0.7}
        style={[styles.audioChip, { backgroundColor: bg }]}
      >
        <MaterialCommunityIcons name={iconName as any} size={20} color={color} />
        <Text variant="labelMedium" style={[styles.audioLabel, { color }]}>
          {label}
        </Text>
      </TouchableOpacity>
      {(status === 'error' || !asset) && (
        <Text variant="bodySmall" style={[styles.audioErrorText, { color: theme.colors.error }]}>
          {error || 'Audio file not found in assets.'}
        </Text>
      )}
    </View>
  );
}

export default function RemedyScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  if (!disease) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="medical-bag" size={48} color={theme.colors.onSurfaceVariant} />
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
      <ScreenBanner icon="medical-bag" title={`Remedies for ${disease.name}`} subtitle={disease.localName} />

      <SectionHeader title="Recommended Actions" subtitle={`${disease.remedies.length} remedies available`} />

      <View style={styles.listContainer}>
        {disease.remedies.map((remedy, index) => (
          <AnimatedCard key={remedy.id} delay={index * 100}>
            <View style={styles.cardContent}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                {index + 1}. {remedy.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, lineHeight: 22 }}>
                {remedy.description}
              </Text>
              {remedy.audioFileRef && <RemedyAudioPlayer audioFileRef={remedy.audioFileRef} />}
            </View>
          </AnimatedCard>
        ))}
      </View>

      <View style={[styles.disclaimer, { backgroundColor: theme.colors.secondaryContainer }]}>
        <MaterialCommunityIcons name="information" size={20} color={theme.colors.secondary} />
        <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, flex: 1, lineHeight: 18 }}>
          These remedies are advisory only. Always consult a licensed veterinarian for diagnosis and treatment.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  scroll: { paddingTop: 0 },
  listContainer: { paddingBottom: spacing.sm },
  cardContent: { padding: spacing.md },
  audioSection: { marginTop: spacing.md, gap: spacing.xs },
  audioChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: borderRadius.full, gap: 6 },
  audioLabel: { fontWeight: '600' },
  audioErrorText: { fontStyle: 'italic' },
  disclaimer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginTop: spacing.lg, padding: spacing.md, borderRadius: borderRadius.md, gap: spacing.sm },
});