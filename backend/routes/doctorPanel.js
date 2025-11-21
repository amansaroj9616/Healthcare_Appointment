import express from 'express';
import * as doctorPanelController from '../controllers/doctorPanelController.js';

const router = express.Router();

router.get('/appointments', doctorPanelController.getDoctorAppointments);
router.patch('/emergency/approve', doctorPanelController.approveEmergency);
router.patch('/emergency/reject', doctorPanelController.rejectEmergency);
router.patch('/appointments/:id/complete', doctorPanelController.markCompleted);
router.post('/prescriptions', doctorPanelController.createPrescription);
router.get('/prescriptions', doctorPanelController.getPrescriptions);

export default router;

