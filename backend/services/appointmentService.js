/**
 * Appointment Service
 * Handles all business logic related to appointments
 */

import { PrismaClient } from '@prisma/client';
import {
  calculateEmergencyScore,
  getSeverityLevel,
  shouldConvertToNormal,
} from '../utils/emergency.js';
import { distanceInKm, shouldShowDistanceWarning } from '../utils/distance.js';

const prisma = new PrismaClient();

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(appointmentData) {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      appointmentType,
      mode,
      symptoms = [],
      patientLat,
      patientLng,
    } = appointmentData;

    // Validate doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: {
          not: 'cancelled',
        },
      },
    });

    if (existingAppointment) {
      throw new Error('Time slot is already booked');
    }

    let finalAppointmentType = appointmentType;
    let emergencyScore = 0;
    let severityLevel = 'low';
    let distanceKm = null;
    let distanceWarning = false;

    // Handle emergency appointments
    if (appointmentType === 'emergency' && symptoms.length > 0) {
      emergencyScore = calculateEmergencyScore(symptoms);
      severityLevel = getSeverityLevel(emergencyScore);

      // Convert to normal if score is too low
      if (shouldConvertToNormal(emergencyScore)) {
        finalAppointmentType = 'normal';
      }

      // Calculate distance if coordinates provided
      if (patientLat && patientLng && doctor.latitude && doctor.longitude) {
        distanceKm = distanceInKm(patientLat, patientLng, doctor.latitude, doctor.longitude);
        distanceWarning = shouldShowDistanceWarning(distanceKm, emergencyScore);
      }
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        appointmentType: finalAppointmentType,
        mode,
        status: 'scheduled',
      },
    });

    // Create emergency triage if emergency
    if (appointmentType === 'emergency' && symptoms.length > 0) {
      await prisma.emergencyTriage.create({
        data: {
          appointmentId: appointment.id,
          symptoms: JSON.stringify(symptoms),
          emergencyScore,
          severityLevel,
          patientLat,
          patientLng,
          distanceKm,
        },
      });

      // Create emergency queue entry if medium or high severity
      if (severityLevel === 'medium' || severityLevel === 'high') {
        await prisma.emergencyQueue.create({
          data: {
            appointmentId: appointment.id,
            status: severityLevel === 'high' ? 'approved' : 'pending',
          },
        });
      }
    }

    // Fetch complete appointment with relations
    const completeAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        doctor: true,
        emergencyTriage: true,
        emergencyQueue: true,
      },
    });

    return {
      ...completeAppointment,
      distanceWarning,
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Get appointments by patient ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Array of appointments
 */
export async function getAppointmentsByPatientId(patientId) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: true,
        emergencyTriage: true,
        emergencyQueue: true,
        prescriptions: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

/**
 * Reschedule an appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} newData - New appointment date and time slot
 * @returns {Promise<Object>} Updated appointment
 */
export async function rescheduleAppointment(appointmentId, newData) {
  try {
    const { appointmentDate, timeSlot } = newData;

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true },
    });

    if (!existingAppointment) {
      throw new Error('Appointment not found');
    }

    if (existingAppointment.status === 'cancelled') {
      throw new Error('Cannot reschedule a cancelled appointment');
    }

    if (existingAppointment.status === 'completed') {
      throw new Error('Cannot reschedule a completed appointment');
    }

    // Check if new slot is available
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: existingAppointment.doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: {
          not: 'cancelled',
        },
        id: {
          not: appointmentId,
        },
      },
    });

    if (conflictingAppointment) {
      throw new Error('Time slot is already booked');
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate: new Date(appointmentDate),
        timeSlot,
      },
      include: {
        doctor: true,
        emergencyTriage: true,
        emergencyQueue: true,
      },
    });

    return updatedAppointment;
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
}

/**
 * Cancel an appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Cancelled appointment
 */
export async function cancelAppointment(appointmentId) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Appointment is already cancelled');
    }

    if (appointment.status === 'completed') {
      throw new Error('Cannot cancel a completed appointment');
    }

    const cancelledAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'cancelled',
      },
      include: {
        doctor: true,
      },
    });

    return cancelledAppointment;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
}

/**
 * Get appointment by ID
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Appointment object
 */
export async function getAppointmentById(appointmentId) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        emergencyTriage: true,
        emergencyQueue: true,
        prescriptions: true,
        telemedicineMessages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

