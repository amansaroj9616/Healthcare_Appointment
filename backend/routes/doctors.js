import express from 'express';
import * as doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/availability', doctorController.getDoctorAvailability);

export default router;

