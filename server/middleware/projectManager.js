const User = require('../models/User');

const projectManager = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user || user.role !== 'project_manager') {
      return res.status(403).json({ message: 'Project Manager access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = projectManager;