/**
 * Doctor Service
 * Handles all business logic related to doctors
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all doctors with optional filters and sorting
 * @param {Object} filters - Filter options (specialty, location, telemedicineAvailable)
 * @param {Object} sort - Sort options (rating, experience)
 * @param {Object} search - Search params (name, specialty, location)
 * @returns {Promise<Array>} Array of doctors
 */
export async function getAllDoctors(filters = {}, sort = {}, search = {}) {
  try {
    const where = {};

    // Apply filters
    if (filters.specialty) {
      where.specialty = filters.specialty;
    }

    if (filters.location) {
      where.location = {
        contains: filters.location,
      };
    }

    if (filters.telemedicineAvailable !== undefined) {
      where.telemedicineAvailable = filters.telemedicineAvailable === 'true';
    }

    // Apply search
    if (search.name || search.specialty || search.location) {
      where.OR = [];
      
      if (search.name) {
        where.OR.push({
          name: {
            contains: search.name,
          },
        });
      }
      
      if (search.specialty) {
        where.OR.push({
          specialty: {
            contains: search.specialty,
          },
        });
      }
      
      if (search.location) {
        where.OR.push({
          location: {
            contains: search.location,
          },
        });
      }
    }

    // Build orderBy
    const orderBy = {};
    if (sort.rating === 'desc') {
      orderBy.rating = 'desc';
    } else if (sort.experience === 'desc') {
      orderBy.experienceYears = 'desc';
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: 'desc' },
    });

    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

/**
 * Get doctor by ID
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor object
 */
export async function getDoctorById(doctorId) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        availability: true,
      },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
}

/**
 * Get doctor availability for a specific date
 * @param {string} doctorId - Doctor ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of available time slots
 */
export async function getDoctorAvailability(doctorId, date) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        availability: true,
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date(date + 'T00:00:00'),
              lt: new Date(date + 'T23:59:59'),
            },
            status: {
              not: 'cancelled',
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();

    // Get availability for this day
    const dayAvailability = doctor.availability.filter(
      (avail) => avail.dayOfWeek === dayOfWeek && avail.isAvailable
    );

    if (dayAvailability.length === 0) {
      return [];
    }

    // Generate time slots
    const slots = [];
    const bookedSlots = doctor.appointments.map((apt) => apt.timeSlot);

    dayAvailability.forEach((avail) => {
      const start = parseTime(avail.startTime);
      const end = parseTime(avail.endTime);

      let current = start;
      while (current < end) {
        const timeSlot = formatTime(current);
        
        // Check if slot is not booked
        if (!bookedSlots.includes(timeSlot)) {
          slots.push(timeSlot);
        }

        // Add 30 minutes
        current += 30;
      }
    });

    return slots.sort();
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {number} Minutes since midnight
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to time string (HH:MM)
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time string in HH:MM format
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

