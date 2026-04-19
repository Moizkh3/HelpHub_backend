import HelpRequest from '../models/HelpRequest.js';
import userModel from '../models/User.js';
import Notification from '../models/Notification.js';
import { getSmartSuggestions, generateAiSummary } from '../utils/aiAssistant.js';

// Create a help request
export const createRequest = async (req, res) => {
    try {
        const { title, description, category, urgency, tags } = req.body;
        const requesterId = req.userId;

        if (!title || !description) {
            return res.json({ success: false, message: 'Title and description are required' });
        }

        const aiSummary = await generateAiSummary(description);

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
        const suggestions = await getSmartSuggestions(title, description);
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

        // Detect stale/fallback AI summary and regenerate with Gemini
        const isStaleSummary = !request.aiSummary ||
            request.aiSummary.length < 20 ||
            request.description.startsWith(request.aiSummary.replace('...', '').trim().substring(0, 30));

        if (isStaleSummary) {
            try {
                const freshSummary = await generateAiSummary(request.description);
                request.aiSummary = freshSummary;
                await HelpRequest.findByIdAndUpdate(req.params.id, { aiSummary: freshSummary });
            } catch (aiError) {
                console.error('AI regeneration failed:', aiError.message);
                // keep the existing summary, don't block the response
            }
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

        // Notify requester
        await Notification.create({
            user: request.requester,
            type: 'HelpOffered',
            message: `A community member has offered to help with your request: "${request.title}"`,
            relatedRequest: requestId
        });

        res.json({ success: true, message: 'Help offer sent' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Solve a request & reward a specific helper
export const solveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.userId;
        const { rewardedHelperId } = req.body;

        const request = await HelpRequest.findById(requestId);
        if (!request) return res.json({ success: false, message: 'Request not found' });

        if (request.requester.toString() !== userId) {
            return res.json({ success: false, message: 'Only the requester can mark it as solved' });
        }

        request.status = 'Solved';
        if (rewardedHelperId) {
            const isValidHelper = request.helpers.some(h => h.toString() === rewardedHelperId);
            if (isValidHelper) {
                request.rewardedHelper = rewardedHelperId;
                
                // Notify helper
                await Notification.create({
                    user: rewardedHelperId,
                    type: 'RequestSolved',
                    message: `Congratulations! Your help was marked as the solution for: "${request.title}". You earned +10 Trust Points!`,
                    relatedRequest: requestId
                });
            }
        }
        await request.save();

        // Award trust only to the chosen helper (if provided and valid)
        if (rewardedHelperId) {
            const isValidHelper = request.helpers.some(h => h.toString() === rewardedHelperId);
            if (isValidHelper) {
                // Reward helper with +10 trust score, capped at 100
                await userModel.findByIdAndUpdate(rewardedHelperId, [
                    { $set: { trustScore: { $min: [100, { $add: ["$trustScore", 10] }] } } }
                ]);
            }
        }

        res.json({ success: true, message: 'Request marked as solved' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
