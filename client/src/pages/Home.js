import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';

function Home() {
  const { t } = useContext(LanguageContext);
  const categories = ['electronics', 'clothing', 'books', 'home'];

  useEffect(() => {
    trackEvent('view_home', {});
  }, []);

  return (
    <div className="home">
      <h1>{t.welcome}</h1>
      <h2>{t.categories}</h2>
      <div className="categories">
        {categories.map((category) => (
          <Link key={category} to={`/category/${category}`} className="category-card">
            {t[category] || category}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;