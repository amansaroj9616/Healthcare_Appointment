import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../utils/api';
import { getOrCreatePatientId } from '../utils/patientId';

const EMERGENCY_SYMPTOMS = [
  { name: 'Chest pain', score: 3 },
  { name: 'Difficulty breathing', score: 3 },
  { name: 'Heavy bleeding', score: 3 },
  { name: 'Loss of consciousness', score: 3 },
  { name: 'Vomiting blood', score: 3 },
  { name: 'Accident/trauma', score: 2 },
  { name: 'High fever', score: 2 },
  { name: 'Severe headache', score: 1 },
];

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [appointmentDate, setAppointmentDate] = useState(
    searchParams.get('date') || ''
  );
  const [timeSlot, setTimeSlot] = useState(searchParams.get('time') || '');
  const [appointmentType, setAppointmentType] = useState('normal');
  const [mode, setMode] = useState('clinic');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientLocation, setPatientLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    loadDoctor();
    getPatientLocation();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const data = await doctorAPI.getById(doctorId);
      setDoctor(data);
      if (data && !data.telemedicineAvailable) {
        setMode('clinic');
      }
    } catch (error) {
      console.error('Error loading doctor:', error);
      alert('Failed to load doctor');
    } finally {
      setLoading(false);
    }
  };

  const getPatientLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPatientLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Could not get your location');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentDate || !timeSlot) {
      alert('Please select date and time slot');
      return;
    }

    if (appointmentType === 'emergency' && selectedSymptoms.length === 0) {
      alert('Please select at least one symptom for emergency appointments');
      return;
    }

    try {
      setSubmitting(true);
      const patientId = getOrCreatePatientId();

      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate).toISOString(),
        timeSlot,
        appointmentType,
        mode,
        symptoms: selectedSymptoms,
        patientLat: patientLocation?.lat,
        patientLng: patientLocation?.lng,
      };

      const appointment = await appointmentAPI.create(appointmentData);

      // Show distance warning if applicable
      if (appointment.distanceWarning) {
        alert(
          'You seem far from this doctor. For critical emergencies, please go to the nearest hospital.'
        );
      }

      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Book Appointment</h1>

      {doctor && (
        <div className="card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-3xl">
              👨‍⚕️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
              <p className="text-teal-600 font-semibold">{doctor.specialty}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8">
        {/* Date and Time */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Slot
          </label>
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
          />
        </div>

        {/* Appointment Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Appointment Type
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                value="normal"
                checked={appointmentType === 'normal'}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="mr-3 w-5 h-5 text-teal-600"
              />
              <span className="text-lg font-medium">Normal</span>
            </label>
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                value="emergency"
                checked={appointmentType === 'emergency'}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="mr-3 w-5 h-5 text-red-600"
              />
              <span className="text-lg font-medium text-red-600">Emergency</span>
            </label>
          </div>
        </div>

        {/* Emergency Triage Form */}
        {appointmentType === 'emergency' && (
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center space-x-2">
              <span>🚑</span>
              <span>Emergency Triage - Select Symptoms</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {EMERGENCY_SYMPTOMS.map((symptom) => (
                <label
                  key={symptom.name}
                  className={`flex items-center p-3 bg-white rounded-lg border-2 cursor-pointer transition ${
                    selectedSymptoms.includes(symptom.name)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.name)}
                    onChange={() => handleSymptomToggle(symptom.name)}
                    className="mr-3 w-5 h-5 text-red-600"
                  />
                  <span className="font-medium">
                    {symptom.name} <span className="text-red-600">(Score: {symptom.score})</span>
                  </span>
                </label>
              ))}
            </div>
            {selectedSymptoms.length > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Selected Symptoms:</p>
                <p className="text-sm text-gray-600">{selectedSymptoms.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Mode */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mode
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                value="clinic"
                checked={mode === 'clinic'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-3 w-5 h-5 text-teal-600"
              />
              <span className="text-lg font-medium">🏥 Clinic Visit</span>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-lg transition ${
              !doctor?.telemedicineAvailable 
                ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed' 
                : 'border-gray-200 cursor-pointer hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                value="telemedicine"
                checked={mode === 'telemedicine'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-3 w-5 h-5 text-teal-600"
                disabled={!doctor?.telemedicineAvailable}
              />
              <span className="text-lg font-medium">💻 Telemedicine</span>
              {!doctor?.telemedicineAvailable && (
                <span className="ml-2 text-sm text-gray-500">(Not available for this doctor)</span>
              )}
            </label>
          </div>
        </div>

        {/* Location Status */}
        {patientLocation && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <span>✓</span>
            <span className="text-green-700 font-medium">Location detected</span>
          </div>
        )}
        {locationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
            <span>⚠</span>
            <span className="text-yellow-700">{locationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              <span>Booking...</span>
            </span>
          ) : (
            'Book Appointment'
          )}
        </button>
      </form>
    </div>
  );
}
