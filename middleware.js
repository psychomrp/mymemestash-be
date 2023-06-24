const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }
  
    try {
      const tokenWithoutBearer = token.replace('Bearer ', '');
      const decoded = jwt.verify(tokenWithoutBearer, 'mymemestash');
      req.userId = decoded.userId;
      next();
    } catch (err) {
      // console.error(err);
      res.status(401).json({ error: 'Invalid token' });
    }
};
  
module.exports = { verifyToken };