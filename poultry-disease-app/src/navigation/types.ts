import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Central param list — add typed params per screen in later phases
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  DiseaseDetection: undefined;
  Symptoms: undefined;
  ImageSelection: undefined;
  DiseaseGallery: undefined;
  Analysis: undefined;
  Result: undefined;
  Remedy: undefined;
  Reports: undefined;
  AboutDisease: undefined;
};

// Convenience type — use in every screen file
export type ScreenProps<
  T extends keyof RootStackParamList
> = NativeStackScreenProps<RootStackParamList, T>;