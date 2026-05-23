// Central domain type — all disease data must conform to this shape.
// Add fields here as new diseases or metadata are introduced.

export interface DiseaseSymptom {
  id: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface DiseaseRemedy {
  id: string;
  title: string;
  description: string;
  audioFileRef?: string; // filename only, e.g. "ranikhet_remedy_hi.mp3"
}

export interface Disease {
  id: string;
  name: string;
  localName: string;         // e.g. Hindi name "रानीखेत रोग"
  species: string[];         // e.g. ["chicken", "poultry"]
  description: string;
  symptoms: DiseaseSymptom[];
  remedies: DiseaseRemedy[];
  imageCount: number;        // how many annotated images exist
  thumbnailRef?: string;     // filename only, resolved in Phase 3
}