import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  verifyOtp: {
    type: String,
    default: '',
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: '',
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0,
  },
  skills: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    default: '',
  },
  trustScore: {
    type: Number,
    default: 100,
  },
  badges: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
