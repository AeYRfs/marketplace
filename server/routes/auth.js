const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { sendVerificationEmail } = require('../services/email');
const { trackEvent } = require('../services/analytics');

router.post('/register', async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId: uuidv4(),
      userName,
      email,
      password: hashedPassword,
      profileImage: '',
      role: 'user' // Только user при регистрации
    });

    const code = new VerificationCode({
      codeId: uuidv4(),
      email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    await Promise.all([
      user.save(),
      code.save(),
      sendVerificationEmail(email, verificationCode)
    ]);

    await trackEvent(null, 'user_register', { email });
    res.status(201).json({ message: 'User created. Please verify email' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.restrictions.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ 
      token, 
      user: { 
        userId: user.userId, 
        userName: user.userName, 
        role: user.role,
        preferences: user.preferences 
      } 
    });
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res, next) => {
  try {
    const { theme, language } = req.body;
    const validThemes = ['light', 'dark'];
    const validLanguages = ['en', 'ru'];

    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({ message: 'Invalid language' });
    }

    const update = {};
    if (theme) update['preferences.theme'] = theme;
    if (language) update['preferences.language'] = language;

    await User.updateOne({ userId: req.user.userId }, update);
    await trackEvent(req.user.userId, 'update_preferences', { theme, language });
    res.json({ message: 'Preferences updated' });
  } catch (error) {
    next(error);
  }
});

// ... (verify-email без изменений)