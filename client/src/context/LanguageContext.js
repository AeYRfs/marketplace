import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import en from '../public/locales/en.json';
import ru from '../public/locales/ru.json';

const translations = { en, ru };
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.preferences?.language) {
      setLanguage(user.preferences.language);
    }
  }, [user]);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    if (user) {
      try {
        await axios.put(
          'http://localhost:5000/api/auth/preferences',
          { language: lang },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        localStorage.setItem('user', JSON.stringify({ ...user, preferences: { ...user.preferences, language: lang } }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
