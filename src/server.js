import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import helpRouter from './routes/helpRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

// MongoDB Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/help', helpRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
