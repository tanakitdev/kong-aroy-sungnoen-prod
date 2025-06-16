// routes/cloudinary.js
const express = require("express")
const { v2: cloudinary } = require("cloudinary")

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
})

router.post("/delete", async (req, res) => {
    const { imageUrl, path } = req.body
    if (!imageUrl) return res.status(400).json({ message: "Missing imageUrl" })

    try {
        const segments = imageUrl.split("/")
        const filename = segments.pop().split(".")[0]
        const folder = path // หรือ folder ที่คุณอัปโหลดไว้
        const publicId = `${folder}/${filename}`

        await cloudinary.uploader.destroy(publicId)
        res.json({ message: "Image deleted successfully" })
    } catch (err) {
        console.error("Error deleting image:", err)
        res.status(500).json({ message: "Failed to delete image", error: err })
    }
})

module.exports = router
