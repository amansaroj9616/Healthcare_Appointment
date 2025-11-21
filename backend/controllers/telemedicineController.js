/**
 * Telemedicine Controller
 * Handles HTTP requests related to telemedicine
 */

import * as telemedicineService from '../services/telemedicineService.js';

/**
 * Create a telemedicine message
 * POST /telemedicine/messages
 */
export async function createMessage(req, res) {
  try {
    const messageData = req.body;
    const message = await telemedicineService.createTelemedicineMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error in createMessage:', error);
    if (
      error.message === 'Appointment not found' ||
      error.message === 'Invalid sender. Must be "doctor" or "patient"'
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to create message' });
    }
  }
}

/**
 * Get all messages for an appointment
 * GET /telemedicine/messages?appointmentId=xyz
 */
export async function getMessages(req, res) {
  try {
    const { appointmentId } = req.query;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId query parameter is required' });
    }

    const messages = await telemedicineService.getTelemedicineMessages(appointmentId);
    res.json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch messages' });
  }
}

