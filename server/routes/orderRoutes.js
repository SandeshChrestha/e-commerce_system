import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.get('/all', protect, admin, getAllOrders);

router
  .route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router; 