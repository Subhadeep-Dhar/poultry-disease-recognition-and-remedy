/**
 * diseaseService.ts
 * ─────────────────
 * Centralised service layer for disease data access.
 * All screens should import from here instead of directly from `data/diseases.ts`.
 *
 * Benefits:
 * - Future: swap local array for remote API call in one place
 * - Testable: mock the service in tests without touching data files
 * - Scalable: add new diseases by editing `data/diseases.ts` only
 */

import { DISEASES } from '../data/diseases';
import type { Disease } from '../types/disease';

/** Return the full disease registry */
export function getAllDiseases(): Disease[] {
  return DISEASES;
}

/** Lookup a disease by id — O(n) but dataset is tiny */
export function getDiseaseById(id: string): Disease | undefined {
  return DISEASES.find((d) => d.id === id);
}

/** Return the first disease in the registry (useful as default selection) */
export function getDefaultDisease(): Disease | undefined {
  return DISEASES[0];
}

/** Return count of diseases in registry */
export function getDiseaseCount(): number {
  return DISEASES.length;
}

/**
 * Future: addDisease / removeDisease can be implemented here
 * when a remote database or local persistence layer is added.
 */
