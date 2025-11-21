# Healthcare Appointment Scheduling System

A full-stack healthcare appointment scheduling system with emergency triage, telemedicine support, and doctor panel management.

## Tech Stack

### Frontend
- React + Vite
- JavaScript
- Tailwind CSS
- React Router
- LocalStorage for anonymous patient ID

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite (can be switched to PostgreSQL)

## Features
![Healthcare_Appointment](https://github.com/amansaroj9616/Healthcare_Appointment/blob/bc54e3a28ca833ce8015679f76367a23db9e5c83/Screenshot%202025-11-21%20225919.png)

✅ **Doctor Discovery**
- Filter by specialty, location, telemedicine availability
- Sort by rating or experience
- Search by name, specialty, or location

  ![Healthcare_Appointment](https://github.com/amansaroj9616/Healthcare_Appointment/blob/eec6cb17c8b8fd8474025df98904c2d153df5e7c/Screenshot%202025-11-21%20225943.png)

✅ **Doctor Profile**
- View doctor details
- Date picker for appointment selection
- Available time slots display
   ![healthcare_Appointment](https://github.com/amansaroj9616/Healthcare_Appointment/blob/eec6cb17c8b8fd8474025df98904c2d153df5e7c/Screenshot%202025-11-21%20230000.png)

✅ **Appointment Booking**
- Select date and time
- Choose appointment type (normal/emergency)
- Choose mode (clinic/telemedicine)
  ![healthcare_Appointment](https://github.com/amansaroj9616/Healthcare_Appointment/blob/eec6cb17c8b8fd8474025df98904c2d153df5e7c/Screenshot%202025-11-21%20230200.png)

✅ **Emergency Triage System**
- Symptom-based scoring
- Automatic severity classification
- Emergency queue management
  ![healthcare_Appointment](https://github.com/amansaroj9616/Healthcare_Appointment/blob/4558fb7bff82265e851782c4ea4ecbe97660de64/Screenshot%202025-11-21%20231818.png)

✅ **Geolocation & Distance**
- Browser geolocation API
- Distance calculation
- Warning for far distances in critical emergencies

✅ **Telemedicine**
- Video consultation UI (placeholder)
- Real-time chat
- Prescription display

✅ **Patient Dashboard**
- View all appointments
- Reschedule appointments
- Cancel appointments
- Join telemedicine calls

✅ **Doctor Panel**
- View appointments by doctor
- Emergency queue approval/rejection
- Mark appointments as completed
- Add/edit prescriptions

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed the database:
```bash
npm run prisma:seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Doctors
- `GET /doctors` - Get all doctors (with filters, sorting, search)
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/:id/availability?date=YYYY-MM-DD` - Get available time slots

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments?patientId=xyz` - Get appointments by patient ID
- `GET /appointments/:id` - Get appointment by ID
- `PATCH /appointments/:id/reschedule` - Reschedule appointment
- `DELETE /appointments/:id` - Cancel appointment

### Doctor Panel
- `GET /doctor-panel/appointments?doctorId=xyz` - Get appointments by doctor
- `PATCH /doctor-panel/emergency/approve` - Approve emergency appointment
- `PATCH /doctor-panel/emergency/reject` - Reject emergency appointment
- `PATCH /doctor-panel/appointments/:id/complete` - Mark appointment completed
- `POST /doctor-panel/prescriptions` - Create prescription
- `GET /doctor-panel/prescriptions?appointmentId=xyz` - Get prescriptions

### Telemedicine
- `POST /telemedicine/messages` - Create message
- `GET /telemedicine/messages?appointmentId=xyz` - Get messages

## Frontend Routes

- `/` - Home page
- `/doctors` - Doctor discovery page
- `/doctors/:doctorId` - Doctor profile page
- `/book/:doctorId` - Book appointment page
- `/dashboard` - Patient dashboard
- `/doctor-panel` - Doctor panel
- `/teleconsult/:appointmentId` - Telemedicine consultation

## Database Schema

The system uses Prisma with SQLite. Key models:

- **Doctor** - Doctor information
- **Availability** - Doctor availability slots
- **Appointment** - Patient appointments
- **EmergencyTriage** - Emergency triage data
- **EmergencyQueue** - Emergency queue management
- **TelemedicineMessage** - Telemedicine chat messages
- **Prescription** - Prescriptions

## Emergency Triage Scoring

Symptoms are scored as follows:
- Chest pain: 3
- Difficulty breathing: 3
- Heavy bleeding: 3
- Loss of consciousness: 3
- Vomiting blood: 3
- Accident/trauma: 2
- High fever: 2
- Severe headache: 1

**Severity Levels:**
- 0-2: Low (converted to normal appointment)
- 3-5: Medium (pending in emergency queue)
- 6+: High (approved in emergency queue)

## Notes

- No authentication is implemented - uses anonymous patient IDs stored in localStorage
- Telemedicine video is a placeholder UI
- Database uses SQLite by default (can be switched to PostgreSQL by changing DATABASE_URL)
- All appointments are stored with patient IDs from localStorage

## License

MIT

Next steps to run

Backend: 

   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   npm run dev
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The system is ready to use. All features are implemented, including emergency triage, distance warnings, telemedicine chat, and the doctor panel. The code is commented and follows a modular structure.#



