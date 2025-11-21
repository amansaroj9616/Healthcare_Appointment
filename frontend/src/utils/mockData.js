/**
 * Mock Data Service
 * Provides all data for the frontend without backend dependency
 */

// Mock Doctors Data
export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiology',
    hospital: 'Apollo Hospitals',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    experienceYears: 15,
    telemedicineAvailable: true,
    lat: 19.0760,
    lng: 72.8777,
    bio: 'Expert cardiologist with 15 years of experience in treating heart conditions.',
    education: 'MD, AIIMS Delhi',
    languages: ['Hindi', 'English', 'Marathi'],
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Pediatrics',
    hospital: 'Fortis Healthcare',
    location: 'Delhi, NCR',
    rating: 4.9,
    experienceYears: 12,
    telemedicineAvailable: true,
    lat: 28.6139,
    lng: 77.2090,
    bio: 'Dedicated pediatrician specializing in child health and development.',
    education: 'MD, AIIMS Delhi',
    languages: ['Hindi', 'English', 'Punjabi'],
  },
  {
    id: '3',
    name: 'Dr. Anjali Reddy',
    specialty: 'Dermatology',
    hospital: 'Max Healthcare',
    location: 'Bangalore, Karnataka',
    rating: 4.7,
    experienceYears: 10,
    telemedicineAvailable: true,
    lat: 12.9716,
    lng: 77.5946,
    bio: 'Board-certified dermatologist with expertise in cosmetic and medical dermatology.',
    education: 'MD, Bangalore Medical College',
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
  },
  {
    id: '4',
    name: 'Dr. Vikram Singh',
    specialty: 'Orthopedics',
    hospital: 'Manipal Hospitals',
    location: 'Chennai, Tamil Nadu',
    rating: 4.6,
    experienceYears: 18,
    telemedicineAvailable: false,
    lat: 13.0827,
    lng: 80.2707,
    bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement.',
    education: 'MS, Madras Medical College',
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    id: '5',
    name: 'Dr. Meera Patel',
    specialty: 'Neurology',
    hospital: 'Narayana Health',
    location: 'Hyderabad, Telangana',
    rating: 4.9,
    experienceYears: 20,
    telemedicineAvailable: true,
    lat: 17.3850,
    lng: 78.4867,
    bio: 'Renowned neurologist with expertise in treating neurological disorders.',
    education: 'DM, NIMHANS Bangalore',
    languages: ['English', 'Hindi', 'Telugu'],
  },
  {
    id: '6',
    name: 'Dr. Amit Verma',
    specialty: 'General Medicine',
    hospital: 'Medanta Hospital',
    location: 'Kolkata, West Bengal',
    rating: 4.5,
    experienceYears: 14,
    telemedicineAvailable: true,
    lat: 22.5726,
    lng: 88.3639,
    bio: 'Primary care physician providing comprehensive healthcare services.',
    education: 'MD, Calcutta Medical College',
    languages: ['English', 'Hindi', 'Bengali'],
  },
  {
    id: '7',
    name: 'Dr. Kavita Desai',
    specialty: 'Oncology',
    hospital: 'Tata Memorial Hospital',
    location: 'Pune, Maharashtra',
    rating: 4.8,
    experienceYears: 16,
    telemedicineAvailable: true,
    lat: 18.5204,
    lng: 73.8567,
    bio: 'Oncologist specializing in cancer treatment and patient care.',
    education: 'MD, B.J. Medical College',
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: '8',
    name: 'Dr. Arjun Menon',
    specialty: 'Psychiatry',
    hospital: 'NIMHANS',
    location: 'Ahmedabad, Gujarat',
    rating: 4.7,
    experienceYears: 11,
    telemedicineAvailable: true,
    lat: 23.0225,
    lng: 72.5714,
    bio: 'Psychiatrist providing mental health services and therapy.',
    education: 'MD, B.J. Medical College',
    languages: ['English', 'Hindi', 'Gujarati'],
  },
];

// Generate time slots for availability
const generateTimeSlots = (date) => {
  const slots = [];
  const hours = [9, 10, 11, 14, 15, 16, 17];
  hours.forEach((hour) => {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  });
  return slots;
};

