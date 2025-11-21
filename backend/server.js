import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import doctorPanelRoutes from './routes/doctorPanel.js';
import telemedicineRoutes from './routes/telemedicine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/doctor-panel', doctorPanelRoutes);
app.use('/telemedicine', telemedicineRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare Appointment System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

