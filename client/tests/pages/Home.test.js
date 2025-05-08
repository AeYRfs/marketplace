import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';
import { LanguageContext } from '../src/context/LanguageContext';

describe('Home', () => {
  it('renders categories', () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider value={{ t: { welcome: 'Welcome', categories: 'Categories', electronics: 'Electronics' } }}>
          <Home />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });
});