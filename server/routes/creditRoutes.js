import express from 'express';
import { protect } from '../middlewares/auth.js';
import {  getPlans,purchasePlan } from '../controllers/creditController.js';

const creditrouter = express.Router();

creditrouter.get('/credits', protect, getPlans);
creditrouter.post('/purchase', protect, purchasePlan);

export default creditrouter;