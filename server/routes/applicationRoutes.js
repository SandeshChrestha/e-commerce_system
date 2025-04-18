import express from 'express';
import {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').post(createApplication);

// Admin routes
router.route('/').get(protect, admin, getAllApplications);
router
  .route('/:id')
  .put(protect, admin, updateApplicationStatus)
  .delete(protect, admin, deleteApplication);

export default router; 