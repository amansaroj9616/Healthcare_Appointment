import { Link } from 'react-router-dom';
import { getOrCreatePatientId } from '../utils/patientId';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Initialize patient ID on first visit
    getOrCreatePatientId();
  }, []);

  return (
    <div className="px-4 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-20 mb-20 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="relative z-10">
          <div className="inline-block mb-8 transform hover:scale-110 transition-transform duration-300">
            <div className="relative">
              <span className="text-8xl animate-bounce-slow block">🏥</span>
              <span className="absolute inset-0 text-8xl opacity-50 blur-xl animate-pulse-slow">🏥</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 gradient-text text-shadow-lg">
            Welcome to MedAppoint
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Your trusted healthcare appointment scheduling system. Book appointments, 
            consult with doctors, and manage your health - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/doctors"
              className="btn-primary text-lg px-10 py-4 inline-flex items-center justify-center space-x-3 group"
            >
              <span className="text-2xl transform group-hover:scale-125 transition-transform">🔍</span>
              <span>Find a Doctor</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/dashboard"
              className="btn-secondary text-lg px-10 py-4 inline-flex items-center justify-center space-x-3 group"
            >
              <span className="text-2xl transform group-hover:scale-125 transition-transform">📅</span>
              <span>My Appointments</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="feature-card animate-slide-up group">
          <div className="text-7xl mb-6 text-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🔍</div>
          <h3 className="text-3xl font-extrabold mb-4 text-center gradient-text">
            Find Doctors
          </h3>
          <p className="text-gray-700 text-center leading-relaxed text-lg">
            Search and filter doctors by specialty, location, and availability. 
            View ratings, experience, and detailed profiles to find the perfect 
            healthcare provider for you.
          </p>
        </div>

        <div className="feature-card animate-slide-up group" style={{ animationDelay: '0.1s' }}>
          <div className="text-7xl mb-6 text-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">📅</div>
          <h3 className="text-3xl font-extrabold mb-4 text-center gradient-text">
            Book Appointments
          </h3>
          <p className="text-gray-700 text-center leading-relaxed text-lg">
            Schedule appointments easily with our intuitive booking system. 
            Choose between clinic visits or telemedicine consultations - 
            whatever works best for you.
          </p>
        </div>

        <div className="feature-card animate-slide-up group" style={{ animationDelay: '0.2s' }}>
          <div className="text-7xl mb-6 text-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🚑</div>
          <h3 className="text-3xl font-extrabold mb-4 text-center gradient-text">
            Emergency Care
          </h3>
          <p className="text-gray-700 text-center leading-relaxed text-lg">
            Our intelligent emergency triage system prioritizes critical cases 
            and ensures timely care when you need it most. Your health is our priority.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-8 glass-effect rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="text-5xl font-extrabold gradient-text mb-3">8+</div>
          <div className="text-gray-700 font-bold text-lg">Specialists</div>
        </div>
        <div className="text-center p-8 glass-effect rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="text-5xl font-extrabold gradient-text mb-3">24/7</div>
          <div className="text-gray-700 font-bold text-lg">Available</div>
        </div>
        <div className="text-center p-8 glass-effect rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="text-5xl font-extrabold gradient-text mb-3">100%</div>
          <div className="text-gray-700 font-bold text-lg">Secure</div>
        </div>
        <div className="text-center p-8 glass-effect rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="text-5xl font-extrabold gradient-text mb-3">∞</div>
          <div className="text-gray-700 font-bold text-lg">Care</div>
        </div>
      </div>
    </div>
  );
}
