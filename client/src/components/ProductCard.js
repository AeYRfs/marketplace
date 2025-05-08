import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';

function ProductCard({ product }) {
  const { t, language } = useContext(LanguageContext);

  useEffect(() => {
    trackEvent('view_product', { productId: product.productId });
  }, [product.productId]);

  return (
    <div className="product-card">
      {product.images[0] && <img src={product.images[0]} alt={product.title[language]} />}
      <h3>{product.title[language]}</h3>
      <p>{t.price}: ${product.price}</p>
      <p>{t.rating}: {product.averageRating.toFixed(1)} ★</p>
      <p>{product.description[language]}</p>
      <Link to={`/profile/${product.userId._id}`}>
        {t.seller}: {product.userId.userName} ({product.userId.averageRating.toFixed(1)} ★)
      </Link>
    </div>
  );
}

export default ProductCard;
