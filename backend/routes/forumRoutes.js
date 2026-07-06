import express from 'express';
import {
  addReply,
  upvoteQuestion
} from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:questionId/reply')
  .post(protect, addReply);

router.route('/:questionId/upvote')
  .put(protect, upvoteQuestion);

export default router;
