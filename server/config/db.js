const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    await mongoose.connection.db.collection('products').createIndex({
      'title.en': 'text',
      'title.ru': 'text',
      'description.en': 'text',
      'description.ru': 'text',
      'tags.en': 'text',
      'tags.ru': 'text'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
