import express from 'express';
import { 
    createRequest, getRequests, 
    getRequestById, offerHelp, 
    solveRequest, getAiSuggestionsEndpoint 
} from '../controllers/helpController.js';
import userAuth from '../middleware/authMiddleware.js';

const helpRouter = express.Router();

// Public routes
helpRouter.get('/all', getRequests);
helpRouter.get('/:id', getRequestById);

// Protected routes
helpRouter.post('/create', userAuth, createRequest);
helpRouter.post('/offer/:id', userAuth, offerHelp);
helpRouter.post('/solve/:id', userAuth, solveRequest);
helpRouter.post('/ai-suggestions', userAuth, getAiSuggestionsEndpoint);

export default helpRouter;
