import userModel from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Toggle User Role (Admin <-> User)
export const toggleUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();
        res.json({ success: true, message: `User role updated to ${user.role}`, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await userModel.findByIdAndDelete(userId);
        // Also delete their requests? (Optional, let's keep them for now or delete them if preferred)
        await HelpRequest.deleteMany({ requester: userId });
        res.json({ success: true, message: 'User and their requests deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update User Trust Score
export const updateUserTrust = async (req, res) => {
    try {
        const { userId } = req.params;
        const { trustScore } = req.body;
        await userModel.findByIdAndUpdate(userId, { trustScore });
        res.json({ success: true, message: 'Trust score updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Help Requests
export const getAllRequests = async (req, res) => {
    try {
        const requests = await HelpRequest.find({})
            .populate('requester', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Help Request
export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        await HelpRequest.findByIdAndDelete(requestId);
        res.json({ success: true, message: 'Request deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Admin Stats
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalRequests = await HelpRequest.countDocuments();
        const solvedRequests = await HelpRequest.countDocuments({ status: 'Solved' });
        const openRequests = await HelpRequest.countDocuments({ status: 'Open' });

        const categoryStats = await HelpRequest.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalRequests,
                solvedRequests,
                openRequests,
                categoryStats
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
