const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  codeId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);