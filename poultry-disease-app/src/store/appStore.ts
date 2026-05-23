import { create } from 'zustand';
import type { Disease } from '../types/disease';
import { DISEASES } from '../data/diseases';

interface AppState {
  // Disease registry — loaded from static data
  diseases: Disease[];

  // The disease the user has navigated into (set before pushing detail screens)
  selectedDisease: Disease | null;
  setSelectedDisease: (disease: Disease | null) => void;

  // Detection session state — will grow in Phase 3
  detectionInProgress: boolean;
  setDetectionInProgress: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  diseases: DISEASES,
  selectedDisease: null,
  setSelectedDisease: (disease) => set({ selectedDisease: disease }),
  detectionInProgress: false,
  setDetectionInProgress: (value) => set({ detectionInProgress: value }),
}));