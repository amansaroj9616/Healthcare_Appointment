/**
 * Doctor Controller
 * Handles HTTP requests related to doctors
 */

import * as doctorService from '../services/doctorService.js';

/**
 * Get all doctors with filters, sorting, and search
 * GET /doctors
 */
export async function getAllDoctors(req, res) {
  try {
    const {
      specialty,
      location,
      telemedicineAvailable,
      sortBy,
      name,
      search,
    } = req.query;

    const filters = {};
    if (specialty) filters.specialty = specialty;
    if (location) filters.location = location;
    if (telemedicineAvailable !== undefined) {
      filters.telemedicineAvailable = telemedicineAvailable;
    }

    const sort = {};
    if (sortBy === 'rating') {
      sort.rating = 'desc';
    } else if (sortBy === 'experience') {
      sort.experience = 'desc';
    }

    const searchParams = {};
    if (name) searchParams.name = name;
    if (search) {
      // If generic search is provided, search in name, specialty, and location
      searchParams.name = search;
      searchParams.specialty = search;
      searchParams.location = search;
    }

    const doctors = await doctorService.getAllDoctors(filters, sort, searchParams);
    res.json(doctors);
  } catch (error) {
    console.error('Error in getAllDoctors:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch doctors' });
  }
}

/**
 * Get doctor by ID
 * GET /doctors/:id
 */
export async function getDoctorById(req, res) {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);
    res.json(doctor);
  } catch (error) {
    console.error('Error in getDoctorById:', error);
    if (error.message === 'Doctor not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch doctor' });
    }
  }
}

/**
 * Get doctor availability for a specific date
 * GET /doctors/:id/availability
 */
export async function getDoctorAvailability(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD)' });
    }

    const slots = await doctorService.getDoctorAvailability(id, date);
    res.json({ slots });
  } catch (error) {
    console.error('Error in getDoctorAvailability:', error);
    if (error.message === 'Doctor not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Failed to fetch availability' });
    }
  }
}

