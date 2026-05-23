import { create } from 'zustand';
import type { Disease } from '../types/disease';
import { DISEASES } from '../data/diseases';

export interface AnalysisResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number;           // 0–100
  matchedSymptomIds: string[];
  analysedAt: string;           // ISO timestamp
  imageUri: string;
}

interface AppState {
  // Disease registry
  diseases: Disease[];

  // Selected disease for detail screens
  selectedDisease: Disease | null;
  setSelectedDisease: (disease: Disease | null) => void;

  // Image selected by the farmer for analysis
  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;

  // Result written by AnalysisScreen, read by ResultScreen
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;

  // Detection session flag
  detectionInProgress: boolean;
  setDetectionInProgress: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  diseases: DISEASES,

  selectedDisease: null,
  setSelectedDisease: (disease) => set({ selectedDisease: disease }),

  selectedImageUri: null,
  setSelectedImageUri: (uri) => set({ selectedImageUri: uri }),

  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),

  detectionInProgress: false,
  setDetectionInProgress: (value) => set({ detectionInProgress: value }),
}));