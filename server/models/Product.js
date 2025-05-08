const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  title: {
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  category: { type: String, required: true },
  description: {
    en: { type: String },
    ru: { type: String }
  },
  price: { type: Number, required: true },
  images: [{ type: String }],
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: {
    en: [{ type: String }],
    ru: [{ type: String }]
  },
  averageRating: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);