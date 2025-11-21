/**
 * API Service - Mock Data Version
 * Uses mock data stored in localStorage instead of backend API
 */

import {
  mockDoctors,
  getDoctorAvailability,
  getAppointments,
  saveAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctor,
  savePrescription,
  getPrescriptions,
  saveMessage,
  getMessages,
} from './mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Filter and sort doctors
const filterDoctors = (doctors, filters) => {
  let filtered = [...doctors];

  if (filters.specialty) {
    filtered = filtered.filter((d) => d.specialty === filters.specialty);
  }

  if (filters.location) {
    filtered = filtered.filter((d) =>
      d.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.telemedicineAvailable !== undefined && filters.telemedicineAvailable !== '') {
    const available = filters.telemedicineAvailable === 'true';
    filtered = filtered.filter((d) => d.telemedicineAvailable === available);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(searchLower) ||
        d.specialty.toLowerCase().includes(searchLower) ||
        d.location.toLowerCase().includes(searchLower) ||
        d.hospital.toLowerCase().includes(searchLower)
    );
  }

  if (filters.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'experience') {
    filtered.sort((a, b) => b.experienceYears - a.experienceYears);
  }

  return filtered;
};

// Doctor APIs
export const doctorAPI = {
  getAll: async (filters = {}) => {
    await delay();
    return filterDoctors(mockDoctors, filters);
  },

  getById: async (id) => {
    await delay();
    const doctor = mockDoctors.find((d) => d.id === id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return doctor;
  },

  getAvailability: async (id, date) => {
    await delay();
    return getDoctorAvailability(id, date);
  },
};

// Appointment APIs
export const appointmentAPI = {
  create: async (data) => {
    await delay(500);
    const appointment = saveAppointment(data);
    
    // Simulate distance warning for emergencies far from doctor
    if (data.appointmentType === 'emergency' && data.patientLat && data.patientLng) {
      const doctor = mockDoctors.find((d) => d.id === data.doctorId);
      if (doctor) {
        // Simple distance calculation (Haversine would be better, but this is mock)
        const latDiff = Math.abs(doctor.lat - data.patientLat);
        const lngDiff = Math.abs(doctor.lng - data.patientLng);
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km
        
        if (distance > 50) {
          appointment.distanceWarning = true;
        }
      }
    }
    
    return appointment;
  },

  getByPatientId: async (patientId) => {
    await delay();
    return getAppointments(patientId);
  },

  getById: async (id) => {
    await delay();
    const stored = localStorage.getItem('medappoint_appointments');
    const appointments = stored ? JSON.parse(stored) : [];
    const appointment = appointments.find((apt) => apt.id === id);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    return appointment;
  },

  reschedule: async (id, data) => {
    await delay(500);
    const updated = updateAppointment(id, {
      appointmentDate: new Date(data.appointmentDate).toISOString(),
      timeSlot: data.timeSlot,
    });
    
    if (!updated) {
      throw new Error('Appointment not found');
    }
    
    return updated;
  },

  cancel: async (id) => {
    await delay(500);
    deleteAppointment(id);
    return { success: true };
  },
};

// Doctor Panel APIs
export const doctorPanelAPI = {
  getAppointments: async (doctorId) => {
    await delay();
    return getAppointmentsByDoctor(doctorId);
  },

  approveEmergency: async (appointmentId) => {
    await delay(500);
    const updated = updateAppointment(appointmentId, {
      'emergencyQueue.status': 'approved',
      status: 'confirmed',
    });
    
    if (!updated) {
      throw new Error('Appointment not found');
    }
    
    return updated;
  },

  rejectEmergency: async (appointmentId) => {
    await delay(500);
    const updated = updateAppointment(appointmentId, {
      'emergencyQueue.status': 'rejected',
      status: 'cancelled',
    });
    
    if (!updated) {
      throw new Error('Appointment not found');
    }
    
    return updated;
  },

  markCompleted: async (id) => {
    await delay(500);
    const updated = updateAppointment(id, { status: 'completed' });
    
    if (!updated) {
      throw new Error('Appointment not found');
    }
    
    return updated;
  },

  createPrescription: async (data) => {
    await delay(500);
    return savePrescription(data);
  },

  getPrescriptions: async (appointmentId) => {
    await delay();
    return getPrescriptions(appointmentId);
  },
};

// Telemedicine APIs
export const telemedicineAPI = {
  createMessage: async (data) => {
    await delay(300);
    return saveMessage(data);
  },

  getMessages: async (appointmentId) => {
    await delay();
    return getMessages(appointmentId);
  },
};
