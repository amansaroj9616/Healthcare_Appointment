/**
 * Doctor Panel Controller
 * Handles HTTP requests for doctor panel operations
 */

import * as doctorPanelService from '../services/doctorPanelService.js';

/**
 * Get all appointments for a doctor
 * GET /doctor-panel/appointments?doctorId=xyz
 */
export async function getDoctorAppointments(req, res) {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ error: 'doctorId query parameter is required' });
    }

    const appointments = await doctorPanelService.getAppointmentsByDoctorId(doctorId);
    res.json(appointments);
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
  }
}

/**
 * Approve emergency appointment
 * PATCH /doctor-panel/emergency/approve
 */
export async function approveEmergency(req, res) {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId is required' });
    }

    const queue = await doctorPanelService.approveEmergencyAppointment(appointmentId);
    res.json(queue);
  } catch (error) {
    console.error('Error in approveEmergency:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'This appointment is not in the emergency queue'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to approve emergency' });
    }
  }
}

/**
 * Reject emergency appointment
 * PATCH /doctor-panel/emergency/reject
 */
export async function rejectEmergency(req, res) {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId is required' });
    }

    const queue = await doctorPanelService.rejectEmergencyAppointment(appointmentId);
    res.json(queue);
  } catch (error) {
    console.error('Error in rejectEmergency:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'This appointment is not in the emergency queue'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to reject emergency' });
    }
  }
}

/**
 * Mark appointment as completed
 * PATCH /doctor-panel/appointments/:id/complete
 */
export async function markCompleted(req, res) {
  try {
    const { id } = req.params;
    const appointment = await doctorPanelService.markAppointmentCompleted(id);
    res.json(appointment);
  } catch (error) {
    console.error('Error in markCompleted:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'Cannot complete a cancelled appointment'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to mark appointment completed' });
    }
  }
}

/**
 * Create or update prescription
 * POST /prescriptions
 */
export async function createPrescription(req, res) {
  try {
    const prescriptionData = req.body;
    const prescription = await doctorPanelService.createPrescription(prescriptionData);
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Error in createPrescription:', error);
    if (error.message === 'Appointment not found') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to create prescription' });
    }
  }
}

/**
 * Get prescriptions by appointment ID
 * GET /prescriptions?appointmentId=xyz
 */
export async function getPrescriptions(req, res) {
  try {
    const { appointmentId } = req.query;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId query parameter is required' });
    }

    const prescriptions = await doctorPanelService.getPrescriptionsByAppointmentId(appointmentId);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error in getPrescriptions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch prescriptions' });
  }
}

