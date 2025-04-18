import express from 'express';
import {
  getCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from '../controllers/futsalCourtController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCourts)
  .post(protect, admin, createCourt);

router.route('/:id')
  .get(getCourtById)
  .put(protect, admin, updateCourt)
  .delete(protect, admin, deleteCourt);

export default router; 