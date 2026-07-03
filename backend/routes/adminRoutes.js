import express from 'express';
import {
  getUsers,
  approveTeacher,
  deleteUser,
  getAdminStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/approve', approveTeacher);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);

export default router;
