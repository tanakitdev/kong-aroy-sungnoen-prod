// models/Checkin.js
const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  imageUrl: { type: String },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now },
});

checkinSchema.index({ userId: 1, shopId: 1, createdAt: -1 }); // ช่วยให้ query เร็วขึ้น

module.exports = mongoose.model("Checkin", checkinSchema);
