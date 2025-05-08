import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import ReviewForm from '../components/ReviewForm';
import { LanguageContext } from '../context/LanguageContext';

function Category() {
  const { category } = useParams();
  const { language, t } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviews, setReviews] = useState({});
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const isSearch = location.pathname.includes('search');
        const url = isSearch
          ? `http://localhost:5000/api/products/search?query=${new URLSearchParams(location.search).get('q')}&page=${page}&lang=${language}`
          : `http://localhost:5000/api/products/category/${category}?page=${page}&lang=${language}`;
        
        const res = await axios.get(url);
        setProducts(res.data.products);
        setTotalPages(res.data.pages);

        const reviewPromises = res.data.products.map(p =>
          axios.get(`http://localhost:5000/api/reviews/product/${p.productId}`)
        );
        const reviewResponses = await Promise.all(reviewPromises);
        const reviewMap = {};
        res.data.products.forEach((p, i) => {
          reviewMap[p.productId] = reviewResponses[i].data;
        });
        setReviews(reviewMap);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [category, page, location, language]);

  return (
    <div className="category">
      <h1>{category || t.search_results}</h1>
      {localStorage.getItem('token') && !location.pathname.includes('search') && (
        <ProductForm category={category} />
      )}
      <div className="products">
        {products.map((product) => (
          <div key={product.productId}>
            <ProductCard product={product} />
            {localStorage.getItem('token') && (
              <ReviewForm productId={product.productId} />
            )}
            <div className="reviews">
              {reviews[product.productId]?.map((review) => (
                <div key={review.reviewId} className="review">
                  <p>{review.rating} ★ - {review.comment}</p>
                  <p>{t.by}: {review.userId.userName}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          {t.previous}
        </button>
        <span>{page} {t.of} {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}

export default Category;