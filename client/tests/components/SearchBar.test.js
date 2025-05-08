import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from '../src/components/SearchBar';
import { LanguageContext } from '../src/context/LanguageContext';

describe('SearchBar', () => {
  it('submits search query', () => {
    const mockPush = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useHistory: () => ({ push: mockPush })
    }));

    render(
      <BrowserRouter>
        <LanguageContext.Provider
          value={{
            t: { search_placeholder: 'Search...', search: 'Search' }
          }}
        >
          <SearchBar />
        </LanguageContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'test' }
    });
    fireEvent.click(screen.getByText('Search'));

    expect(mockPush).toHaveBeenCalledWith('/search?q=test');
  });
});