import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import BlogPost from '../models/BlogPost.js';
import { slugify } from './slugify.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quran-academy';

const COURSE_CATALOG = [
  {
    title: 'Noorani Qaida',
    shortDescription: 'Foundation course for Arabic letters and Quran reading basics.',
    description:
      'Master Arabic alphabet, pronunciation, and joining rules with structured Noorani Qaida lessons suitable for beginners and kids.',
    duration: '2-3 months',
    level: 'beginner',
    price: 29,
  },
  {
    title: 'Quran Reading',
    shortDescription: 'Fluent Quran reading with correct articulation.',
    description:
      'Build fluency in reading the Holy Quran with guided practice and personalized feedback from certified teachers.',
    duration: '3-6 months',
    level: 'beginner',
    price: 39,
  },
  {
    title: 'Quran Memorization',
    shortDescription: 'Structured Hifz program with revision cycles.',
    description:
      'Memorize the Quran with proven techniques, daily targets, and consistent murajaah (revision) support.',
    duration: 'Flexible',
    level: 'intermediate',
    price: 49,
  },
  {
    title: 'Tajweed',
    shortDescription: 'Learn rules of Tajweed for beautiful recitation.',
    description:
      'Study makharij, sifat, and advanced Tajweed rules to improve clarity and beauty of your Quran recitation.',
    duration: '3-4 months',
    level: 'intermediate',
    price: 45,
  },
  {
    title: 'Tafseer',
    shortDescription: 'Understand the meanings of the Quran.',
    description:
      'Explore selected Surahs with accessible Tafseer explanations suitable for students seeking deeper understanding.',
    duration: '4-6 months',
    level: 'advanced',
    price: 55,
  },
  {
    title: 'Islamic Studies',
    shortDescription: 'Core Islamic knowledge for daily life.',
    description:
      'Learn essentials of Aqeedah, Fiqh, Seerah, and manners in an engaging online classroom format.',
    duration: 'Ongoing',
    level: 'all',
    price: 35,
  },
  {
    title: 'Kids Quran',
    shortDescription: 'Engaging Quran lessons designed for children.',
    description:
      'Interactive Quran classes for kids with short sessions, games, and age-appropriate teaching methods.',
    duration: 'Flexible',
    level: 'beginner',
    price: 25,
  },
  {
    title: 'Adults Quran',
    shortDescription: 'Quran learning tailored for adult beginners.',
    description:
      'A respectful, paced program for adults starting or returning to Quran learning with flexible scheduling.',
    duration: 'Flexible',
    level: 'beginner',
    price: 40,
  },
  {
    title: 'Basic Arabic',
    shortDescription: 'Introductory Arabic language for Quran learners.',
    description:
      'Build vocabulary and grammar foundations that support better Quran comprehension and conversation basics.',
    duration: '3 months',
    level: 'beginner',
    price: 35,
  },
];

/**
 * Development-only seed credentials — DO NOT use in production.
 */
