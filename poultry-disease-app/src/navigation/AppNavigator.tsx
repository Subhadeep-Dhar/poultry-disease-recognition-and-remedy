import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { appTheme } from '../theme/appTheme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import DiseaseDetectionScreen from '../screens/DiseaseDetectionScreen';
import SymptomsScreen from '../screens/SymptomsScreen';
import ImageSelectionScreen from '../screens/ImageSelectionScreen';
import DiseaseGalleryScreen from '../screens/DiseaseGalleryScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ResultScreen from '../screens/ResultScreen';
import RemedyScreen from '../screens/RemedyScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AboutDiseaseScreen from '../screens/AboutDiseaseScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: appTheme.colors.primary,
        },
        headerTintColor: appTheme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: appTheme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Poultry Health', headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseDetection"
        component={DiseaseDetectionScreen}
        options={{ title: 'Disease Detection' }}
      />
      <Stack.Screen
        name="Symptoms"
        component={SymptomsScreen}
        options={{ title: 'Symptoms' }}
      />
      <Stack.Screen
        name="ImageSelection"
        component={ImageSelectionScreen}
        options={{ title: 'Select Image' }}
      />
      <Stack.Screen
        name="DiseaseGallery"
        component={DiseaseGalleryScreen}
        options={{ title: 'Disease Gallery' }}
      />
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ title: 'Analysis' }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Result' }}
      />
      <Stack.Screen
        name="Remedy"
        component={RemedyScreen}
        options={{ title: 'Remedy' }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Stack.Screen
        name="AboutDisease"
        component={AboutDiseaseScreen}
        options={{ title: 'About Disease' }}
      />
    </Stack.Navigator>
  );
}