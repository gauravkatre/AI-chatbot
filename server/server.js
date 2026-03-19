import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhook.js';

const app = express();

await connectDB();

app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)
app.use(cors());
app.use(express.json());
app.use('/api/users',userRouter)
app.use('/api/chats',chatRouter)
app.use('/api/messages',messageRouter)
app.use('/api/credits', creditRouter);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})