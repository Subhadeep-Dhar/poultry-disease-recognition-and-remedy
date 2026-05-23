// Central model configuration.
// If you swap the model, only this file changes.

export const MODEL_CONFIG = {
  // Input tensor shape: [batch, height, width, channels]
  inputHeight: 224,
  inputWidth: 224,
  inputChannels: 3,

  // Normalisation: pixel values divided by 255 → 0.0–1.0 float32
  normalizationFactor: 255.0,

  // Output index → disease id mapping
  // Index 0 = Ranikhet. Extend when more diseases are added.
  outputClassMap: {
    0: 'ranikhet',
  } as Record<number, string>,

  // Minimum confidence to report a positive detection
  confidenceThreshold: 0.55,

  // Asset path — must match assets/models/ filename
  modelAsset: require('../../assets/models/ranikhet_classifier.tflite'),
} as const;