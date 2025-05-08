import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
      document.body.className = user.preferences.theme;
    }
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;

    if (user) {
      try {
        await axios.put(
          'http://localhost:5000/api/auth/preferences',
          { theme: newTheme },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        localStorage.setItem('user', JSON.stringify({ ...user, preferences: { ...user.preferences, theme: newTheme } }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { theme, toggleTheme };
};
