import { create } from 'zustand';
import type { Disease } from '../types/disease';
import { DISEASES } from '../data/diseases';

export interface AnalysisResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number;
  matchedSymptomIds: string[];
  analysedAt: string;
  imageUri: string;
}

interface AppState {
  diseases: Disease[];

  selectedDisease: Disease | null;
  setSelectedDisease: (disease: Disease | null) => void;

  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;

  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;

  detectionInProgress: boolean;
  setDetectionInProgress: (value: boolean) => void;

  // ── ML model state (Phase 6) ──────────────────────────────────────────────
  modelReady: boolean;
  modelLoadFailed: boolean;
  setModelReady: (ready: boolean) => void;
  setModelLoadFailed: (failed: boolean) => void;

  // ── Selected symptoms for PoC simulation ──────────────────────────────────
  selectedSymptomIds: string[];
  setSelectedSymptomIds: (ids: string[]) => void;
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

  modelReady: false,
  modelLoadFailed: false,
  setModelReady: (ready) => set({ modelReady: ready }),
  setModelLoadFailed: (failed) => set({ modelLoadFailed: failed }),

  selectedSymptomIds: [],
  setSelectedSymptomIds: (ids) => set({ selectedSymptomIds: ids }),
}));