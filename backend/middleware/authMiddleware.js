const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Expecting: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, role, name, etc.) to req object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden. Invalid or expired token.' });
  }
};

module.exports = verifyToken;
