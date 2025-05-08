const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { upload } = require('../services/upload');
const { client } = require('../config/redis');
const { searchProducts } = require('../services/search');
const { trackEvent } = require('../services/analytics');

router.get('/category/:category', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, lang = 'en' } = req.query;
    const cacheKey = `products:${req.params.category}:${page}:${limit}:${lang}`;
    
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await Product.find({ 
      category: req.params.category,
      isDeleted: false
    })
      .populate('userId', 'userName profileImage averageRating')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Transform response based on language
    const transformedProducts = products.map(p => ({
      ...p,
      title: p.title[lang],
      description: p.description[lang] || '',
      tags: p.tags[lang] || []
    }));

    const total = await Product.countDocuments({ 
      category: req.params.category,
      isDeleted: false
    });

    const result = {
      products: transformedProducts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    };

    await client.setEx(cacheKey, 300, JSON.stringify(result));
    await trackEvent(req.user?.userId, 'view_category', { category: req.params.category, lang });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, upload.array('images', 5), async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    
    if (user.restrictions.isBlocked || user.restrictions.productAddBanned) {
      return res.status(403).json({ message: 'You are not allowed to add products' });
    }

    const { titleEn, titleRu, category, descriptionEn, descriptionRu, price, tagsEn, tagsRu } = req.body;
    
    if (!titleEn || !titleRu) {
      return res.status(400).json({ message: 'Title must be provided in both English and Russian' });
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      productId: uuidv4(),
      title: { en: titleEn, ru: titleRu },
      category,
      description: { 
        en: descriptionEn || '', 
        ru: descriptionRu || '' 
      },
      price,
      images,
      userId: req.user.userId,
      tags: { 
        en: tagsEn ? tagsEn.split(',') : [], 
        ru: tagsRu ? tagsRu.split(',') : [] 
      }
    });

    await product.save();
    await client.del(`products:${category}:*:*`);
    await trackEvent(req.user.userId, 'add_product', { productId: product.productId });
    
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// ... (search с учетом языка)
router.get('/search', async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10, lang = 'en' } = req.query;
    const { products, total } = await searchProducts(query, page, limit, lang);

    const transformedProducts = products.map(p => ({
      ...p,
      title: p.title[lang],
      description: p.description[lang] || '',
      tags: p.tags[lang] || []
    }));

    await trackEvent(req.user?.userId, 'search', { query, lang });
    res.json({
      products: transformedProducts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
});