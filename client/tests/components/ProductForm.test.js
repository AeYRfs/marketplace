import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../src/components/ProductForm';
import { LanguageContext } from '../src/context/LanguageContext';
import axios from 'axios';

jest.mock('axios');

describe('ProductForm', () => {
  it('submits product form', async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(
      <LanguageContext.Provider
        value={{
          t: {
            title_en: 'Title (English)',
            title_ru: 'Title (Russian)',
            price: 'Price',
            add_product: 'Add Product'
          }
        }}
      >
        <ProductForm category="electronics" />
      </LanguageContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Title (English)'), {
      target: { value: 'Test Product' }
    });
    fireEvent.change(screen.getByPlaceholderText('Title (Russian)'), {
      target: { value: 'Тестовый продукт' }
    });
    fireEvent.change(screen.getByPlaceholderText('Price'), {
      target: { value: '100' }
    });

    fireEvent.click(screen.getByText('Add Product'));

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/products',
      expect.any(FormData),
      expect.any(Object)
    );
  });
});