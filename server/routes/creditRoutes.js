import express from 'express';
import { protect } from '../middlewares/auth';
import {  getCredits,purchasePlan } from '../controllers/creditController';

const creditrouter = express.Router();

creditrouter.get('/credits', protect, getCredits);
creditrouter.post('/purchase', protect, purchasePlan);

export default creditrouter;