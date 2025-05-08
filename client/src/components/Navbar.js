import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const history = useHistory();
  const { t, language, changeLanguage } = useContext(LanguageContext);
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchNotifications();
      window.addEventListener('notification', fetchNotifications);
      return () => window.removeEventListener('notification', fetchNotifications);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">{t.home}</Link>
      {user ? (
        <>
          <Link to={`/profile/${user.userId}`}>{t.profile}</Link>
          {(user.role === 'admin' || user.role === 'project_manager') && (
            <Link to="/admin">{t.admin_dashboard}</Link>
          )}
          <div className="notifications">
            {t.notifications}: {notifications.filter(n => !n.read).length}
            <ul>
              {notifications.map(n => (
                <li key={n.notificationId} className={n.read ? 'read' : 'unread'}>
                  {n.message}
                </li>
              ))}
            </ul>
          </div>
          <ThemeToggle />
          <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">{t.english}</option>
            <option value="ru">{t.russian}</option>
          </select>
          <button onClick={handleLogout}>{t.logout}</button>
        </>
      ) : (
        <>
          <Link to="/login">{t.login}</Link>
          <Link to="/register">{t.register}</Link>
          <ThemeToggle />
          <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">{t.english}</option>
            <option value="ru">{t.russian}</option>
          </select>
        </>
      )}
    </nav>
  );
}

export default Navbar;
