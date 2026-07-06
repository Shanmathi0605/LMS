import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';
import Review from './models/Review.js';
import Question from './models/Question.js';
import Reply from './models/Reply.js';

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for cleanup');

    // Get all categories
    const categories = await Course.distinct('category');
    console.log(`Found categories:`, categories);

    const coursesToKeep = [];

    for (const category of categories) {
      // Find top 10 courses per category (you can sort by rating or just take first 10)
      const top10 = await Course.find({ category }).limit(10).select('_id');
      top10.forEach(c => coursesToKeep.push(c._id.toString()));
    }

    console.log(`Total courses to keep: ${coursesToKeep.length}`);

    // Find all courses not in coursesToKeep
    const coursesToDelete = await Course.find({ _id: { $nin: coursesToKeep } }).select('_id');
    const deleteIds = coursesToDelete.map(c => c._id);
    
    console.log(`Deleting ${deleteIds.length} courses and their related data...`);

    // Perform cascade delete for these course IDs
    await Course.deleteMany({ _id: { $in: deleteIds } });
    await Enrollment.deleteMany({ course: { $in: deleteIds } });
    await Lesson.deleteMany({ course: { $in: deleteIds } });
    await Quiz.deleteMany({ course: { $in: deleteIds } });
    await Review.deleteMany({ course: { $in: deleteIds } });
    await Question.deleteMany({ course: { $in: deleteIds } });
    
    // Also delete replies that belong to deleted questions
    // This is a bit tricky, let's just leave replies for now or delete all replies not tied to a valid question
    // We can do a cleanup of orphaned replies
    const validQuestions = await Question.find().select('_id');
    const validQuestionIds = validQuestions.map(q => q._id);
    await Reply.deleteMany({ question: { $nin: validQuestionIds } });

    console.log('Cleanup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
};

cleanup();
