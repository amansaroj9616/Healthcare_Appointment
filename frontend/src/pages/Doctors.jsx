import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../utils/api';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    telemedicineAvailable: '',
    sortBy: '',
    search: '',
  });

  const specialties = [
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'General Medicine',
    'Oncology',
    'Psychiatry',
  ];

  useEffect(() => {
    loadDoctors();
  }, [filters]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorAPI.getAll(filters);
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="px-4 py-8 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text text-shadow-lg">
          Find a Doctor
        </h1>
        <p className="text-gray-700 text-xl font-medium">
          Browse our network of experienced healthcare professionals
        </p>
      </div>

      {/* Filters */}
      <div className="card p-8 mb-10">
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center space-x-2">
          <span>🔍</span>
          <span>Search & Filter</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <select
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white font-medium shadow-sm hover:shadow-md"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white font-medium shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telemedicine
            </label>
            <select
              value={filters.telemedicineAvailable}
              onChange={(e) =>
                handleFilterChange('telemedicineAvailable', e.target.value)
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white font-medium shadow-sm hover:shadow-md"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white font-medium shadow-sm hover:shadow-md"
            >
              <option value="">Default</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="experience">Experience (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, specialty, or location"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white font-medium shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Doctors List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl">No doctors found</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="card-hover p-8 animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-teal-600 font-bold text-xl mb-4 bg-gradient-to-r from-teal-100 to-blue-100 px-4 py-2 rounded-lg inline-block">
                    {doctor.specialty}
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-teal-300 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-2 ring-blue-300 ring-offset-2">
                  <img 
                    src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face" 
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200/14b8a6/ffffff?text=Dr.';
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p className="flex items-center space-x-2">
                  <span>🏥</span>
                  <span>{doctor.hospital}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{doctor.location}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span className="font-semibold">{doctor.rating} / 5.0</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>👨‍⚕️</span>
                  <span>{doctor.experienceYears} years experience</span>
                </p>
                {doctor.telemedicineAvailable && (
                  <p className="flex items-center space-x-2 text-teal-600 font-semibold">
                    <span>💻</span>
                    <span>Telemedicine Available</span>
                  </p>
                )}
              </div>
              
              <Link
                to={`/doctors/${doctor.id}`}
                className="block w-full text-center btn-primary py-4 text-lg font-bold group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>View Profile</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
