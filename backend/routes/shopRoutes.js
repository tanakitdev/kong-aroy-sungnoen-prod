const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
const Menu = require("../models/Menu");

const { v2: cloudinary } = require("cloudinary");

// ตั้งค่าก่อนใช้ CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
})

router.get("/", async (req, res) => {
  const { search, category, status, page = 1, limit = 6 } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (status === "open") filter.isOpen = true;
  if (status === "closed") filter.isOpen = false;

  try {
    // ค้นหาจากร้าน + เมนู
    const shops = await Shop.find(filter)
      .populate("menus")
      .exec();

    const keyword = search?.toLowerCase() || "";

    const filteredShops = shops.filter((shop) => {
      const nameMatch = shop.name?.toLowerCase().includes(keyword);
      const categoryMatch = shop.category?.toLowerCase().includes(keyword);
      const menuMatch = shop.menus?.some((menu) =>
        menu.name?.toLowerCase().includes(keyword)
      );
      return nameMatch || categoryMatch || menuMatch;
    });

    const start = (page - 1) * limit;
    const paginated = filteredShops.slice(start, start + Number(limit));

    res.json({
      data: paginated,
      totalPages: Math.ceil(filteredShops.length / limit),
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const shops = await Shop.find({}).sort({ updatedAt: -1 }).exec()
    res.json(shops)
  } catch (err) {
    console.error("Error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// routes/shopRoutes.js
router.get("/categories", async (req, res) => {
  try {
    const categories = await Shop.distinct("category", { category: { $ne: "" } });
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  const { q = "" } = req.query;
  const keyword = q.toLowerCase();

  try {
    const shops = await Shop.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } }
      ]
    })
      .select("_id name category") // เอาเฉพาะที่จำเป็น
      .limit(20) // จำกัดเพื่อ performance
      .exec();

    res.json({ data: shops });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

router.get("/by-user", async (req, res) => {
  const { userId } = req.query;

  try {
    const shops = await Shop.find({ ownerId: userId }).populate("menus");
    res.json(shops);
  } catch (err) {
    console.error("Error fetching shops by user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/shops/top
router.get("/top", async (req, res) => {
  try {
    const shops = await Shop.find({})
      .sort({ popularityScore: -1 }) // หรือ .limit(10) ถ้ามี field นี้
      .limit(10)
      .exec();

    res.json(shops);
  } catch (err) {
    console.error("Error fetching top shops:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("menus");
    if (!shop) return res.status(404).json({ message: "ไม่พบร้านนี้" })
    res.json(shop)
  } catch (err) {
    console.error("Error fetching shop by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, category, image, location, openTime, closeTime, ownerId, phone } =
    req.body;

  if (!name || !ownerId) {
    return res.status(400).json({ message: "Missing name or ownerId" });
  }

  try {
    const newShop = new Shop({
      name,
      category,
      image,
      location,
      openTime,
      closeTime,
      ownerId,
      phone
    });

    await newShop.save();
    res.status(201).json(newShop);
  } catch (err) {
    console.error("Error creating shop:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(shop)
  } catch (err) {
    console.error("Error updating shop:", err)
    res.status(500).json({ message: "Server error" })
  }
});

// หลังจากลบ shop ควรลบ checkins ทั้งหมดที่มี shopId อยู่ด้วย แต่แก้ใน checkin/latest แล้ว
router.delete("/:id", async (req, res) => {
  const shopId = req.params.id
  try {

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // 🔥 ลบภาพจาก Cloudinary ถ้ามี
    if (shop.image && shop.image.includes("res.cloudinary.com")) {
      const segments = shop.image.split("/");
      const filename = segments.pop().split(".")[0]; // ดึงชื่อไฟล์ เช่น abc123.jpg → abc123
      const folder = "shops"; // หรือ folder จริงของคุณ
      const publicId = `${folder}/${filename}`;

      await cloudinary.uploader.destroy(publicId);
    }

    // ลบเมนูทั้งหมดที่เกี่ยวข้องกับร้านนี้ก่อน (เพราะ menus ถูก embed อยู่ใน shop)
    await Menu.deleteMany({ shop: shopId })

    // จากนั้นค่อยลบร้านค้า
    await Shop.findByIdAndDelete(shopId)

    res.json({ message: "ลบร้านค้าเรียบร้อยแล้ว" })
  } catch (err) {
    console.error("Error deleting shop:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router;
