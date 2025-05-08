import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../src/pages/ProfilePage';
import { LanguageContext } from '../src/context/LanguageContext';

describe('ProfilePage', () => {
  it('renders Profile component', () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider value={{ t: {}, language: 'en' }}>
          <ProfilePage />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    // Проверяем, что Profile рендерится (детали тестируются в Profile.test.js)
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});