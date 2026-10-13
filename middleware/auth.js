const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT and (optionally) restricts access to the given roles.
module.exports = function auth(...roles) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Login required' });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json({ error: 'User no longer exists' });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'You do not have access to this action' });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
};
