import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { SectionHeader } from '../components/SectionHeader';

type Props = ScreenProps<'Remedy'>;

export default function RemedyScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const disease = useAppStore((s) => s.selectedDisease);

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
      {/* ── Disease Context Banner ── */}
      <View
        style={[styles.banner, { backgroundColor: theme.colors.primary }]}
      >
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
            titleStyle={[
              styles.cardTitle,
              { color: theme.colors.onSurface },
            ]}
            titleNumberOfLines={2}
          />
          <Card.Content>
            <Text
              variant="bodyMedium"
              style={[
                styles.cardBody,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {remedy.description}
            </Text>

            {/* Audio placeholder — Phase 4 will wire expo-av here */}
            {remedy.audioFileRef ? (
              <View style={styles.audioRow}>
                <Chip
                  icon="volume-high"
                  mode="outlined"
                  onPress={() => {
                    // Phase 4: play remedy.audioFileRef via expo-av
                  }}
                  style={{ borderColor: theme.colors.primary }}
                  textStyle={{ color: theme.colors.primary }}
                >
                  Audio available (Hindi) — coming in Phase 4
                </Chip>
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
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerSub: {
    color: '#FFFFFFBB',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  cardBody: {
    lineHeight: 22,
  },
  audioRow: {
    marginTop: 12,
  },
  disclaimer: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF9C4',
  },
});