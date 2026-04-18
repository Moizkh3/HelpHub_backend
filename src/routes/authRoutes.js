import express from 'express';
import { 
    register, login, logout, 
    sendVerifyOtp, isAuthenticated, 
    sendResetOtp, resetPassword, 
    changePassword 
} from '../controllers/authController.js';
import userAuth from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Protected routes
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/change-password', userAuth, changePassword);

// Password reset routes
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
