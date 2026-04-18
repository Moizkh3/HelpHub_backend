import express from 'express';
import { 
    getUserData, getDashboardStats, 
    updateProfile, getLeaderboard 
} from '../controllers/userController.js';
import userAuth from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.get('/leaderboard', getLeaderboard);

// Protected routes
userRouter.get('/data', userAuth, getUserData);
userRouter.get('/stats', userAuth, getDashboardStats);
userRouter.post('/update-profile', userAuth, updateProfile);

export default userRouter;
