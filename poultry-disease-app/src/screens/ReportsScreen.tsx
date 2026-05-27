import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScreenProps } from '../navigation/types';
import { useAppStore, type AnalysisResult } from '../store/appStore';
import { loadReports, clearReports } from '../utils/reportsStorage';
import { getDiseaseById } from '../services/diseaseService';
import { ScreenBanner } from '../components/ScreenBanner';
import { SectionHeader } from '../components/SectionHeader';
import { AnimatedCard } from '../components/AnimatedCard';
import { StatusBadge } from '../components/StatusBadge';
import { spacing, borderRadius } from '../theme/appTheme';

type Props = ScreenProps<'Reports'>;

export default function ReportsScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const setSelectedDisease = useAppStore((s) => s.setSelectedDisease);

  const [reports, setReports] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
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

  const handleOpenReport = (report: AnalysisResult) => {
    const disease = getDiseaseById(report.diseaseId);
    if (!disease) {
      Alert.alert('Error', 'Disease data not found for this report.');
      return;
    }
    setAnalysisResult(report);
    setSelectedDisease(disease);
    navigation.navigate('Result');
  };

  const handleClear = () => {
    Alert.alert(
      'Clear All Reports',
      'Are you sure you want to delete all detection history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await clearReports();
            setReports([]);
            setLoading(false);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScreenBanner
        icon="file-document-outline"
        title="Detection Reports"
        subtitle="History of your previous analysis sessions"
      />

      {reports.length === 0 ? (
        <View style={styles.centered}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
            No Reports Yet
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.xl }}>
            Start a new detection session to see your history here.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('DiseaseDetection')}
            style={{ marginTop: spacing.lg, width: '80%' }}
            icon="camera-outline"
          >
            Start Detection
          </Button>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}
          >
            <SectionHeader title="Recent Activity" subtitle={`${reports.length} report${reports.length !== 1 ? 's' : ''} found`} />
            
            {reports.map((report, idx) => {
              const disease = getDiseaseById(report.diseaseId);
              return (
                <AnimatedCard
                  key={`${report.analysedAt}-${idx}`}
                  delay={idx * 50}
                  onPress={() => handleOpenReport(report)}
                  style={styles.card}
                >
                  <View style={styles.cardInner}>
                    <Image source={{ uri: report.imageUri }} style={styles.thumbnail} resizeMode="cover" />
                    <View style={styles.cardBody}>
                      <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }} numberOfLines={1}>
                        {report.diseaseName}
                      </Text>
                      {disease && (
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }} numberOfLines={1}>
                          {disease.localName}
                        </Text>
                      )}
                      <StatusBadge score={report.confidence} compact />
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
                        {new Date(report.analysedAt).toLocaleDateString()} at {new Date(report.analysedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} style={styles.chevron} />
                  </View>
                </AnimatedCard>
              );
            })}
          </ScrollView>

          {/* Fixed bottom action */}
          <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md, backgroundColor: theme.colors.background }]}>
            <Button mode="outlined" onPress={handleClear} textColor={theme.colors.error} style={{ borderColor: theme.colors.error }} icon="delete-outline">
              Clear All Reports
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingTop: 0 },
  card: { marginVertical: 6 },
  cardInner: { flexDirection: 'row', padding: spacing.sm, alignItems: 'center' },
  thumbnail: { width: 72, height: 72, borderRadius: borderRadius.sm, backgroundColor: '#EEE' },
  cardBody: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
  chevron: { marginLeft: spacing.sm, marginRight: 4 },
  bottomAction: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
});