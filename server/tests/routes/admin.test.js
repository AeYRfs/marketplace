const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

describe('Admin Routes', () => {
  let pmToken, adminToken, userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    await new User({
      userId: 'pm1',
      userName: 'PM',
      email: 'pm@test.com',
      password: 'hashed',
      role: 'project_manager'
    }).save();

    await new User({
      userId: 'admin1',
      userName: 'Admin',
      email: 'admin@test.com',
      password: 'hashed',
      role: 'admin'
    }).save();

    await new User({
      userId: 'user1',
      userName: 'User',
      email: 'user@test.com',
      password: 'hashed',
      role: 'user'
    }).save();

    pmToken = jwt.sign({ userId: 'pm1' }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ userId: 'admin1' }, process.env.JWT_SECRET);
    userToken = jwt.sign({ userId: 'user1' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should allow project manager to promote user to admin', async () => {
    const res = await request(app)
      .post('/api/admin/users/user1/promote')
      .set('Authorization', `Bearer ${pmToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User promoted to admin');
  });

  it('should deny admin to promote user', async () => {
    const res = await request(app)
      .post('/api/admin/users/user1/promote')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Project Manager access required');
  });
});