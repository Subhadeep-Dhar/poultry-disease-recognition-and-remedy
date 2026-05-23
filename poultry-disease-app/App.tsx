import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation/AppNavigator';
import { appTheme } from './src/theme/appTheme';
import { loadModel } from './src/ml/inferenceEngine';
import { useAppStore } from './src/store/appStore';

function AppWithModel() {
  const setModelReady = useAppStore((s) => s.setModelReady);
  const setModelLoadFailed = useAppStore((s) => s.setModelLoadFailed);

  useEffect(() => {
    loadModel().then((success) => {
      if (success) {
        setModelReady(true);
      } else {
        setModelLoadFailed(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <AppWithModel />
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}