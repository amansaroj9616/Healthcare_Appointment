import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { appointmentAPI, telemedicineAPI, doctorPanelAPI } from '../utils/api';
import { getOrCreatePatientId } from '../utils/patientId';

export default function Teleconsult() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadAppointment();
    loadMessages();
    loadPrescriptions();

    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAppointment = async () => {
    try {
      const data = await appointmentAPI.getById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error('Error loading appointment:', error);
      alert('Failed to load appointment');
    }
  };

  const loadMessages = async () => {
    try {
      const data = await telemedicineAPI.getMessages(appointmentId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const data = await doctorPanelAPI.getPrescriptions(appointmentId);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const patientId = getOrCreatePatientId();
      await telemedicineAPI.createMessage({
        appointmentId,
        sender: 'patient',
        message: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!appointment) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 gradient-text">
        Telemedicine Consultation
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Doctor Video (Fake) */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
              <div className="text-white text-6xl">👨‍⚕️</div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">{appointment.doctor?.name || 'Doctor'}</p>
                <p className="text-sm text-gray-300">{appointment.doctor?.specialty || 'Specialist'}</p>
              </div>
              {!isCameraOn && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <p className="text-white text-xl">Camera Off</p>
                </div>
              )}
            </div>
          </div>

          {/* Patient Video (Fake) */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg aspect-video flex items-center justify-center relative">
              <div className="text-white text-6xl">👤</div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">You</p>
              </div>
              {!isCameraOn && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <p className="text-white text-xl">Camera Off</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                isMuted
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                isCameraOn
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
              }`}
            >
              {isCameraOn ? '📹 Camera On' : '📹 Camera Off'}
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg">
              📞 End Call
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Chat */}
          <div className="card p-4 h-96 flex flex-col">
            <h3 className="font-bold text-lg mb-3 gradient-text">Chat</h3>
            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender === 'doctor'
                        ? 'bg-teal-100 text-right ml-8'
                        : 'bg-blue-100 text-left mr-8'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 text-gray-600">{msg.sender}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md"
              >
                Send
              </button>
            </form>
          </div>

          {/* Prescriptions/Notes */}
          <div className="card p-4">
            <h3 className="font-bold text-lg mb-3 gradient-text">Prescription & Notes</h3>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-gray-500">No prescriptions yet</p>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border-t pt-3">
                    <p className="text-sm font-semibold mb-2 text-gray-700">Medications:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside mb-3 space-y-1">
                      {prescription.medications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                    {prescription.notes && (
                      <>
                        <p className="text-sm font-semibold mb-2 text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {prescription.notes}
                        </p>
                      </>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(prescription.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
