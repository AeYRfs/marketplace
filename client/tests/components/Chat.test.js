import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../src/components/Chat';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';
import io from 'socket.io-client';

jest.mock('axios');
jest.mock('socket.io-client');

describe('Chat', () => {
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  beforeEach(() => {
    io.mockReturnValue(mockSocket);
    localStorage.setItem('user', JSON.stringify({ userId: 'user1' }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('sends a message', async () => {
    axios.get.mockResolvedValue({
      data: { messages: [] }
    });

    render(
      <LanguageContext.Provider value={{ t: { type_message: 'Type a message', send: 'Send' } }}>
        <Chat chatId="chat1" otherUserId="user2" />
      </LanguageContext.Provider>
    );

    const input = screen.getByPlaceholderText('Type a message');
    const button = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    expect(mockSocket.emit).toHaveBeenCalledWith('sendMessage', {
      chatId: 'chat1',
      messageText: 'Hello',
      senderId: 'user1'
    });
  });
});