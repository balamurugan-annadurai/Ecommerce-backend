import express from 'express';
import { createRazorpayOrder } from '../controllers/order.controller.js';

const router = express.Router();
router.post('/create-order', createRazorpayOrder);

export default router