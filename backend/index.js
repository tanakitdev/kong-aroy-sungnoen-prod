const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


dotenv.config();

const app = express();
app.use(cookieParser()); // ✅ ทำให้ req.cookies ใช้งานได้

app.use(
  cors({
    origin: [
      "https://www.xn--22cka6ea5cg1dxabb2gyc9e8e.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:9101", // Flutter web
      "http://localhost:9101", // Flutter web
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  })
);

// app.use(
//   cors({
//     origin: "https://www.xn--22cka6ea5cg1dxabb2gyc9e8e.com", // หรือชื่อ domain ของ frontend
//     credentials: true,               // ✅ สำคัญ
//   })
// );

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

app.use(express.json());

// ✅ ใช้งาน route
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/shops", require("./routes/shopRoutes"));
app.use("/api/menus", require("./routes/menuRoutes"));
app.use("/api/checkins", require("./routes/checkInRoutes"));
app.use("/api/articles", require("./routes/articleRoute"));

app.use("/api/cloudinary", require("./routes/cloudinary"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbName: "sungnoen-food" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Example route
app.get("/", (req, res) => {
  res.send("ของอร่อยสูงเนิน backend ทำงานแล้ว 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// git commit -m "auth context / navbar update on login/logout"