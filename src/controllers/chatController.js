import Message from '../models/Message.js';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, helpRequestId, content } = req.body;
        const senderId = req.userId;

        if (!content) {
            return res.json({ success: false, message: 'Message content is required' });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            helpRequest: helpRequestId,
            content
        });

        await newMessage.save();

        res.json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get chat history between current user and another specific user for a specific request
export const getChatHistory = async (req, res) => {
    try {
        const { otherUserId, helpRequestId } = req.params;
        const currentUserId = req.userId;

        const query = {
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        };

        if (helpRequestId && helpRequestId !== 'null' && helpRequestId !== 'undefined') {
            query.helpRequest = helpRequestId;
        } else {
            query.helpRequest = { $exists: false };
        }

        const messages = await Message.find(query).sort({ createdAt: 1 }).populate('sender', 'name _id').populate('receiver', 'name _id');

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all active conversations for the current user
export const getActiveConversations = async (req, res) => {
    try {
        const currentUserId = req.userId;

        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        })
        .populate('sender', 'name _id role trustScore')
        .populate('receiver', 'name _id role trustScore')
        .populate('helpRequest', 'title _id')
        .sort({ createdAt: -1 });

        // Extract unique conversations
        const conversationsMap = new Map();
        
        messages.forEach(msg => {
            // Determine the "other" user
            const otherUser = msg.sender._id.toString() === currentUserId ? msg.receiver : msg.sender;
            const requestId = msg.helpRequest?._id?.toString() || 'direct';
            const convKey = `${otherUser._id.toString()}_${requestId}`;
            
            if (!conversationsMap.has(convKey)) {
                conversationsMap.set(convKey, {
                    otherUser,
                    helpRequest: msg.helpRequest,
                    lastMessage: msg,
                    unread: !msg.read && msg.receiver._id.toString() === currentUserId
                });
            }
        });

        res.json({ success: true, conversations: Array.from(conversationsMap.values()) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get users that can be messaged (people linked via help requests)
export const getContactableUsers = async (req, res) => {
    try {
        const currentUserId = req.userId;

        // Find requests where the user is either the requester or a helper
        const requests = await HelpRequest.find({
            $or: [
                { requester: currentUserId },
                { helpers: currentUserId }
            ]
        }).populate('requester', 'name _id').populate('helpers', 'name _id');

        const contactsMap = new Map();

        requests.forEach(req => {
            // If I am the requester, all helpers are contacts
            if (req.requester._id.toString() === currentUserId) {
                req.helpers.forEach(helper => {
                    contactsMap.set(helper._id.toString(), {
                        _id: helper._id,
                        name: helper.name,
                        requestTitle: req.title,
                        requestId: req._id
                    });
                });
            } else {
                // If I am a helper, the requester is a contact
                contactsMap.set(req.requester._id.toString(), {
                    _id: req.requester._id,
                    name: req.requester.name,
                    requestTitle: req.title,
                    requestId: req._id
                });
            }
        });

        res.json({ success: true, contacts: Array.from(contactsMap.values()) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
