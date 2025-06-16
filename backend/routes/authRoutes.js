// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // เปลี่ยนทีหลังเป็น .env

// REGISTER
router.post("/register", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "เบอร์นี้มีในระบบแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ phone, password: hashedPassword });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, userId: newUser._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "เบอร์นี้ไม่มีในระบบ" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
