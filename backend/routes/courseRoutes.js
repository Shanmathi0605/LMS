import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseReviews,
  addCourseReview,
} from '../controllers/courseController.js';
import { getCourseQuizzes } from '../controllers/quizController.js';
import { getCourseQuestions, askQuestion } from '../controllers/forumController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('teacher', 'admin'), updateCourse)
  .delete(protect, authorize('admin', 'instructor'), deleteCourse);

router.route('/:courseId/quizzes')
  .get(protect, getCourseQuizzes);

router.route('/:courseId/forum')
  .get(protect, getCourseQuestions)
  .post(protect, askQuestion);

router.route('/:id/reviews')
  .get(getCourseReviews)
  .post(protect, addCourseReview);

export default router;
