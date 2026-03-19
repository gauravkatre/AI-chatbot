import express from 'express';
import { protect } from '../middlewares/auth';
import { createChat,deleteChats,getChats } from '../controllers/chatController';

const chatRouter=express.Router()

chatRouter.post('/create', protect, createChat)
chatRouter.get('/get', protect, getChats)
chatRouter.delete('/delete', protect, deleteChats)

export default chatRouter