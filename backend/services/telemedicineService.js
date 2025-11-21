/**
 * Telemedicine Service
 * Handles business logic for telemedicine features
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a telemedicine message
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} Created message
 */
export async function createTelemedicineMessage(messageData) {
  try {
    const { appointmentId, sender, message } = messageData;

    // Validate appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Validate sender
    if (sender !== 'doctor' && sender !== 'patient') {
      throw new Error('Invalid sender. Must be "doctor" or "patient"');
    }

    // Create message
    const telemedicineMessage = await prisma.telemedicineMessage.create({
      data: {
        appointmentId,
        sender,
        message,
      },
    });

    return telemedicineMessage;
  } catch (error) {
    console.error('Error creating telemedicine message:', error);
    throw error;
  }
}

/**
 * Get all messages for an appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Array>} Array of messages
 */
export async function getTelemedicineMessages(appointmentId) {
  try {
    const messages = await prisma.telemedicineMessage.findMany({
      where: { appointmentId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  } catch (error) {
    console.error('Error fetching telemedicine messages:', error);
    throw error;
  }
}

