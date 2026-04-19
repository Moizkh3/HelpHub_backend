import express from 'express';
import { 
    getAllUsers, 
    toggleUserRole, 
    deleteUser, 
    updateUserTrust, 
    getAllRequests, 
    deleteRequest, 
    getAdminStats 
} from '../controllers/adminController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require admin authentication
router.use(adminAuth);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/role/:userId', toggleUserRole);
router.delete('/users/:userId', deleteUser);
router.put('/users/trust/:userId', updateUserTrust);

router.get('/requests', getAllRequests);
router.delete('/requests/:requestId', deleteRequest);

export default router;
