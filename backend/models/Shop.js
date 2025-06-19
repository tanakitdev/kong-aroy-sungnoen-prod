const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  image: {
    type: String, // URL รูปร้าน
  },
  location: {
    type: String, // ลิงก์แผนที่
  },
  openTime: {
    type: String,
  },
  closeTime: {
    type: String,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: false, // ถ้าอยากให้บังคับใส่ เปลี่ยนเป็น true
  },
  popularityScore: {
    type: Number,
    default: 0,
  },
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
});

// เพิ่ม index สำหรับค้นหาชื่อร้านและหมวดหมู่
shopSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Shop", shopSchema);
