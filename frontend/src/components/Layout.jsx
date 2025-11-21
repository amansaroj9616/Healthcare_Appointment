import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50 shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-2 group"
              >
                <div className="relative">
                  <span className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🏥</span>
                  <span className="absolute inset-0 text-4xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300">🏥</span>
                </div>
                <span className="text-3xl font-extrabold gradient-text text-shadow">MedAppoint</span>
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-700'
                  }`}
                >
                  <span className="mr-2">🏠</span>
                  Home
                </Link>
                <Link
                  to="/doctors"
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/doctors'
                      ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-700'
                  }`}
                >
                  <span className="mr-2">👨‍⚕️</span>
                  Find Doctors
                </Link>
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/dashboard'
                      ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-700'
                  }`}
                >
                  <span className="mr-2">📅</span>
                  My Appointments
                </Link>
                <Link
                  to="/doctor-panel"
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/doctor-panel'
                      ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-700'
                  }`}
                >
                  <span className="mr-2">⚕️</span>
                  Doctor Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-3xl animate-pulse-slow">🏥</span>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                MedAppoint
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              © 2024 MedAppoint - Healthcare Appointment System. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs">
              Your trusted partner in healthcare management
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <span className="text-gray-500 hover:text-teal-400 transition-colors cursor-pointer">Privacy</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500 hover:text-teal-400 transition-colors cursor-pointer">Terms</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500 hover:text-teal-400 transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
