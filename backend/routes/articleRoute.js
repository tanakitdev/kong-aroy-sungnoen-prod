const express = require('express')
const router = express.Router()
const Article = require('../models/Article')

// 🔹 GET: ดึงบทความทั้งหมด (พร้อม filter)
router.get('/', async (req, res) => {
  try {
    const { tag, search, limit = 10, skip = 0 } = req.query

    const filter = {}
    if (tag) filter.tags = tag
    if (search) filter.title = { $regex: search, $options: 'i' }

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))

    res.json(articles)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'ดึงบทความล้มเหลว' })
  }
})

// 🔹 GET: ดึงบทความตาม slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate('relatedShopIds')
    if (!article) return res.status(404).json({ message: 'ไม่พบบทความ' })

    res.json(article)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
  }
})

// 🔹 POST: เพิ่มบทความ
router.post('/', async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      coverImageUrl,
      tags = [],
      relatedShopIds = [],
      authorId,
      publishedAt,
    } = req.body

    const newArticle = await Article.create({
      title,
      slug,
      content,
      coverImageUrl,
      tags,
      relatedShopIds,
      authorId,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    })

    res.status(201).json(newArticle)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เพิ่มบทความไม่สำเร็จ' })
  }
})

// 🔹 PUT: แก้ไขบทความ
router.put('/:id', async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'ไม่พบบทความ' })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'แก้ไขบทความล้มเหลว' })
  }
})

// 🔹 DELETE: ลบบทความ
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'ไม่พบบทความ' })

    res.json({ message: 'ลบเรียบร้อย' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'ลบบทความล้มเหลว' })
  }
})

module.exports = router
