const { verifyAccessToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { userId, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorize(requiredRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (requiredRoles.length === 0 || requiredRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  };
}

module.exports = {
  authenticate,
  authorize
};
