const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  regDate: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin', 'project_manager'], default: 'user' },
  restrictions: {
    isBlocked: { type: Boolean, default: false },
    chatBanned: { type: Boolean, default: false },
    productAddBanned: { type: Boolean, default: false }
  },
  notifications: [notificationSchema],
  averageRating: { type: Number, default: 0 },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, enum: ['en', 'ru'], default: 'en' }
  }
});

module.exports = mongoose.model('User', userSchema);