import type { Disease } from '../types/disease';

// Static disease registry.
// Phase 1 dataset: Ranikhet only, 29 annotated images.
// To add a new disease: append an object to this array. Nothing else changes.

export const DISEASES: Disease[] = [
  {
    id: 'ranikhet',
    name: 'Ranikhet Disease',
    localName: 'रानीखेत रोग',
    species: ['chicken', 'poultry'],
    description:
      'Ranikhet Disease (Newcastle Disease) is a highly contagious viral illness ' +
      'affecting poultry worldwide. It attacks the respiratory, nervous, and ' +
      'digestive systems and can cause significant flock mortality if untreated.',
    symptoms: [
      {
        id: 'rnk-s1',
        description: 'Twisted neck or torticollis (wry neck)',
        severity: 'severe',
      },
      {
        id: 'rnk-s2',
        description: 'Gasping and difficulty breathing',
        severity: 'severe',
      },
      {
        id: 'rnk-s3',
        description: 'Watery or greenish diarrhoea',
        severity: 'moderate',
      },
      {
        id: 'rnk-s4',
        description: 'Sudden drop in egg production',
        severity: 'moderate',
      },
      {
        id: 'rnk-s5',
        description: 'Swelling around the eyes and neck',
        severity: 'moderate',
      },
      {
        id: 'rnk-s6',
        description: 'Loss of appetite and lethargy',
        severity: 'mild',
      },
      {
        id: 'rnk-s7',
        description: 'Paralysis of wings or legs',
        severity: 'severe',
      },
    ],
    remedies: [
      {
        id: 'rnk-r1',
        title: 'Immediate Isolation',
        description:
          'Isolate all visibly sick birds immediately to prevent spread to the rest of the flock.',
        audioFileRef: undefined,
      },
      {
        id: 'rnk-r2',
        title: 'Vaccination Protocol',
        description:
          'Vaccinate healthy birds with Lasota or F-strain Newcastle vaccine via drinking water or eye drop.',
        audioFileRef: 'ranikhet_remedy_hi.mp3',
      },
      {
        id: 'rnk-r3',
        title: 'Supportive Care',
        description:
          'Provide electrolytes and vitamins in drinking water. Maintain clean, dry housing with good ventilation.',
        audioFileRef: undefined,
      },
      {
        id: 'rnk-r4',
        title: 'Biosecurity Measures',
        description:
          'Disinfect all equipment, footwear, and housing. Restrict visitor access to poultry area.',
        audioFileRef: undefined,
      },
    ],
    imageCount: 29,
    thumbnailRef: 'ranikhet_thumb.jpg',
  },
];

// Lookup helper — O(1) by disease id
export const getDiseaseById = (id: string): Disease | undefined =>
  DISEASES.find((d) => d.id === id);