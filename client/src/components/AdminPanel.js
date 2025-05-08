import { useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

function AdminPanel({ user, onUpdate }) {
  const { t } = useContext(LanguageContext);
  const [restrictions, setRestrictions] = useState(user.restrictions);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleRestrictionChange = async (type, value) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/users/${user.userId}/${type}`,
        { [type]: value },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setRestrictions({ ...restrictions, [type]: value });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromote = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/users/${user.userId}/promote`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Manage {user.userName}</h3>
      <div>
        <label>
          {t.block_account}:
          <input
            type="checkbox"
            checked={restrictions.isBlocked}
            onChange={(e) => handleRestrictionChange('isBlocked', e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          {t.ban_chat}:
          <input
            type="checkbox"
            checked={restrictions.chatBanned}
            onChange={(e) => handleRestrictionChange('chatBanned', e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          {t.ban_product_add}:
          <input
            type="checkbox"
            checked={restrictions.productAddBanned}
            onChange={(e) => handleRestrictionChange('productAddBanned', e.target.checked)}
          />
        </label>
      </div>
      {currentUser.role === 'project_manager' && user.role !== 'project_manager' && (
        <button onClick={handlePromote}>{t.promote_admin}</button>
      )}
    </div>
  );
}

export default AdminPanel;
