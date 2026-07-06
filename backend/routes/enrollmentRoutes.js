import express from 'express';
import {
  getMyEnrollments,
  updateProgress,
  checkEnrollment
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/my-enrollments').get(getMyEnrollments);
router.route('/check/:courseId').get(checkEnrollment);
router.route('/:courseId/progress').put(updateProgress);

export default router;
