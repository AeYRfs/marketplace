const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user || !['admin', 'project_manager'].includes(user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = admin;