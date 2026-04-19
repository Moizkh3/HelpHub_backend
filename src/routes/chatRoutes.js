import express from 'express';
import { sendMessage, getChatHistory, getActiveConversations, getContactableUsers } from '../controllers/chatController.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(userAuth); // All chat routes require authentication

router.post('/send', sendMessage);
router.get('/history/:helpRequestId/:otherUserId', getChatHistory);
router.get('/conversations', getActiveConversations);
router.get('/contacts', getContactableUsers);

export default router;
