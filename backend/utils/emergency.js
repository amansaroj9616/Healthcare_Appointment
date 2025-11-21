/**
 * Emergency Triage Scoring System
 * Calculates emergency score based on symptoms
 */

// Symptom scores mapping
const SYMPTOM_SCORES = {
  'chest pain': 3,
  'difficulty breathing': 3,
  'heavy bleeding': 3,
  'loss of consciousness': 3,
  'vomiting blood': 3,
  'accident/trauma': 2,
  'high fever': 2,
  'severe headache': 1,
};

/**
 * Calculate emergency score from symptoms array
 * @param {string[]} symptoms - Array of symptom strings
 * @returns {number} Total emergency score
 */
export function calculateEmergencyScore(symptoms) {
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return 0;
  }

  let score = 0;
  const symptomMap = new Map();

  symptoms.forEach((symptom) => {
    const normalizedSymptom = symptom.toLowerCase().trim();
    
    // Check if symptom exists in our scoring map
    if (SYMPTOM_SCORES[normalizedSymptom]) {
      // Only count each symptom once
      if (!symptomMap.has(normalizedSymptom)) {
        score += SYMPTOM_SCORES[normalizedSymptom];
        symptomMap.set(normalizedSymptom, true);
      }
    }
  });

  return score;
}

/**
 * Determine severity level based on emergency score
 * @param {number} score - Emergency score
 * @returns {string} Severity level: "low", "medium", or "high"
 */
export function getSeverityLevel(score) {
  if (score >= 6) {
    return 'high';
  } else if (score >= 3) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Check if appointment should be converted to normal (non-emergency)
 * @param {number} score - Emergency score
 * @returns {boolean} True if should be converted to normal
 */
export function shouldConvertToNormal(score) {
  return score <= 2;
}

