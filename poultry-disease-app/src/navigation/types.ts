import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  DiseaseDetection: undefined;
  Symptoms: undefined;
  ImageSelection: { mode: 'camera' | 'gallery' };  // ← typed param added
  DiseaseGallery: undefined;
  Analysis: undefined;
  Result: undefined;
  Remedy: undefined;
  Reports: undefined;
  AboutDisease: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;