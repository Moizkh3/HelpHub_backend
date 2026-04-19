import Notification from '../models/Notification.js';

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .populate('relatedRequest', 'title _id');
        
        // Count unread
        const unreadCount = await Notification.countDocuments({ user: req.userId, read: false });

        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.userId, read: false },
            { read: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
