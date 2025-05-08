import { useTheme } from '../hooks/useTheme';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useContext(LanguageContext);

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {t.theme_toggle} ({theme === 'light' ? t.dark : t.light})
    </button>
  );
}

export default ThemeToggle;
