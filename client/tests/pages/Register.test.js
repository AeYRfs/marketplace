import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../src/pages/Register';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('Register', () => {
  it('submits registration form', async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: {
              register: 'Register',
              username: 'Username',
              email: 'Email',
              password: 'Password'
            }
          }}
        >
          <Register />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Register'));

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/register',
      {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    );
  });
});