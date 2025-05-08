const ioClient = require('socket.io-client');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const app = require('../../server');
const Chat = require('../../models/Chat');
const User = require('../../models/User');
const socketHandler = require('../../socket');

describe('Chat Socket', () => {
  let server, io, clientSocket1, clientSocket2;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await User.create({
      userId: 'user1',
      userName: 'User1',
      email: 'user1@test.com',
      password: 'hashed',
      role: 'user'
    });
    await User.create({
      userId: 'user2',
      userName: 'User2',
      email: 'user2@test.com',
      password: 'hashed',
      role: 'user'
    });

    server = http.createServer(app);
    io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    socketHandler(io);
    await new Promise((resolve) => server.listen(0, resolve));
  });

  afterAll(async () => {
    io.close();
    server.close();
    await mongoose.connection.close();
  });

  beforeEach((done) => {
    clientSocket1 = ioClient(`http://localhost:${server.address().port}`, {
      query: { userId: 'user1' }
    });
    clientSocket2 = ioClient(`http://localhost:${server.address().port}`, {
      query: { userId: 'user2' }
    });

    let connected = 0;
    const checkConnected = () => {
      if (++connected === 2) done();
    };

    clientSocket1.on('connect', checkConnected);
    clientSocket2.on('connect', checkConnected);
  });

  afterEach(() => {
    clientSocket1.disconnect();
    clientSocket2.disconnect();
  });

  it('should send and receive messages', (done) => {
    const chatId = 'testChat';
    clientSocket1.emit('joinChat', chatId);
    clientSocket2.emit('joinChat', chatId);

    clientSocket1.emit('sendMessage', {
      chatId,
      messageText: 'Hello from user1',
      senderId: 'user1'
    });

    clientSocket2.on('message', (message) => {
      expect(message.messageText).toBe('Hello from user1');
      expect(message.senderId).toBe('user1');
      done();
    });
  });

  it('should block banned users', (done) => {
    // Ban user1
    User.updateOne({ userId: 'user1' }, { 'restrictions.chatBanned': true }).then(() => {
      const bannedSocket = ioClient(`http://localhost:${server.address().port}`, {
        query: { userId: 'user1' }
      });

      bannedSocket.on('connect_error', () => {
        done();
      });

      bannedSocket.on('connect', () => {
        done(new Error('Banned user should not connect'));
      });
    });
  });
});
