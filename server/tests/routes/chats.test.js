const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Chat = require('../../models/Chat');

describe('Chat Routes', () => {
  let token, userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await new User({
      userId: 'user1',
      userName: 'User1',
      email: 'user1@test.com',
      password: 'hashed',
      role: 'user'
    }).save();

    await new User({
      userId: 'user2',
      userName: 'User2',
      email: 'user2@test.com',
      password: 'hashed',
      role: 'user'
    }).save();

    userId = user.userId;
    token = jwt.sign({ userId }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new chat', async () => {
    const res = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({ otherUserId: 'user2' });

    expect(res.status).toBe(200);
    expect(res.body.chatId).toBeDefined();
    expect(res.body.userIds).toContain('user1');
    expect(res.body.userIds).toContain('user2');
  });

  it('should get chat messages', async () => {
    const chat = await new Chat({
      chatId: 'chat1',
      userIds: ['user1', 'user2'],
      messages: []
    }).save();

    const res = await request(app)
      .get(`/api/chats/${chat.chatId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.chatId).toBe('chat1');
    expect(res.body.messages).toEqual([]);
  });
});