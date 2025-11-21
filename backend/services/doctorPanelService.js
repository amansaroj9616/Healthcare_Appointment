/**
 * Doctor Panel Service
 * Handles business logic for doctor panel operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all appointments for a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Array>} Array of appointments
 */
export async function getAppointmentsByDoctorId(doctorId) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: false, // We don't have patient model, just patientId
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
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
}

/**
 * Approve emergency appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Updated emergency queue entry
 */
export async function approveEmergencyAppointment(appointmentId) {
  try {
    // Check if appointment exists and has emergency queue entry
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { emergencyQueue: true },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (!appointment.emergencyQueue) {
      throw new Error('This appointment is not in the emergency queue');
    }

    // Update emergency queue status
    const updatedQueue = await prisma.emergencyQueue.update({
      where: { appointmentId },
      data: {
        status: 'approved',
      },
    });

    return updatedQueue;
  } catch (error) {
    console.error('Error approving emergency appointment:', error);
    throw error;
  }
}

/**
 * Reject emergency appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Updated emergency queue entry
 */
export async function rejectEmergencyAppointment(appointmentId) {
  try {
    // Check if appointment exists and has emergency queue entry
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { emergencyQueue: true },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (!appointment.emergencyQueue) {
      throw new Error('This appointment is not in the emergency queue');
    }

    // Update emergency queue status
    const updatedQueue = await prisma.emergencyQueue.update({
      where: { appointmentId },
      data: {
        status: 'rejected',
      },
    });

    return updatedQueue;
  } catch (error) {
    console.error('Error rejecting emergency appointment:', error);
    throw error;
  }
}

/**
 * Mark appointment as completed
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Updated appointment
 */
export async function markAppointmentCompleted(appointmentId) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Cannot complete a cancelled appointment');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'completed',
      },
      include: {
        doctor: true,
        emergencyTriage: true,
        emergencyQueue: true,
      },
    });

    return updatedAppointment;
  } catch (error) {
    console.error('Error marking appointment completed:', error);
    throw error;
  }
}

/**
 * Create or update prescription
 * @param {Object} prescriptionData - Prescription data
 * @returns {Promise<Object>} Created/updated prescription
 */
export async function createPrescription(prescriptionData) {
  try {
    const { appointmentId, doctorId, medications, notes } = prescriptionData;

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check if prescription already exists
    const existingPrescription = await prisma.prescription.findFirst({
      where: { appointmentId },
    });

    let prescription;

    if (existingPrescription) {
      // Update existing prescription
      prescription = await prisma.prescription.update({
        where: { id: existingPrescription.id },
        data: {
          medications: JSON.stringify(medications),
          notes,
        },
      });
    } else {
      // Create new prescription
      prescription = await prisma.prescription.create({
        data: {
          appointmentId,
          doctorId,
          medications: JSON.stringify(medications),
          notes,
        },
      });
    }

    return prescription;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
}

/**
 * Get prescriptions by appointment ID
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Array>} Array of prescriptions
 */
export async function getPrescriptionsByAppointmentId(appointmentId) {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { appointmentId },
      include: {
        doctor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse medications JSON
    return prescriptions.map((prescription) => ({
      ...prescription,
      medications: JSON.parse(prescription.medications),
    }));
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
}

