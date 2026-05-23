import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { MODEL_CONFIG } from './modelConfig';
import { preprocessImage } from './imagePreprocessor';
import type { AnalysisResult } from '../store/appStore';

// Singleton model instance — loaded once, reused for all inferences
let _model: TensorflowModel | null = null;
let _loadAttempted = false;

/**
 * Load the TFLite model from the bundled asset.
 * Safe to call multiple times — loads only once.
 * Returns true if model loaded successfully.
 */
export async function loadModel(): Promise<boolean> {
  if (_model) return true;
  if (_loadAttempted) return false;

  _loadAttempted = true;

  try {
    _model = await loadTensorflowModel(
      MODEL_CONFIG.modelAsset,
      []
    );
    console.log('[ML] Model loaded successfully');
    return true;
  } catch (e) {
    console.warn('[ML] Model failed to load:', e);
    _model = null;
    return false;
  }
}

/**
 * Returns true if the model is loaded and ready.
 */
export function isModelReady(): boolean {
  return _model !== null;
}

/**
 * Run inference on a given image URI.
 *
 * Phase 6: real TFLite inference.
 * If model is not loaded, throws — caller should check isModelReady() first.
 */
export async function runInference(imageUri: string): Promise<AnalysisResult> {
  if (!_model) {
    throw new Error('Model not loaded. Call loadModel() first.');
  }

  // Step 1: Preprocess
  const { tensor } = await preprocessImage(imageUri);

  const inputTensor: ArrayBuffer =
  tensor instanceof Float32Array
    ? tensor.buffer as ArrayBuffer
    : tensor as ArrayBuffer;

  const outputs = await _model.run([inputTensor]);

  // Step 3: Parse output tensor
  // outputs[0] is Float32Array of shape [N_CLASSES]
  const outputTensor = new Float32Array(outputs[0]);
  const result = parseModelOutput(outputTensor, imageUri);

  return result;
}

/**
 * Map raw model output float array → AnalysisResult.
 * Finds the class with the highest probability.
 */
function parseModelOutput(
  output: Float32Array,
  imageUri: string
): AnalysisResult {
  const { outputClassMap, confidenceThreshold } = MODEL_CONFIG;

  // Find argmax
  let maxIndex = 0;
  let maxValue = output[0];
  for (let i = 1; i < output.length; i++) {
    if (output[i] > maxValue) {
      maxValue = output[i];
      maxIndex = i;
    }
  }

  const confidence = Math.round(maxValue * 100);
  const diseaseId = outputClassMap[maxIndex] ?? 'unknown';

  // Build display name from disease id
  const diseaseNameMap: Record<string, string> = {
    ranikhet: 'Ranikhet Disease',
    unknown: 'Unknown / Inconclusive',
  };

  return {
    diseaseId,
    diseaseName: diseaseNameMap[diseaseId] ?? diseaseId,
    confidence,
    matchedSymptomIds: inferMatchedSymptoms(diseaseId, confidence),
    analysedAt: new Date().toISOString(),
    imageUri,
  };
}

/**
 * Infer which symptoms are likely matched based on disease + confidence.
 * Phase 7: replace with per-symptom classifier output.
 */
function inferMatchedSymptoms(diseaseId: string, confidence: number): string[] {
  if (diseaseId === 'ranikhet') {
    if (confidence >= 80) return ['rnk-s1', 'rnk-s2', 'rnk-s3'];
    if (confidence >= 60) return ['rnk-s2', 'rnk-s3'];
    return ['rnk-s3'];
  }
  return [];
}