import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { ScreenProps } from '../navigation/types';
import { useAppStore } from '../store/appStore';
import { ScreenBanner } from '../components/ScreenBanner';
import { spacing, borderRadius } from '../theme/appTheme';

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
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Camera permission denied. Please enable it in device settings.');
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
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Gallery permission denied. Please enable it in device settings.');
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
      setErrorMsg('Something went wrong selecting the image. Please try again.');
    } finally {
      setPicking(false);
    }
  }, [mode]);

  useEffect(() => { pickImage(); }, []);

  const handleConfirm = () => {
    if (!imageUri) return;
    setSelectedImageUri(imageUri);
    navigation.navigate('Analysis');
  };

  const bannerIcon = mode === 'camera' ? 'camera-outline' : 'image-outline';
  const bannerTitle = mode === 'camera' ? 'Camera Capture' : 'Gallery Selection';
  const bannerSubtitle = imageUri ? 'Review your image before analysis' : 'Opening picker\u2026';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + spacing.lg }]}>
      <ScreenBanner icon={bannerIcon} title={bannerTitle} subtitle={bannerSubtitle} />

      <View style={styles.body}>
        {/* Loading state */}
        {picking && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
              Opening {mode === 'camera' ? 'camera' : 'gallery'}\u2026
            </Text>
          </View>
        )}

        {/* Error state */}
        {!picking && errorMsg && (
          <View style={styles.centered}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.errorContainer }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={36} color={theme.colors.error} />
            </View>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.error, textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.xl }}
            >
              {errorMsg}
            </Text>
            <Button mode="contained" onPress={pickImage} style={styles.btn} icon="refresh">
              Try Again
            </Button>
            <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.btn}>
              Go Back
            </Button>
          </View>
        )}

        {/* Empty — no image, no error */}
        {!picking && !errorMsg && !imageUri && (
          <View style={styles.centered}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
              <MaterialCommunityIcons
                name={mode === 'camera' ? 'camera-off-outline' : 'image-off-outline'}
                size={36}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
            <Text variant="titleSmall" style={{ color: theme.colors.onBackground, marginTop: spacing.md }}>
              No Image Selected
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.xl }}
            >
              Tap below to open the {mode === 'camera' ? 'camera' : 'gallery'} and select an image.
            </Text>
            <Button
              mode="contained"
              onPress={pickImage}
              style={styles.btn}
              icon={mode === 'camera' ? 'camera' : 'image'}
            >
              {mode === 'camera' ? 'Open Camera' : 'Open Gallery'}
            </Button>
          </View>
        )}

        {/* Preview state */}
        {!picking && imageUri && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={[styles.preview, { borderColor: theme.colors.outline }]}
              resizeMode="cover"
            />
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', paddingHorizontal: spacing.sm }}
            >
              Confirm this image to begin analysis, or retake if it is unclear.
            </Text>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.btn}
              icon="magnify-scan"
            >
              Analyse This Image
            </Button>
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.btn}
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
  body: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  btn: { width: '100%' },
});