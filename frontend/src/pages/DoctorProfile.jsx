import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorAPI } from '../utils/api';

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    } else {
      setSlots([]);
    }
  }, [selectedDate, doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const data = await doctorAPI.getById(doctorId);
      setDoctor(data);
    } catch (error) {
      console.error('Error loading doctor:', error);
      alert('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    try {
      setLoadingSlots(true);
      const data = await doctorAPI.getAvailability(doctorId, selectedDate);
      setSlots(data.slots || []);
    } catch (error) {
      console.error('Error loading availability:', error);
      alert('Failed to load availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="text-gray-500 mt-4">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-red-500 text-xl">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 animate-fade-in max-w-5xl mx-auto">
      <Link
        to="/doctors"
        className="inline-flex items-center space-x-3 text-teal-600 hover:text-teal-700 mb-8 font-bold text-lg transition-all transform hover:translate-x-[-4px] group"
      >
        <span className="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Doctors</span>
      </Link>

      <div className="card p-10 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-300 shadow-2xl transform hover:scale-105 transition-all duration-300 ring-4 ring-blue-300 ring-offset-4">
                <img 
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face" 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300/14b8a6/ffffff?text=Dr.';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                ⭐
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 gradient-text">{doctor.name}</h1>
            <p className="text-3xl text-teal-600 font-bold mb-8 bg-gradient-to-r from-teal-100 to-blue-100 px-6 py-3 rounded-xl inline-block">
              {doctor.specialty}
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Hospital:</span>
                <span>{doctor.hospital}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Location:</span>
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Rating:</span>
                <span className="flex items-center">
                  ⭐ {doctor.rating} / 5.0
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Experience:</span>
                <span>{doctor.experienceYears} years</span>
              </div>
              {doctor.telemedicineAvailable && (
                <div className="md:col-span-2">
                  <span className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold">
                    💻 Telemedicine Available
                  </span>
                </div>
              )}
            </div>
            {doctor.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="card p-8 mb-6">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center space-x-3">
          <span>📅</span>
          <span>Select Date & Time</span>
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a Date
          </label>
            <input
            type="date"
            min={getMinDate()}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-6 py-4 w-full md:w-auto focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium shadow-sm hover:shadow-md text-lg"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Time Slots</h3>
            {loadingSlots ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-500 border-t-transparent"></div>
                <span>Loading slots...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">
                No available slots for this date
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <Link
                    key={slot}
                    to={`/book/${doctorId}?date=${selectedDate}&time=${slot}`}
                    className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 hover:from-teal-100 hover:via-blue-100 hover:to-purple-100 text-teal-700 border-2 border-teal-300 rounded-xl px-6 py-4 text-center font-bold transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-xl text-lg"
                  >
                    {slot}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
