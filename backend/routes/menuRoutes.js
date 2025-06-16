const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Shop = require("../models/Shop");

const { v2: cloudinary } = require("cloudinary");

// ตั้งค่าก่อนใช้
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
})


router.post("/", async (req, res) => {
  const { name, price, shop, image } = req.body;

  try {
    const newMenu = new Menu({ name, price, shop, image });
    await newMenu.save();

    // 👇 เพิ่มเมนูนี้เข้าไปในร้านด้วย
    await Shop.findByIdAndUpdate(shop, {
      $push: { menus: newMenu._id }
    });

    res.json(newMenu);
  } catch (err) {
    console.error("Error creating menu:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    console.error("Error fetching menus", err);
    res.status(500).json({ message: "Server error" });
  }
})

// GET all menus by shopId
router.get("/by-shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const menus = await Menu.find({ shop: shopId });
    res.json(menus);
  } catch (err) {
    console.error("Error fetching menus by shopId:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ดึงเมนูจาก id
router.get("/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// แก้ไขเมนู
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating menu" });
  }
});

router.delete("/:id", async (req, res) => {
  const menuId = req.params.id;

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // 🔥 ลบภาพจาก Cloudinary ถ้ามี
    if (menu.image && menu.image.includes("res.cloudinary.com")) {
      const segments = menu.image.split("/");
      const filename = segments.pop().split(".")[0]; // ดึงชื่อไฟล์ เช่น abc123.jpg → abc123
      const folder = "menus"; // หรือ folder จริงของคุณ
      const publicId = `${folder}/${filename}`;

      await cloudinary.uploader.destroy(publicId);
    }

    // ลบเมนูจากฐานข้อมูล
    await Menu.findByIdAndDelete(menuId);

    // ลบอ้างอิงเมนูออกจากร้าน
    await Shop.findByIdAndUpdate(menu.shop, {
      $pull: { menus: menuId },
    });

    res.json({ message: "ลบเมนูและรูปภาพ (ถ้ามี) เรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
