import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../src/components/ThemeToggle';
import { LanguageContext } from '../src/context/LanguageContext';
import { useTheme } from '../src/hooks/useTheme';

jest.mock('../src/hooks/useTheme');

describe('ThemeToggle', () => {
  const toggleTheme = jest.fn();
  const mockTheme = { theme: 'light', toggleTheme };

  beforeEach(() => {
    useTheme.mockReturnValue(mockTheme);
  });

  it('toggles theme', () => {
    render(
      <LanguageContext.Provider value={{ t: { theme_toggle: 'Toggle Theme', light: 'Light', dark: 'Dark' } }}>
        <ThemeToggle />
      </LanguageContext.Provider>
    );

    const button = screen.getByText('Toggle Theme (Dark)');
    fireEvent.click(button);
    expect(toggleTheme).toHaveBeenCalled();
  });
});