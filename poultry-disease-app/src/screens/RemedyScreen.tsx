import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';

type Props = ScreenProps<'Remedy'>;

// Map audio file refs to require() calls.
// When you add a real MP3 to assets/audio/, add its entry here.
// Phase 5 ships with a placeholder — swap the require() path for the real file.
const AUDIO_ASSETS: Record<string, number | null> = {
  'ranikhet_remedy_hi.mp3': require('../../assets/audio/hindi_remedy/ranikhet_remedy_hi.mp3'),
};

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export default function RemedyScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

  // One sound instance shared across all remedy audio buttons
  const soundRef = useRef<Audio.Sound | null>(null);
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [activeAudioRef, setActiveAudioRef] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Unload sound on unmount to free resources
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setAudioState('idle');
    setActiveAudioRef(null);
    setAudioError(null);
  }, []);

  const handleAudioPress = useCallback(
    async (audioFileRef: string) => {
      setAudioError(null);

      // If this button is already playing → pause/resume toggle
      if (activeAudioRef === audioFileRef) {
        if (audioState === 'playing' && soundRef.current) {
          await soundRef.current.pauseAsync();
          setAudioState('paused');
          return;
        }
        if (audioState === 'paused' && soundRef.current) {
          await soundRef.current.playAsync();
          setAudioState('playing');
          return;
        }
      }

      // Stop any currently playing audio before starting new
      await stopAudio();

      const asset = AUDIO_ASSETS[audioFileRef];
      if (!asset) {
        setAudioError(
          `Audio file "${audioFileRef}" not yet added to assets/audio/. ` +
            'Drop the real MP3 there and uncomment the require() in RemedyScreen.'
        );
        setAudioState('error');
        setActiveAudioRef(audioFileRef);
        return;
      }

      setAudioState('loading');
      setActiveAudioRef(audioFileRef);

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(asset, {
          shouldPlay: true,
        });
        soundRef.current = sound;
        setAudioState('playing');

        // Auto-reset when playback finishes
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setAudioState('idle');
            setActiveAudioRef(null);
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
        });
      } catch (e) {
        setAudioError('Failed to play audio. Check the file and try again.');
        setAudioState('error');
      }
    },
    [activeAudioRef, audioState, stopAudio]
  );

  const audioButtonLabel = (ref: string): string => {
    if (activeAudioRef !== ref) return '▶  Play Hindi Audio';
    if (audioState === 'loading') return '⏳  Loading…';
    if (audioState === 'playing') return '⏸  Pause';
    if (audioState === 'paused') return '▶  Resume';
    if (audioState === 'error') return '⚠  Audio Unavailable';
    return '▶  Play Hindi Audio';
  };

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
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          Remedies for {disease.name}
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          {disease.localName}
        </Text>
      </View>

      <SectionHeader
        title="Recommended Actions"
        subtitle={`${disease.remedies.length} remedies available`}
      />

      {disease.remedies.map((remedy, index) => (
        <Card
          key={remedy.id}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          mode="elevated"
        >
          <Card.Title
            title={`${index + 1}. ${remedy.title}`}
            titleStyle={[styles.cardTitle, { color: theme.colors.onSurface }]}
            titleNumberOfLines={2}
          />
          <Card.Content>
            <Text
              variant="bodyMedium"
              style={[styles.cardBody, { color: theme.colors.onSurfaceVariant }]}
            >
              {remedy.description}
            </Text>

            {remedy.audioFileRef ? (
              <View style={styles.audioSection}>
                <Chip
                  icon={
                    activeAudioRef === remedy.audioFileRef &&
                    audioState === 'playing'
                      ? 'pause'
                      : activeAudioRef === remedy.audioFileRef &&
                        audioState === 'error'
                      ? 'alert-circle'
                      : 'volume-high'
                  }
                  mode="flat"
                  onPress={() => handleAudioPress(remedy.audioFileRef!)}
                  style={[
                    styles.audioChip,
                    {
                      backgroundColor:
                        activeAudioRef === remedy.audioFileRef &&
                        audioState === 'error'
                          ? '#FFEBEE'
                          : '#E8F5E9',
                    },
                  ]}
                  textStyle={{
                    color:
                      activeAudioRef === remedy.audioFileRef &&
                      audioState === 'error'
                        ? theme.colors.error
                        : theme.colors.primary,
                  }}
                >
                  {audioButtonLabel(remedy.audioFileRef)}
                </Chip>

                {/* Error message inline */}
                {activeAudioRef === remedy.audioFileRef &&
                  audioState === 'error' &&
                  audioError && (
                    <Text
                      variant="bodySmall"
                      style={[styles.audioErrorText, { color: theme.colors.error }]}
                    >
                      {audioError}
                    </Text>
                  )}
              </View>
            ) : null}
          </Card.Content>
        </Card>
      ))}

      <View style={styles.disclaimer}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          ⚕️ These remedies are advisory only. Always consult a licensed
          veterinarian for diagnosis and treatment.
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
  bannerTitle: { color: '#FFFFFF', fontWeight: '700' },
  bannerSub: { color: '#FFFFFFBB' },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontWeight: '600', fontSize: 15 },
  cardBody: { lineHeight: 22 },
  audioSection: {
    marginTop: 12,
    gap: 6,
  },
  audioChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  audioErrorText: {
    lineHeight: 18,
    fontStyle: 'italic',
  },
  disclaimer: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF9C4',
  },
});