import express from 'express';
import { textMessage,imageMessageController } from '../controllers/messageController';
import { protect } from '../middlewares/auth';
const messageRouter=express.Router()

messageRouter.post('/text', protect, textMessage)
messageRouter.post('/image', protect, imageMessageController)

export default messageRouter