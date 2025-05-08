import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

function Profile() {
  const { userId } = useParams();
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${userId}`),
          axios.get(`http://localhost:5000/api/products/user/${userId}`)
        ]);
        setUser(userRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!user) return <div>{t.loading}</div>;

  return (
    <div className="profile">
      <h2>{user.userName}</h2>
      <p>{t.email}: {user.email}</p>
      <p>{t.rating}: {user.averageRating.toFixed(1)} ★</p>
      {currentUser?.userId === userId && (
        <Link to="/edit-profile">{t.edit_profile}</Link>
      )}
      <h3>{t.products}</h3>
      <div className="products">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            <h4>{product.title[t.language]}</h4>
            <p>{t.price}: ${product.price}</p>
            <Link to={`/product/${product.productId}`}>{t.view_details}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
