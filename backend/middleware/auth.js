// middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  // const token = authHeader.split(" ")[1];
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;
