import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: 'user1', role: 'user' }));
    axios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders authenticated navbar', () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: { home: 'Home', profile: 'Profile', logout: 'Logout' },
            language: 'en',
            changeLanguage: jest.fn()
          }}
        >
          <Navbar />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout', () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: { home: 'Home', profile: 'Profile', logout: 'Logout' },
            language: 'en',
            changeLanguage: jest.fn()
          }}
        >
          <Navbar />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});