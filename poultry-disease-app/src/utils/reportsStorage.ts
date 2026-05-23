import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisResult } from '../store/appStore';

const REPORTS_KEY = '@poultry:reports';

export async function saveReport(result: AnalysisResult): Promise<void> {
  try {
    const existing = await loadReports();
    // Newest first
    const updated = [result, ...existing];
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('saveReport failed:', e);
  }
}

export async function loadReports(): Promise<AnalysisResult[]> {
  try {
    const raw = await AsyncStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalysisResult[];
  } catch (e) {
    console.warn('loadReports failed:', e);
    return [];
  }
}

export async function clearReports(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REPORTS_KEY);
  } catch (e) {
    console.warn('clearReports failed:', e);
  }
}