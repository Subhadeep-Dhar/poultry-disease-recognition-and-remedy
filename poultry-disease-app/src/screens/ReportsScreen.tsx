import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  ActivityIndicator,
  Dialog,
  Portal,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { ScreenProps } from '../navigation/types';
import { useAppStore, type AnalysisResult } from '../store/appStore';
import { loadReports, clearReports } from '../utils/reportsStorage';
import { getDiseaseById } from '../data/diseases';
import { SectionHeader } from '../components/SectionHeader';

type Props = ScreenProps<'Reports'>;

const confidenceColor = (score: number): string => {
  if (score >= 80) return '#2E7D32';
  if (score >= 55) return '#EF6C00';
  return '#C62828';
};

export default function ReportsScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const [reports, setReports] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearDialogVisible, setClearDialogVisible] = useState(false);

  // Reload reports every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadReports().then((data) => {
        if (active) {
          setReports(data);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const handleOpenReport = (result: AnalysisResult) => {
    const disease = getDiseaseById(result.diseaseId);
    setAnalysisResult(result);
    if (disease) setSelectedDisease(disease);
    navigation.navigate('Result');
  };

  const handleClearAll = async () => {
    await clearReports();
    setReports([]);
    setClearDialogVisible(false);
  };

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          📋  Detection Reports
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          History of all completed analysis sessions
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onBackground, marginTop: 12 }}
          >
            Loading reports…
          </Text>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="headlineMedium" style={{ fontSize: 48 }}>
            📂
          </Text>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onBackground, marginTop: 8 }}
          >
            No Reports Yet
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              paddingHorizontal: 32,
              marginTop: 4,
            }}
          >
            Complete a disease detection session and your report will appear
            here.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('DiseaseDetection')}
            style={{ marginTop: 20 }}
            icon="camera"
          >
            Start Detection
          </Button>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <SectionHeader
              title="Past Sessions"
              subtitle={`${reports.length} report${reports.length !== 1 ? 's' : ''} saved`}
            />

            {reports.map((report, index) => {
              const disease = getDiseaseById(report.diseaseId);
              const date = new Date(report.analysedAt).toLocaleString();
              const color = confidenceColor(report.confidence);

              return (
                <Card
                  key={`${report.analysedAt}-${index}`}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  mode="elevated"
                  onPress={() => handleOpenReport(report)}
                >
                  <View style={styles.cardInner}>
                    {/* Thumbnail */}
                    <Image
                      source={{ uri: report.imageUri }}
                      style={[
                        styles.thumb,
                        { borderColor: theme.colors.outline },
                      ]}
                      resizeMode="cover"
                    />

                    {/* Content */}
                    <View style={styles.cardContent}>
                      <Text
                        variant="titleSmall"
                        style={{
                          color: theme.colors.onSurface,
                          fontWeight: '700',
                        }}
                        numberOfLines={1}
                      >
                        {report.diseaseName}
                      </Text>

                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {disease?.localName ?? ''}
                      </Text>

                      <View style={styles.chipRow}>
                        <Chip
                          compact
                          style={{ backgroundColor: color + '22' }}
                          textStyle={{ color, fontWeight: '700' }}
                        >
                          {report.confidence}% confidence
                        </Chip>
                      </View>

                      <Text
                        variant="labelSmall"
                        style={{
                          color: theme.colors.onSurfaceVariant,
                          marginTop: 2,
                        }}
                      >
                        {date}
                      </Text>
                    </View>

                    {/* Chevron */}
                    <Text
                      style={[
                        styles.chevron,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      ›
                    </Text>
                  </View>
                </Card>
              );
            })}
          </ScrollView>

          {/* Clear All FAB-style button pinned at bottom */}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: theme.colors.background,
                paddingBottom: insets.bottom + 12,
                borderTopColor: theme.colors.outline,
              },
            ]}
          >
            <Button
              mode="outlined"
              onPress={() => setClearDialogVisible(true)}
              icon="trash-can-outline"
              textColor={theme.colors.error}
              style={{ borderColor: theme.colors.error }}
            >
              Clear All Reports
            </Button>
          </View>
        </>
      )}

      {/* Confirm clear dialog */}
      <Portal>
        <Dialog
          visible={clearDialogVisible}
          onDismiss={() => setClearDialogVisible(false)}
        >
          <Dialog.Title>Clear All Reports?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will permanently delete all {reports.length} saved report
              {reports.length !== 1 ? 's' : ''}. This cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDialogVisible(false)}>Cancel</Button>
            <Button textColor={theme.colors.error} onPress={handleClearAll}>
              Delete All
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  bannerTitle: { color: '#FFFFFF', fontWeight: '700' },
  bannerSub: { color: '#FFFFFFBB' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  scroll: {},
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chevron: {
    fontSize: 24,
    paddingRight: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});