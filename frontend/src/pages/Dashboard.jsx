import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../utils/api';
import { getOrCreatePatientId } from '../utils/patientId';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const patientId = getOrCreatePatientId();
      const data = await appointmentAPI.getByPatientId(patientId);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (appointmentId) => {
    if (!newDate || !newTime) {
      alert('Please select new date and time');
      return;
    }

    try {
      await appointmentAPI.reschedule(appointmentId, {
        appointmentDate: newDate,
        timeSlot: newTime,
      });
      alert('Appointment rescheduled successfully');
      setReschedulingId(null);
      setNewDate('');
      setNewTime('');
      loadAppointments();
    } catch (error) {
      console.error('Error rescheduling:', error);
      alert(error.message || 'Failed to reschedule');
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancel(appointmentId);
      alert('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error cancelling:', error);
      alert(error.message || 'Failed to cancel');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString, timeSlot) => {
    return `${formatDate(dateString)} at ${timeSlot}`;
  };

  const isUpcoming = (appointmentDate) => {
    return new Date(appointmentDate) >= new Date();
  };

  const upcomingAppointments = appointments.filter((apt) =>
    isUpcoming(apt.appointmentDate) && apt.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(
    (apt) => !isUpcoming(apt.appointmentDate) || apt.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="text-gray-500 mt-4">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text text-shadow-lg">
          My Appointments
        </h1>
        <p className="text-gray-700 text-xl font-medium">
          Manage your upcoming and past appointments
        </p>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-800 flex items-center space-x-3">
          <span className="text-5xl">📅</span>
          <span>Upcoming</span>
        </h2>
        {upcomingAppointments.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-xl">No upcoming appointments</p>
            <Link to="/doctors" className="btn-primary mt-6 inline-block">
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="card-hover p-8 animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start space-x-6 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-teal-300 shadow-xl transform group-hover:scale-110 transition-all duration-300 ring-2 ring-blue-300 ring-offset-2">
                        <img 
                          src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face" 
                          alt={appointment.doctor?.name || 'Doctor'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200/14b8a6/ffffff?text=Dr.';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                          {appointment.doctor?.name || 'Unknown Doctor'}
                        </h3>
                        <p className="text-teal-600 font-bold text-xl mb-4 bg-gradient-to-r from-teal-100 to-blue-100 px-4 py-2 rounded-lg inline-block">
                          {appointment.doctor?.specialty || 'N/A'}
                        </p>
                        <div className="space-y-2 text-gray-600">
                          <p className="flex items-center space-x-2">
                            <span>📅</span>
                            <span className="font-medium">
                              {formatDateTime(appointment.appointmentDate, appointment.timeSlot)}
                            </span>
                          </p>
                          <p className="flex items-center space-x-2">
                            <span>🏥</span>
                            <span>
                              Type: <span className="font-semibold">{appointment.appointmentType}</span> | 
                              Mode: <span className="font-semibold">{appointment.mode}</span>
                            </span>
                          </p>
                          {appointment.emergencyTriage && (
                            <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                              <p className="text-red-800 font-semibold flex items-center space-x-2">
                                <span>🚑</span>
                                <span>
                                  Emergency (Score: {appointment.emergencyTriage.emergencyScore}, 
                                  {appointment.emergencyTriage.severityLevel})
                                </span>
                              </p>
                            </div>
                          )}
                          {appointment.emergencyQueue && (
                            <p className="text-orange-600 font-semibold">
                              Status: {appointment.emergencyQueue.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    {appointment.mode === 'telemedicine' && (
                      <Link
                        to={`/teleconsult/${appointment.id}`}
                        className="btn-secondary text-center py-2 px-4"
                      >
                        Join Call
                      </Link>
                    )}
                    {reschedulingId === appointment.id ? (
                      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500"
                        />
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReschedule(appointment.id)}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setReschedulingId(null)}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setReschedulingId(appointment.id)}
                          className="bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 hover:from-teal-600 hover:via-teal-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-4xl font-extrabold mb-8 text-gray-800 flex items-center space-x-3">
          <span className="text-5xl">📜</span>
          <span>Past</span>
        </h2>
        {pastAppointments.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-xl">No past appointments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="card p-6 opacity-75 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300">
                    <img 
                      src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face" 
                      alt={appointment.doctor?.name || 'Doctor'}
                      className="w-full h-full object-cover opacity-75"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200/14b8a6/ffffff?text=Dr.';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-700 mb-1">
                      {appointment.doctor?.name || 'Unknown Doctor'}
                    </h3>
                    <p className="text-teal-600 font-semibold mb-2">
                      {appointment.doctor?.specialty || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      📅 {formatDateTime(appointment.appointmentDate, appointment.timeSlot)}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Status: <span className="font-semibold">{appointment.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
