import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Design', 'Data Science', 'Marketing', 'Career', 'Community', 'Other'],
    default: 'Other',
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Solved'],
    default: 'Open',
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  helpers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  aiSummary: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('HelpRequest', helpRequestSchema);
