const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.secret;

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Access Denied. No token provided." });
      }
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  },
};
