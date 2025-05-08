import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AdminPanel from '../components/AdminPanel';
import { LanguageContext } from '../context/LanguageContext';

function AdminDashboard() {
  const { t } = useContext(LanguageContext);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/category/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductDelete = async (productId, isDeleted) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/products/${productId}/delete`,
        { isDeleted },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>{t.admin_dashboard}</h1>
      <h2>{t.users}</h2>
      <div className="users">
        {users.map((user) => (
          <div key={user.userId} className="user-card">
            <p>{user.userName} ({user.email})</p>
            <p>{t.role}: {user.role}</p>
            <AdminPanel user={user} onUpdate={fetchUsers} />
          </div>
        ))}
      </div>
      <h2>{t.products}</h2>
      <div className="products">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <p>{product.title}</p>
            <p>{t.status}: {product.isDeleted ? t.deleted : t.active}</p>
            <button
              onClick={() => handleProductDelete(product.productId, !product.isDeleted)}
            >
              {product.isDeleted ? t.restore_product : t.delete_product}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
