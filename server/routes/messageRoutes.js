import express from 'express';
import { textMessage,imageMessageController } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';
const messageRouter=express.Router()

messageRouter.post('/text', protect, textMessage)
messageRouter.post('/image', protect, imageMessageController)

export default messageRouter