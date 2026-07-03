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

    const sampleCourses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn full-stack web development with HTML, CSS, JavaScript, React, and Node.js.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 49.99,
        isPublished: true,
      },
      {
        title: 'Mastering React 18',
        description: 'A deep dive into React ecosystem including hooks, context API, and Redux.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 39.99,
        isPublished: true,
      },
      {
        title: 'Python for Data Science',
        description: 'Start your journey in Data Science and Machine Learning with Python.',
        category: 'Data Science',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 59.99,
        isPublished: true,
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn to design beautiful, engaging user interfaces and experiences using Figma.',
        category: 'Design',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 29.99,
        isPublished: true,
      },
      {
        title: 'Advanced Node.js Architecture',
        description: 'Build scalable, fast, and secure backend systems using Node, Express and MongoDB.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 69.99,
        isPublished: true,
      },
      {
        title: 'Digital Marketing 101',
        description: 'Grow your business with SEO, Social Media Marketing, and Google Ads.',
        category: 'Marketing',
        thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
        instructor: teacherId,
        price: 19.99,
        isPublished: true,
      }
    ];

    await Course.insertMany(sampleCourses);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();
