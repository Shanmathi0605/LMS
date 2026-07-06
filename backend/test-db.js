import mongoose from 'mongoose';
import User from './models/User.js';
import Enrollment from './models/Enrollment.js';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/skillnova').then(async () => {
  try {
    const email = 'test_script@example.com';
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Creating user...');
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: 'tempPassword123'
      });
      console.log('User created:', user._id);
    }

    const course = await Course.findOne();
    if (!course) {
      console.log('No courses found to enroll in.');
      process.exit(0);
    }

    const courseId = course._id;
    const existingEnrollment = await Enrollment.findOne({ student: user._id, course: courseId });
    if (!existingEnrollment) {
      console.log('Creating enrollment...');
      await Enrollment.create({
        student: user._id,
        course: courseId,
        status: 'active'
      });
      console.log('Enrollment created.');
    } else {
      console.log('Enrollment already exists.');
    }
  } catch (err) {
    console.error('Error during DB operations:', err);
  } finally {
    mongoose.disconnect();
  }
});
