import express from 'express';
import { protect } from '../middlewares/auth.js';
import { createChat,deleteChats,getChats } from '../controllers/chatController.js';

const chatRouter=express.Router()

chatRouter.post('/create', protect, createChat)
chatRouter.get('/get', protect, getChats)
chatRouter.delete('/delete', protect, deleteChats)

export default chatRouter