import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';

type Props = ScreenProps<'ImageSelection'>;

export default function ImageSelectionScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    setPicking(true);
    setErrorMsg(null);

    try {
      let result: ImagePicker.ImagePickerResult;

      if (mode === 'camera') {
        const { status } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(
            'Camera permission denied. Please enable it in device settings.'
          );
          setPicking(false);
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.85,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(
            'Gallery permission denied. Please enable it in device settings.'
          );
          setPicking(false);
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.85,
        });
      }

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      setErrorMsg('Something went wrong selecting the image. Please retry.');
    } finally {
      setPicking(false);
    }
  }, [mode]);

  // Auto-launch picker on screen mount
  useEffect(() => {
    pickImage();
  }, []);  // run once on mount

  const handleConfirm = () => {
    if (!imageUri) return;
    setSelectedImageUri(imageUri);
    navigation.navigate('Analysis');
  };

  const handleRetry = () => {
    setImageUri(null);
    pickImage();
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.primary }]}>
        <Text variant="titleMedium" style={styles.bannerTitle}>
          {mode === 'camera' ? '📷  Camera Capture' : '🖼️  Gallery Selection'}
        </Text>
        <Text variant="bodySmall" style={styles.bannerSub}>
          {imageUri
            ? 'Review your image before analysis'
            : 'Opening picker…'}
        </Text>
      </View>

      {/* States */}
      <View style={styles.body}>
        {picking && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onBackground, marginTop: 12 }}
            >
              Opening {mode === 'camera' ? 'camera' : 'gallery'}…
            </Text>
          </View>
        )}

        {!picking && errorMsg && (
          <View style={styles.centered}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.error, textAlign: 'center' }}
            >
              {errorMsg}
            </Text>
            <Button
              mode="contained"
              onPress={handleRetry}
              style={styles.button}
              icon="refresh"
            >
              Retry
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Go Back
            </Button>
          </View>
        )}

        {!picking && !errorMsg && !imageUri && (
          <View style={styles.centered}>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
              }}
            >
              No image selected. Tap below to try again.
            </Text>
            <Button
              mode="contained"
              onPress={handleRetry}
              style={styles.button}
              icon={mode === 'camera' ? 'camera' : 'image'}
            >
              {mode === 'camera' ? 'Open Camera' : 'Open Gallery'}
            </Button>
          </View>
        )}

        {!picking && imageUri && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.preview,
                { borderColor: theme.colors.outline },
              ]}
              resizeMode="cover"
            />
            <Text
              variant="bodySmall"
              style={[
                styles.previewHint,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Confirm this image to begin analysis, or retake if unclear.
            </Text>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.button}
              icon="magnify-scan"
            >
              Analyse This Image
            </Button>
            <Button
              mode="outlined"
              onPress={handleRetry}
              style={styles.button}
              icon={mode === 'camera' ? 'camera-retake' : 'image-edit'}
            >
              {mode === 'camera' ? 'Retake Photo' : 'Choose Different'}
            </Button>
          </View>
        )}
      </View>
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
  body: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewHint: {
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  button: {
    width: '100%',
  },
});