// Get availability for a doctor on a specific date
export const getDoctorAvailability = (doctorId, date) => {
  // Simulate some slots being booked
  const allSlots = generateTimeSlots(date);
  const bookedSlots = Math.floor(Math.random() * 2); // 0-1 booked slots
  const availableSlots = allSlots.slice(0, allSlots.length - bookedSlots);
  return { slots: availableSlots };
};

// LocalStorage keys
const APPOINTMENTS_KEY = 'medappoint_appointments';
const PRESCRIPTIONS_KEY = 'medappoint_prescriptions';
const MESSAGES_KEY = 'medappoint_messages';

// Get appointments from localStorage
export const getAppointments = (patientId) => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = stored ? JSON.parse(stored) : [];
  return appointments.filter((apt) => apt.patientId === patientId);
};

// Save appointment to localStorage
export const saveAppointment = (appointmentData) => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = stored ? JSON.parse(stored) : [];
  
  const appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...appointmentData,
    status: appointmentData.appointmentType === 'emergency' ? 'pending' : 'confirmed',
    createdAt: new Date().toISOString(),
    doctor: mockDoctors.find((d) => d.id === appointmentData.doctorId),
  };

  // Add emergency triage if emergency appointment
  if (appointmentData.appointmentType === 'emergency') {
    const symptoms = appointmentData.symptoms || [];
    const symptomScores = {
      'Chest pain': 3,
      'Difficulty breathing': 3,
      'Heavy bleeding': 3,
      'Loss of consciousness': 3,
      'Vomiting blood': 3,
      'Accident/trauma': 2,
      'High fever': 2,
      'Severe headache': 1,
    };
    
    const emergencyScore = symptoms.reduce(
      (sum, symptom) => sum + (symptomScores[symptom] || 0),
      0
    );
    
    let severityLevel = 'low';
    if (emergencyScore >= 6) severityLevel = 'high';
    else if (emergencyScore >= 3) severityLevel = 'medium';

    appointment.emergencyTriage = {
      emergencyScore,
      severityLevel,
      symptoms: JSON.stringify(symptoms),
    };

    if (severityLevel !== 'low') {
      appointment.emergencyQueue = {
        status: severityLevel === 'high' ? 'approved' : 'pending',
      };
    }
  }

  appointments.push(appointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  
  return appointment;
};

// Update appointment
export const updateAppointment = (appointmentId, updates) => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = stored ? JSON.parse(stored) : [];
  const index = appointments.findIndex((apt) => apt.id === appointmentId);
  
  if (index !== -1) {
    const appointment = { ...appointments[index] };
    
    // Handle nested updates like 'emergencyQueue.status'
    Object.keys(updates).forEach((key) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (!appointment[parent]) appointment[parent] = {};
        appointment[parent][child] = updates[key];
      } else {
        appointment[key] = updates[key];
      }
    });
    
    appointments[index] = appointment;
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return appointments[index];
  }
  return null;
};

// Delete appointment
export const deleteAppointment = (appointmentId) => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = stored ? JSON.parse(stored) : [];
  const filtered = appointments.filter((apt) => apt.id !== appointmentId);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
};

// Get appointments by doctor
export const getAppointmentsByDoctor = (doctorId) => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = stored ? JSON.parse(stored) : [];
  return appointments.filter((apt) => apt.doctorId === doctorId);
};

// Prescriptions
export const savePrescription = (prescriptionData) => {
  const stored = localStorage.getItem(PRESCRIPTIONS_KEY);
  const prescriptions = stored ? JSON.parse(stored) : [];
  
  const prescription = {
    id: `pres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...prescriptionData,
    createdAt: new Date().toISOString(),
  };
  
  prescriptions.push(prescription);
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
  return prescription;
};

export const getPrescriptions = (appointmentId) => {
  const stored = localStorage.getItem(PRESCRIPTIONS_KEY);
  const prescriptions = stored ? JSON.parse(stored) : [];
  return prescriptions.filter((pres) => pres.appointmentId === appointmentId);
};

// Messages
export const saveMessage = (messageData) => {
  const stored = localStorage.getItem(MESSAGES_KEY);
  const messages = stored ? JSON.parse(stored) : [];
  
  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...messageData,
    createdAt: new Date().toISOString(),
  };
  
  messages.push(message);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return message;
};

export const getMessages = (appointmentId) => {
  const stored = localStorage.getItem(MESSAGES_KEY);
  const messages = stored ? JSON.parse(stored) : [];
  return messages
    .filter((msg) => msg.appointmentId === appointmentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

