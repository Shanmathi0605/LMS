import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';

dotenv.config();

connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    isApproved: true,
  },
  {
    name: 'John Teacher',
    email: 'teacher@test.com',
    password: 'password123',
    role: 'teacher',
    isApproved: true,
  },
  {
    name: 'Jane Student',
    email: 'student@test.com',
    password: 'password123',
    role: 'student',
  },
];

const importData = async () => {
  try {
    await Course.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const user of sampleUsers) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    
    const teacherId = createdUsers[1]._id;

    const categoryCounts = {
      'Web Development': 120,
      'Data Science': 85,
      'Mobile Design': 45,
      'Marketing': 60,
      'Photography': 30,
      'UI/UX Design': 75,
      'Business': 110,
      'Music': 20
    };

    const thumbnails = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'
    ];

    const allCourses = [];

    for (const [category, count] of Object.entries(categoryCounts)) {
      for (let i = 1; i <= count; i++) {
        allCourses.push({
          title: `${category} Course ${i}`,
          description: `This is a comprehensive course on ${category}. Learn the best practices and advanced techniques in this detailed masterclass.`,
          category: category,
          thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
          instructor: teacherId,
          price: Math.floor(Math.random() * 80) + 19.99, // Random price between 19.99 and 99.99
          isPublished: true,
        });
      }
    }

    await Course.insertMany(allCourses);

    console.log(`Data Imported successfully! Added ${allCourses.length} courses.`);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();
