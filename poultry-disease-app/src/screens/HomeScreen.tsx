import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Divider, useTheme, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { SectionHeader } from '../components/SectionHeader';
import { IconButtonCard } from '../components/IconButtonCard';
import { useAppStore } from '../store/appStore';
import { getAllDiseases } from '../services/diseaseService';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);
  const diseases = getAllDiseases();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [headerOpacity, headerTranslate]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: theme.colors.primary, opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View style={styles.headerInner}>
          <View style={[styles.logoMark, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <MaterialCommunityIcons name="bird" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text variant="titleMedium" style={styles.headerTitle}>
              Poultry Health
            </Text>
            <Text variant="labelSmall" style={styles.headerSub}>
              Disease Detection System
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats strip ── */}
        <Surface style={[styles.statsStrip, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {diseases.length}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Diseases
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {diseases.reduce((acc, d) => acc + d.symptoms.length, 0)}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Symptoms
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {diseases.reduce((acc, d) => acc + d.imageCount, 0)}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Images
            </Text>
          </View>
        </Surface>

        {/* ── Quick Actions ── */}
        <SectionHeader
          title="Quick Actions"
          subtitle="Start a detection session or browse the database"
        />

        <IconButtonCard
          icon="camera-outline"
          title="Detect Disease"
          subtitle="Upload or capture a photo for AI-assisted analysis"
          onPress={() => navigation.navigate('DiseaseDetection')}
        />
        <IconButtonCard
          icon="image-multiple-outline"
          title="Disease Gallery"
          subtitle="Browse annotated reference image library"
          onPress={() => navigation.navigate('DiseaseGallery')}
        />
        <IconButtonCard
          icon="file-document-outline"
          title="Detection Reports"
          subtitle="Review history of completed analysis sessions"
          onPress={() => navigation.navigate('Reports')}
        />

        <Divider style={styles.divider} />

        {/* ── Disease Registry ── */}
        <SectionHeader
          title="Disease Registry"
          subtitle={`${diseases.length} disease${diseases.length !== 1 ? 's' : ''} in local database`}
        />

        {diseases.map((disease, index) => (
          <IconButtonCard
            key={disease.id}
            icon="virus-outline"
            title={disease.name}
            subtitle={`${disease.localName}  ·  ${disease.imageCount} reference images`}
            onPress={() => {
              setSelectedDisease(disease);
              navigation.navigate('AboutDisease');
            }}
            iconColor={theme.colors.secondary}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  scroll: { paddingTop: spacing.sm },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 4 },
  divider: { marginHorizontal: spacing.md, marginTop: spacing.sm },
});