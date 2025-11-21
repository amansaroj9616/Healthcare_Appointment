import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create doctors
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experienceYears: 15,
      rating: 4.8,
      hospital: 'City General Hospital',
      location: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.0060,
      telemedicineAvailable: true,
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      experienceYears: 12,
      rating: 4.9,
      hospital: 'Children\'s Medical Center',
      location: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      telemedicineAvailable: true,
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      experienceYears: 8,
      rating: 4.7,
      hospital: 'Skin Care Clinic',
      location: 'Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298,
      telemedicineAvailable: true,
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      experienceYears: 20,
      rating: 4.6,
      hospital: 'Sports Medicine Center',
      location: 'Houston, TX',
      latitude: 29.7604,
      longitude: -95.3698,
      telemedicineAvailable: false,
    },
    {
      name: 'Dr. Lisa Anderson',
      specialty: 'Neurology',
      experienceYears: 18,
      rating: 4.9,
      hospital: 'Neurological Institute',
      location: 'Boston, MA',
      latitude: 42.3601,
      longitude: -71.0589,
      telemedicineAvailable: true,
    },
    {
      name: 'Dr. Robert Taylor',
      specialty: 'General Medicine',
      experienceYears: 10,
      rating: 4.5,
      hospital: 'Community Health Center',
      location: 'Phoenix, AZ',
      latitude: 33.4484,
      longitude: -112.0740,
      telemedicineAvailable: true,
    },
    {
      name: 'Dr. Maria Garcia',
      specialty: 'Oncology',
      experienceYears: 14,
      rating: 4.8,
      hospital: 'Cancer Treatment Center',
      location: 'Miami, FL',
      latitude: 25.7617,
      longitude: -80.1918,
      telemedicineAvailable: false,
    },
    {
      name: 'Dr. David Kim',
      specialty: 'Psychiatry',
      experienceYears: 11,
      rating: 4.7,
      hospital: 'Mental Health Clinic',
      location: 'Seattle, WA',
      latitude: 47.6062,
      longitude: -122.3321,
      telemedicineAvailable: true,
    },
  ];

  // Create doctors and their availability
  for (const doctorData of doctors) {
    const doctor = await prisma.doctor.create({
      data: {
        ...doctorData,
        availability: {
          create: [
            // Monday to Friday: 9 AM - 5 PM
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
            // Saturday: 9 AM - 1 PM
            { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' },
          ],
        },
      },
    });

    console.log(`Created doctor: ${doctor.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

