const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ROLE_ADMIN') return next();
  res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { admin };
