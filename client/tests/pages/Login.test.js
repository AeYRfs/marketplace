import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('Login', () => {
  it('submits login form', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'token', user: { userId: 'user1' } }
    });

    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: { login: 'Login', email: 'Email', password: 'Password' }
          }}
        >
          <Login />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Login'));

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      {
        email: 'test@example.com',
        password: 'password123'
      }
    );
  });
});