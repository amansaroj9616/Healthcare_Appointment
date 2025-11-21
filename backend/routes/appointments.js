import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.patch('/:id/reschedule', appointmentController.rescheduleAppointment);
router.delete('/:id', appointmentController.cancelAppointment);

export default router;

