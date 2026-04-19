import express from 'express';
import { getPulseAnalytics } from '../controllers/analyticsController.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(userAuth);

router.get('/pulse', getPulseAnalytics);

export default router;
