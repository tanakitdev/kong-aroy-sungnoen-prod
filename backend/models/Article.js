const mongoose = require('mongoose')
const { Schema, model, models } = mongoose

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    relatedShopIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
      },
    ],
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // สร้าง createdAt และ updatedAt อัตโนมัติ
  }
)

module.exports = models.Article || model('Article', articleSchema)
