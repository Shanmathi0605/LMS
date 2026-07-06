import express from 'express';
import {
  getCourseQuizzes,
  submitQuiz
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mount course-specific quiz routes elsewhere? 
// No, we can just export a router that handles /api/quizzes/:id/submit
// and use courseRoutes to handle /api/courses/:courseId/quizzes

router.route('/:id/submit')
  .post(protect, submitQuiz);

export default router;
