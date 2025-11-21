/**
 * Appointment Controller
 * Handles HTTP requests related to appointments
 */

import * as appointmentService from '../services/appointmentService.js';

/**
 * Create a new appointment
 * POST /appointments
 */
export async function createAppointment(req, res) {
  try {
    const appointmentData = req.body;
    const appointment = await appointmentService.createAppointment(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error in createAppointment:', error);
    if (error.message === 'Doctor not found' || error.message === 'Time slot is already booked') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to create appointment' });
    }
  }
}

/**
 * Get appointments by patient ID
 * GET /appointments?patientId=xyz
 */
export async function getAppointments(req, res) {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'patientId query parameter is required' });
    }

    const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
    res.json(appointments);
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
  }
}

/**
 * Reschedule an appointment
 * PATCH /appointments/:id/reschedule
 */
export async function rescheduleAppointment(req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;
    const appointment = await appointmentService.rescheduleAppointment(id, newData);
    res.json(appointment);
  } catch (error) {
    console.error('Error in rescheduleAppointment:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'Cannot reschedule a cancelled appointment' ||
      error.message === 'Cannot reschedule a completed appointment' ||
      error.message === 'Time slot is already booked'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to reschedule appointment' });
    }
  }
}

/**
 * Cancel an appointment
 * DELETE /appointments/:id
 */
export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.cancelAppointment(id);
    res.json(appointment);
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'Appointment is already cancelled' ||
      error.message === 'Cannot cancel a completed appointment'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to cancel appointment' });
    }
  }
}

/**
 * Get appointment by ID
 * GET /appointments/:id
 */
export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    res.json(appointment);
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    if (error.message === 'Appointment not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch appointment' });
    }
  }
}

