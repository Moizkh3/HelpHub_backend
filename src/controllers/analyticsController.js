import HelpRequest from '../models/HelpRequest.js';

export const getPulseAnalytics = async (req, res) => {
    try {
        // Calculate category distribution
        const categoryStats = await HelpRequest.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Calculate urgency distributions
        const urgencyStats = await HelpRequest.aggregate([
            { $group: { _id: '$urgency', count: { $sum: 1 } } }
        ]);

        // Weekly Request Volume (mocked relative points based on actual DB count for the demo)
        const totalRequests = await HelpRequest.countDocuments();
        const baseVolume = Math.max(5, Math.floor(totalRequests / 7));
        const weeklyVolume = [
            { name: 'Mon', count: baseVolume + 2 },
            { name: 'Tue', count: baseVolume + 5 },
            { name: 'Wed', count: baseVolume + 8 },
            { name: 'Thu', count: baseVolume + 4 },
            { name: 'Fri', count: baseVolume + 10 },
            { name: 'Sat', count: baseVolume + 15 },
            { name: 'Sun', count: totalRequests } // Today
        ];

        // Determine rising trend category
        let risingCategory = "Web Development";
        if (categoryStats.length > 0) {
            risingCategory = categoryStats[0]._id;
        }

        // Determine critical urgency category
        const highUrgency = await HelpRequest.aggregate([
            { $match: { urgency: 'High' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        
        let spikeCategory = "React/UI";
        if (highUrgency.length > 0) {
            spikeCategory = highUrgency[0]._id;
        }

        res.json({
            success: true,
            data: {
                totalRequests,
                risingCategory,
                spikeCategory,
                weeklyVolume,
                categoryStats,
                urgencyStats
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
