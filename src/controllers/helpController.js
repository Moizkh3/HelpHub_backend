import HelpRequest from '../models/HelpRequest.js';
import userModel from '../models/User.js';
import { getSmartSuggestions, generateAiSummary } from '../utils/aiAssistant.js';

// Create a help request
export const createRequest = async (req, res) => {
    try {
        const { title, description, category, urgency, tags } = req.body;
        const requesterId = req.userId;

        if (!title || !description) {
            return res.json({ success: false, message: 'Title and description are required' });
        }

        const aiSummary = generateAiSummary(description);

        const newRequest = new HelpRequest({
            title,
            description,
            category,
            urgency,
            tags,
            requester: requesterId,
            aiSummary
        });

        await newRequest.save();
        res.json({ success: true, message: 'Help request created successfully', request: newRequest });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ... (other methods)

// Get AI Suggestions
export const getAiSuggestionsEndpoint = async (req, res) => {
    try {
        const { title, description } = req.body;
        const suggestions = getSmartSuggestions(title, description);
        res.json({ success: true, suggestions });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all help requests (with filters)
export const getRequests = async (req, res) => {
    try {
        const { category, urgency, status } = req.query;
        let query = {};

        if (category) query.category = category;
        if (urgency) query.urgency = urgency;
        if (status) query.status = status;

        const requests = await HelpRequest.find(query)
            .populate('requester', 'name email trustScore location badges')
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get a single help request
export const getRequestById = async (req, res) => {
    try {
        const request = await HelpRequest.findById(req.params.id)
            .populate('requester', 'name email trustScore location badges')
            .populate('helpers', 'name email trustScore location badges');

        if (!request) {
            return res.json({ success: false, message: 'Request not found' });
        }

        res.json({ success: true, request });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Offer help
export const offerHelp = async (req, res) => {
    try {
        const requestId = req.params.id;
        const helperId = req.userId;

        const request = await HelpRequest.findById(requestId);
        if (!request) return res.json({ success: false, message: 'Request not found' });

        if (request.requester.toString() === helperId) {
            return res.json({ success: false, message: 'You cannot help yourself' });
        }

        if (request.helpers.includes(helperId)) {
            return res.json({ success: false, message: 'You have already offered help' });
        }

        request.helpers.push(helperId);
        await request.save();

        res.json({ success: true, message: 'Help offer sent' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Solve a request
export const solveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.userId;

        const request = await HelpRequest.findById(requestId);
        if (!request) return res.json({ success: false, message: 'Request not found' });

        if (request.requester.toString() !== userId) {
            return res.json({ success: false, message: 'Only the requester can mark it as solved' });
        }

        request.status = 'Solved';
        await request.save();

        // Increment trust score for helpers (bonus feature)
        await userModel.updateMany(
            { _id: { $in: request.helpers } },
            { $inc: { trustScore: 5 } }
        );

        res.json({ success: true, message: 'Request marked as solved' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
