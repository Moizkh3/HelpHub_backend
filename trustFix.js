import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixTrustScores = async () => {
    try {
        console.log('Connecting to database...');
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found in .env');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const userSchema = new mongoose.Schema({ trustScore: Number, name: String });
        const helpRequestSchema = new mongoose.Schema({ rewardedHelper: mongoose.Schema.Types.ObjectId, status: String });
        
        const User = mongoose.model('UserMigration', userSchema, 'users');
        const HelpRequest = mongoose.model('HelpRequestMigration', helpRequestSchema, 'helprequests');

        const users = await User.find({});
        console.log(`Analyzing ${users.length} users...`);

        for (const user of users) {
            // Count actual solved contributions where this user was the chosen helper
            const contributions = await HelpRequest.countDocuments({ rewardedHelper: user._id, status: 'Solved' });
            
            // New logic: 50 baseline + (10 * contributions)
            let newScore = 50 + (contributions * 10);
            if (newScore > 100) newScore = 100;
            
            await User.findByIdAndUpdate(user._id, { trustScore: newScore });
            console.log(`-> Updated ${user.name}: reset to ${newScore}% (${contributions} assists)`);
        }

        console.log('------------------------------------');
        console.log('TRUST SCORE SYNCHRONIZATION COMPLETE');
        console.log('------------------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
};

fixTrustScores();