const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected for seeding...');

  await Promise.all([
    User.deleteMany({
      email: {
        $in: [
          'admin@quranacademy.dev',
          'student@quranacademy.dev',
          'teacher@quranacademy.dev',
          'teacher2@quranacademy.dev',
        ],
      },
    }),
    Course.deleteMany({}),
    Teacher.deleteMany({}),
    BlogPost.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Dev Admin',
    email: 'admin@quranacademy.dev',
    password: 'Admin1234',
    role: 'admin',
    isActive: true,
    isVerified: true,
  });

  const student = await User.create({
    name: 'Dev Student',
    email: 'student@quranacademy.dev',
    password: 'Student1234',
    role: 'student',
    phone: '+10000000001',
    isActive: true,
    isVerified: true,
  });

  const teacherUser = await User.create({
    name: 'Aisha Rahman',
    email: 'teacher@quranacademy.dev',
    password: 'Teacher1234',
    role: 'teacher',
    phone: '+10000000002',
    isActive: true,
    isVerified: true,
  });

  const teacherUser2 = await User.create({
    name: 'Omar Hassan',
    email: 'teacher2@quranacademy.dev',
    password: 'Teacher1234',
    role: 'teacher',
    phone: '+10000000003',
    isActive: true,
    isVerified: true,
  });

  await Teacher.create({
    userId: teacherUser._id,
    bio: 'Certified Quran teacher with a focus on Tajweed and kids education.',
    qualification: 'Ijazah in Quran Recitation',
    experience: 8,
    languages: ['English', 'Arabic', 'Urdu'],
    specialization: ['Tajweed', 'Kids Quran', 'Noorani Qaida'],
    hourlyRate: 18,
    country: 'Pakistan',
    gender: 'female',
    timezone: 'Asia/Karachi',
    rating: 4.9,
    totalReviews: 42,
    isApproved: true,
    applicationStatus: 'approved',
    availability: [
      { day: 'monday', startTime: '18:00', endTime: '21:00', isOff: false },
      { day: 'tuesday', startTime: '18:00', endTime: '21:00', isOff: false },
      { day: 'wednesday', startTime: '00:00', endTime: '00:00', isOff: true },
      { day: 'thursday', startTime: '18:00', endTime: '22:00', isOff: false },
      { day: 'friday', startTime: '16:00', endTime: '20:00', isOff: false },
      { day: 'saturday', startTime: '10:00', endTime: '14:00', isOff: false },
      { day: 'sunday', startTime: '00:00', endTime: '00:00', isOff: true },
    ],
  });

  await Teacher.create({
    userId: teacherUser2._id,
    bio: 'Hafiz and Arabic instructor helping adults build strong Quran foundations.',
    qualification: 'Al-Azhar Graduate',
    experience: 12,
    languages: ['English', 'Arabic'],
    specialization: ['Quran Memorization', 'Tafseer', 'Basic Arabic'],
    hourlyRate: 25,
    country: 'Egypt',
    gender: 'male',
    timezone: 'Africa/Cairo',
    rating: 4.8,
    totalReviews: 67,
    isApproved: true,
    applicationStatus: 'approved',
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '13:00', isOff: false },
      { day: 'tuesday', startTime: '09:00', endTime: '13:00', isOff: false },
      { day: 'wednesday', startTime: '09:00', endTime: '13:00', isOff: false },
      { day: 'thursday', startTime: '09:00', endTime: '13:00', isOff: false },
      { day: 'friday', startTime: '00:00', endTime: '00:00', isOff: true },
      { day: 'saturday', startTime: '10:00', endTime: '15:00', isOff: false },
      { day: 'sunday', startTime: '10:00', endTime: '15:00', isOff: false },
    ],
  });

  const courses = await Course.insertMany(
    COURSE_CATALOG.map((course) => ({
      ...course,
      slug: slugify(course.title),
      isActive: true,
      lessons: [
        { title: 'Introduction', description: 'Course overview', order: 1, durationMinutes: 30 },
        { title: 'Core Practice', description: 'Guided practice session', order: 2, durationMinutes: 45 },
        { title: 'Assessment', description: 'Progress check', order: 3, durationMinutes: 30 },
      ],
    }))
  );

  await BlogPost.create({
    title: 'How to Start Learning Quran Online',
    slug: 'how-to-start-learning-quran-online',
    excerpt: 'Practical tips for beginners starting their online Quran journey.',
    content:
      'Starting online Quran learning is easier than ever. Choose a course that matches your level, book a free trial, and stay consistent with short daily practice.',
    author: admin._id,
    category: 'Guides',
    tags: ['beginners', 'online learning'],
    isPublished: true,
    publishedAt: new Date(),
  });

  await BlogPost.create({
    title: 'Why Tajweed Matters',
    slug: 'why-tajweed-matters',
    excerpt: 'Understanding the importance of correct Quranic pronunciation.',
    content:
      'Tajweed preserves the beauty and accuracy of Quran recitation. Learning the rules helps avoid common mistakes and builds confidence in prayer.',
    author: admin._id,
    category: 'Tajweed',
    tags: ['tajweed', 'recitation'],
    isPublished: true,
    publishedAt: new Date(),
  });

  console.log('\n=== DEVELOPMENT SEED CREDENTIALS (dev only) ===');
  console.log('Admin:    admin@quranacademy.dev / Admin1234');
  console.log('Student:  student@quranacademy.dev / Student1234');
  console.log('Teacher:  teacher@quranacademy.dev / Teacher1234');
  console.log('Teacher2: teacher2@quranacademy.dev / Teacher1234');
  console.log('================================================\n');
  console.log(`Seeded ${courses.length} courses, 2 teachers, 2 blog posts`);
  console.log('Users:', {
    admin: admin.email,
    student: student.email,
    teacher: teacherUser.email,
  });

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
