const redis = require('redis');

let client;

const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
    console.log('Redis connected');
    return client;
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectRedis, client };