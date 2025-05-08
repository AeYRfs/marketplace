import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../src/components/Profile';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('Profile', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/')) {
        return Promise.resolve({
          data: { userName: 'TestUser', email: 'test@example.com', averageRating: 4.5 }
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders user profile', async () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: { email: 'Email', rating: 'Rating', products: 'Products' },
            language: 'en'
          }}
        >
          <Profile />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Rating: 4.5 ★')).toBeInTheDocument();
    });
  });
});