/**
 * Patient ID Utility
 * Manages anonymous patient ID using localStorage
 */

import { v4 as uuidv4 } from 'uuid';

const PATIENT_ID_KEY = 'medical_patient_id';

/**
 * Get or create patient ID from localStorage
 * @returns {string} Patient ID (UUID)
 */
export function getOrCreatePatientId() {
  let patientId = localStorage.getItem(PATIENT_ID_KEY);

  if (!patientId) {
    patientId = uuidv4();
    localStorage.setItem(PATIENT_ID_KEY, patientId);
  }

  return patientId;
}

/**
 * Get current patient ID (returns null if not exists)
 * @returns {string|null} Patient ID or null
 */
export function getPatientId() {
  return localStorage.getItem(PATIENT_ID_KEY);
}

/**
 * Clear patient ID from localStorage
 */
export function clearPatientId() {
  localStorage.removeItem(PATIENT_ID_KEY);
}

