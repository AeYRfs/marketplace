const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chats');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const socketHandler = require('./socket');
const errorHandler = require('./middleware/error');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB and Redis, start server
const PORT = process.env.PORT || 5000;
Promise.all([connectDB(), connectRedis()]).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Socket.IO
socketHandler(io);