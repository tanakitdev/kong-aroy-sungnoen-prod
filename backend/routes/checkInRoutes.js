const express = require("express");
const router = express.Router();
const Checkin = require("../models/Checkin");
const auth = require("../middleware/auth");
const Shop = require("../models/Shop");

// POST /api/checkins - เพิ่มการเช็คอินร้าน
router.post("/", auth, async (req, res) => {
  try {
    const { shopId, imageUrl, caption } = req.body;

    // ✅ ตรวจสอบข้อมูลที่จำเป็น
    if (!shopId || !imageUrl) {
      return res
        .status(400)
        .json({ message: "shopId และ imageUrl จำเป็นต้องมี" });
    }

    // ✅ ตรวจสอบว่า shopId มีอยู่จริง
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return res.status(404).json({ message: "ไม่พบร้านค้าที่เลือก" });
    }

    // ✅ ตรวจสอบว่าผู้ใช้เช็คอินร้านนี้วันนี้ไปแล้วหรือยัง
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const alreadyCheckedIn = await Checkin.findOne({
      userId: req.userId,
      shopId,
      createdAt: { $gte: startOfDay }
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "คุณเช็คอินร้านนี้แล้วในวันนี้" });
    }

    // ✅ สร้าง checkin ใหม่
    const newCheckin = await Checkin.create({
      userId: req.userId,
      shopId,
      imageUrl,
      caption
    });

    res.status(201).json(newCheckin);
  } catch (err) {
    console.error("Error in POST /api/checkins:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

router.post("/validate", auth, async (req, res) => {
  // console.log('req.userId',req.userId);
  // console.log('shopId', req.body.shopId);

  try {
    const { shopId } = req.body;
    if (!shopId) return res.status(400).json({ message: "shopId ต้องไม่ว่าง" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const exists = await Checkin.findOne({
      userId: req.userId,
      shopId,
      createdAt: { $gte: startOfDay }
    });

    res.json({ alreadyCheckedIn: !!exists });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// router.get("/latest", async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;

//     try {
//         const checkins = await Checkin.find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .populate("shopId", "name");

//         const result = checkins.map(item => ({
//             _id: item._id,
//             shopId: item.shopId._id,
//             shopName: item.shopId.name,
//             imageUrl: item.imageUrl,
//             caption: item.caption,
//             userName: item.userName || "ไม่ระบุ",
//             date: new Date(item.createdAt).toLocaleDateString("th-TH", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric"
//             }),
//         }));

//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ message: "โหลดเช็คอินล้มเหลว" });
//     }
// });
router.get("/latest", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const checkins = await Checkin.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("shopId userId", "name image phone");

    const formatted = checkins
      .filter(c => c.shopId && c.userId) // กรองออกก่อน (ถ้า null) ใส่แก้เมื่อ shop โดนลบออกจาก DB จะไม่เอามาแสดงหน้า home
      .map(c => ({
        _id: c._id,
        shopId: c.shopId._id,
        shopName: c.shopId.name,
        imageUrl: c.imageUrl,
        caption: c.caption,
        userName: c.userId.name || "ผู้ใช้",
        userPhone: c.userId.phone || "",
        createdAt: c.createdAt,
      }));

    const total = await Checkin.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: formatted,
      totalPages
    });
    // res.json(formatted);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/checkins - ดูเช็คอินทั้งหมดของ user
router.get("/", auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate("shopId", "name");

    const formatted = checkins
      .filter(c => c.shopId && c.userId) // กรองออกก่อน (ถ้า null) ใส่แก้เมื่อ shop โดนลบออกจาก DB จะไม่เอามาแสดงหน้า home
      .map(c => ({
        _id: c._id,
        shopId: c.shopId._id,
        shopName: c.shopId.name,
        imageUrl: c.imageUrl,
        caption: c.caption,
        userName: c.userId.name || "ผู้ใช้",
        userPhone: c.userId.phone || "",
        createdAt: c.createdAt,
      }));

    res.json(formatted)
  } catch (err) {
    console.error("Get checkins error:", err)
    res.status(500).json({ message: "ไม่สามารถโหลดข้อมูลได้" })
  }
})

router.get("/by-shop", async (req, res) => {
  const shopId = req.query.shopId
  if (!shopId) return res.status(400).json({ message: "ต้องระบุ shopId" })

  try {
    const checkins = await Checkin.find({ shopId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("userId", "name phone")
      .populate("shopId", "name") // ✅ ดึงชื่อร้าน

    const formatted = checkins.map((c) => ({
      _id: c._id,
      imageUrl: c.imageUrl,
      caption: c.caption,
      createdAt: c.createdAt,
      userName: c.userId?.name || "ผู้ใช้",
      userPhone: c.userId?.phone || "",
      shopName: c.shopId?.name || "",
    }))

    res.json(formatted)
  } catch (err) {
    console.error("GET /by-shop error", err)
    res.status(500).json({ message: "เกิดข้อผิดพลาด" })
  }
})

// ✅ GET /api/checkins/my — ดึง check-ins ของผู้ใช้คนปัจจุบัน
router.get("/my", auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.user.id })
      .populate("shopId", "name location")
      .sort({ createdAt: -1 });

    res.json(checkins);
  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถโหลดเช็คอินของคุณได้" });
  }
});

// ✅ DELETE /api/checkins/:id — ลบ check-in
router.delete("/:id", auth, async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id);

    if (!checkin) {
      return res.status(404).json({ message: "ไม่พบรายการเช็คอิน" });
    }

    if (checkin.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์ลบรายการนี้" });
    }

    await checkin.deleteOne();
    res.json({ message: "ลบเช็คอินเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

// ✅ GET /api/checkins/top — ร้านที่มีคนเช็คอินมากที่สุด (top 6)
router.get("/top", async (req, res) => {
  try {
    const topShops = await Checkin.aggregate([
      {
        $group: {
          _id: "$shopId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "shops",
          localField: "_id",
          foreignField: "_id",
          as: "shop"
        }
      },
      { $unwind: "$shop" }
    ]);

    res.json(topShops);
  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถดึงร้านยอดนิยมได้" });
  }
});

module.exports = router;
