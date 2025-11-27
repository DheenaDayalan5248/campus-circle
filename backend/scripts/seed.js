const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const MadeBy = require('../models/MadeBy');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuscircle';

// Sample students data
const studentsData = [
  {
    rollNumber: 'ADMIN001',
    dob: '2000-01-01',
    name: 'Admin User',
    department: 'Administration',
    batch: '2020',
    profileImage: ''
  },
  {
    rollNumber: '21CAU001',
    dob: '2003-05-15',
    name: 'Rahul Sharma',
    department: 'Computer Science',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU002',
    dob: '2003-07-22',
    name: 'Priya Singh',
    department: 'Computer Science',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU003',
    dob: '2003-03-10',
    name: 'Amit Kumar',
    department: 'Computer Science',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU004',
    dob: '2003-08-30',
    name: 'Sneha Patel',
    department: 'Electronics',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU005',
    dob: '2003-11-05',
    name: 'Vikram Reddy',
    department: 'Electronics',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU006',
    dob: '2003-02-14',
    name: 'Anjali Gupta',
    department: 'Mechanical',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '21CAU007',
    dob: '2003-06-18',
    name: 'Rajesh Verma',
    department: 'Mechanical',
    batch: '2021',
    profileImage: ''
  },
  {
    rollNumber: '22CAU001',
    dob: '2004-01-25',
    name: 'Kavya Krishnan',
    department: 'Computer Science',
    batch: '2022',
    profileImage: ''
  },
  {
    rollNumber: '22CAU002',
    dob: '2004-04-12',
    name: 'Arjun Nair',
    department: 'Computer Science',
    batch: '2022',
    profileImage: ''
  },
  {
    rollNumber: '22CAU003',
    dob: '2004-09-08',
    name: 'Divya Menon',
    department: 'Electronics',
    batch: '2022',
    profileImage: ''
  },
  {
    rollNumber: '22CAU004',
    dob: '2004-12-20',
    name: 'Karthik Iyer',
    department: 'Mechanical',
    batch: '2022',
    profileImage: ''
  },
  {
    rollNumber: '23CAU001',
    dob: '2005-03-07',
    name: 'Meera Joshi',
    department: 'Computer Science',
    batch: '2023',
    profileImage: ''
  },
  {
    rollNumber: '23CAU002',
    dob: '2005-05-19',
    name: 'Rohan Kapoor',
    department: 'Computer Science',
    batch: '2023',
    profileImage: ''
  },
  {
    rollNumber: '23CAU003',
    dob: '2005-07-28',
    name: 'Neha Agarwal',
    department: 'Electronics',
    batch: '2023',
    profileImage: ''
  }
];

// Developer info
const developerInfo = {
  developerName: 'Your Name',
  github: 'https://github.com/yourusername',
  instagram: 'https://instagram.com/yourusername',
  message: 'Built with ❤️ for our college community. CampusCircle aims to connect students and foster meaningful interactions within our campus.',
  email: 'your.email@example.com',
  portfolio: 'https://yourportfolio.com'
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Student.deleteMany({});
    await MadeBy.deleteMany({});
    console.log('Existing data cleared');

    // Insert students
    console.log('Inserting students...');
    await Student.insertMany(studentsData);
    console.log(`${studentsData.length} students inserted`);

    // Insert developer info
    console.log('Inserting developer info...');
    await MadeBy.create(developerInfo);
    console.log('Developer info inserted');

    console.log('\n=== Seed completed successfully! ===\n');
    console.log('Sample login credentials:');
    console.log('Admin:');
    console.log('  Roll Number: ADMIN001');
    console.log('  DOB: 2000-01-01');
    console.log('\nStudent:');
    console.log('  Roll Number: 23CAU001');
    console.log('  DOB: 2005-03-07');
    console.log('\nYou can use any of the seeded students to login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();



