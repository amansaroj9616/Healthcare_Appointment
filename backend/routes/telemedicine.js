import express from 'express';
import * as telemedicineController from '../controllers/telemedicineController.js';

const router = express.Router();

router.post('/messages', telemedicineController.createMessage);
router.get('/messages', telemedicineController.getMessages);

export default router;

