import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/wishlist')
  .get(getWishlist);

router.route('/wishlist/:courseId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

export default router;
