import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Category from '../src/pages/Category';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('Category', () => {
  const mockProducts = [
    {
      productId: '1',
      title: { en: 'Product 1', ru: 'Продукт 1' },
      price: 100,
      averageRating: 4.5,
      userId: { userName: 'User1', averageRating: 4.0 }
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { products: mockProducts, pages: 1 }
    });
  });

  it('renders products for category', async () => {
    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{ t: { search_results: 'Search Results' }, language: 'en' }}
        >
          <Category />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('Rating: 4.5 ★')).toBeInTheDocument();
    });
  });
});