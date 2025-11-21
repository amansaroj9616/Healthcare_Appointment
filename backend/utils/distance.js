/**
 * Distance Calculation Utilities
 * Calculate distance between two geographic coordinates using Haversine formula
 */

/**
 * Calculate distance between two points on Earth in kilometers
 * Uses Haversine formula for great-circle distance
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function distanceInKm(lat1, lon1, lat2, lon2) {
  // Validate inputs
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number'
  ) {
    return null;
  }

  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Check if distance warning should be shown
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} emergencyScore - Emergency score
 * @returns {boolean} True if warning should be shown
 */
export function shouldShowDistanceWarning(distanceKm, emergencyScore) {
  return distanceKm > 20 && emergencyScore >= 6;
}

