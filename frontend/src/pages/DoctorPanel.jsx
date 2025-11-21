import { useState, useEffect } from 'react';
import { doctorAPI, doctorPanelAPI } from '../utils/api';

export default function DoctorPanel() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: '',
    notes: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      loadAppointments();
    } else {
      setAppointments([]);
    }
  }, [selectedDoctorId]);

  const loadDoctors = async () => {
    try {
      const data = await doctorAPI.getAll();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await doctorPanelAPI.getAppointments(selectedDoctorId);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEmergency = async (appointmentId) => {
    try {
      await doctorPanelAPI.approveEmergency(appointmentId);
      alert('Emergency approved');
      loadAppointments();
    } catch (error) {
      console.error('Error approving emergency:', error);
      alert(error.message || 'Failed to approve');
    }
  };

  const handleRejectEmergency = async (appointmentId) => {
    try {
      await doctorPanelAPI.rejectEmergency(appointmentId);
      alert('Emergency rejected');
      loadAppointments();
    } catch (error) {
      console.error('Error rejecting emergency:', error);
      alert(error.message || 'Failed to reject');
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await doctorPanelAPI.markCompleted(appointmentId);
      alert('Appointment marked as completed');
      loadAppointments();
    } catch (error) {
      console.error('Error marking completed:', error);
      alert(error.message || 'Failed to mark completed');
    }
  };

  const handleCreatePrescription = async () => {
    if (!selectedAppointment) return;

    try {
      const medications = prescriptionData.medications
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m);

      await doctorPanelAPI.createPrescription({
        appointmentId: selectedAppointment.id,
        doctorId: selectedAppointment.doctorId,
        medications,
        notes: prescriptionData.notes,
      });

      alert('Prescription created');
      setSelectedAppointment(null);
      setPrescriptionData({ medications: '', notes: '' });
      loadAppointments();
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert(error.message || 'Failed to create prescription');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="px-4 py-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
        Doctor Panel
      </h1>

      {/* Doctor Selection */}
      <div className="card p-6 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Doctor
        </label>
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-xl">
            {selectedDoctorId
              ? 'No appointments found'
              : 'Please select a doctor to view appointments'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={`card p-6 animate-slide-up ${
                appointment.emergencyTriage?.severityLevel === 'high'
                  ? 'border-l-4 border-red-500'
                  : appointment.emergencyTriage?.severityLevel === 'medium'
                  ? 'border-l-4 border-orange-500'
                  : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-gray-600 mb-2 font-medium">
                    Patient ID: <span className="font-semibold">{appointment.patientId}</span>
                  </p>
                  <p className="text-gray-700 mb-2 flex items-center space-x-2">
                    <span>📅</span>
                    <span>
                      {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}
                    </span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Type: <span className="font-semibold">{appointment.appointmentType}</span> | 
                    Mode: <span className="font-semibold">{appointment.mode}</span>
                  </p>
                  <p className="text-gray-700 mb-4">
                    Status: <span className="font-semibold text-teal-600">{appointment.status}</span>
                  </p>
                  {appointment.emergencyTriage && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-bold text-red-800 mb-2 flex items-center space-x-2">
                        <span>🚑</span>
                        <span>Emergency Triage</span>
                      </p>
                      <p className="text-sm text-red-700 mb-1">
                        Score: <span className="font-semibold">{appointment.emergencyTriage.emergencyScore}</span> | 
                        Severity: <span className="font-semibold">{appointment.emergencyTriage.severityLevel}</span>
                      </p>
                      <p className="text-sm text-red-700">
                        Symptoms:{' '}
                        {JSON.parse(appointment.emergencyTriage.symptoms).join(', ')}
                      </p>
                    </div>
                  )}
                  {appointment.emergencyQueue && (
                    <p className="text-orange-600 font-semibold mb-2">
                      Queue Status: {appointment.emergencyQueue.status}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  {appointment.emergencyQueue &&
                    appointment.emergencyQueue.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveEmergency(appointment.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectEmergency(appointment.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  {appointment.status !== 'completed' &&
                    appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => handleMarkCompleted(appointment.id)}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg text-sm"
                  >
                    Add Prescription
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-md w-full animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Add Prescription</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medications (comma-separated)
              </label>
              <input
                type="text"
                value={prescriptionData.medications}
                onChange={(e) =>
                  setPrescriptionData({
                    ...prescriptionData,
                    medications: e.target.value,
                  })
                }
                placeholder="e.g., Paracetamol 500mg, Ibuprofen 200mg"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={prescriptionData.notes}
                onChange={(e) =>
                  setPrescriptionData({
                    ...prescriptionData,
                    notes: e.target.value,
                  })
                }
                rows="4"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreatePrescription}
                className="flex-1 btn-primary py-2"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  setPrescriptionData({ medications: '', notes: '' });
                }}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
