const Product = require('../models/Product');

const searchProducts = async (query, page, limit, lang) => {
  const products = await Product.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query,
          path: [`title.${lang}`, `description.${lang}`, `tags.${lang}`]
        }
      }
    },
    { $match: { isDeleted: false } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userId',
        as: 'userId'
      }
    },
    { $unwind: '$userId' }
  ]);

  const total = await Product.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query,
          path: [`title.${lang}`, `description.${lang}`, `tags.${lang}`]
        }
      }
    },
    { $match: { isDeleted: false } },
    { $count: 'total' }
  ]);

  return {
    products,
    total: total[0]?.total || 0
  };
};

module.exports = { searchProducts };