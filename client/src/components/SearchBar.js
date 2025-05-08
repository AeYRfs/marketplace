import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

function SearchBar() {
  const { t } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      history.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder={t.search_placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">{t.search}</button>
    </form>
  );
}

export default SearchBar;
