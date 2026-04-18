import userModel from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';

// Get User Profile
export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                trustScore: user.trustScore,
                badges: user.badges,
                skills: user.skills,
                location: user.location
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;

        const myRequestsCount = await HelpRequest.countDocuments({ requester: userId });
        const helpProvidedCount = await HelpRequest.countDocuments({ helpers: userId, status: 'Solved' });
        const activeRequests = await HelpRequest.find({ status: 'Open' })
            .limit(5)
            .sort({ createdAt: -1 })
            .populate('requester', 'name trustScore');

        const user = await userModel.findById(userId);

        res.json({
            success: true,
            stats: {
                myRequestsCount,
                helpProvidedCount,
                trustScore: user.trustScore,
                badgesCount: user.badges.length
            },
            activeRequests
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Profile (Onboarding)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, skills, interests, location } = req.body;

        const user = await userModel.findByIdAndUpdate(userId, {
            name,
            skills,
            interests,
            location
        }, { new: true });

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const topHelpers = await userModel.find({})
            .sort({ trustScore: -1 })
            .limit(10)
            .select('name trustScore badges skills');

        res.json({ success: true, leaderboard: topHelpers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
