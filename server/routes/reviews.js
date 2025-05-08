const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('../services/notification');
const { trackEvent } = require('../services/analytics');

router.post('/', auth, async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      reviewId: uuidv4(),
      productId,
      userId: req.user.userId,
      targetUserId: product.userId,
      rating,
      comment,
      createdAt: new Date()
    });

    await review.save();

    // Update average ratings
    const reviews = await Review.find({ productId });
    const avgProductRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.updateOne({ productId }, { averageRating: avgProductRating });

    const userReviews = await Review.find({ targetUserId: product.userId });
    const avgUserRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    await User.updateOne({ userId: product.userId }, { averageRating: avgUserRating });

    await createNotification(
      product.userId,
      `New review on your product ${product.title.en}: ${rating} stars`
    );

    await trackEvent(req.user.userId, 'add_review', { productId, rating });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

router.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate(
      'userId',
      'userName'
    );
    await trackEvent(null, 'view_reviews', { productId: req.params.productId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;