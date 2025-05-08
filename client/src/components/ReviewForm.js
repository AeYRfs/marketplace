import { useForm } from '../hooks/useForm';
import { reviewValidation } from '../utils/validations';
import axios from 'axios';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function ReviewForm({ productId }) {
  const { t } = useContext(LanguageContext);
  const { formData, errors, handleChange, handleSubmit } = useForm(
    {
      rating: 1,
      comment: ''
    },
    reviewValidation,
    async (data) => {
      await axios.post(
        'http://localhost:5000/api/reviews',
        { productId, ...data },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      window.location.reload();
    }
  );

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div>
        <label>{t.rating}:</label>
        <select name="rating" value={formData.rating} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>{star} stars</option>
          ))}
        </select>
        {errors.rating && <span className="error">{errors.rating}</span>}
      </div>
      <div>
        <textarea
          name="comment"
          placeholder={t.review_comment}
          value={formData.comment}
          onChange={handleChange}
        />
        {errors.comment && <span className="error">{errors.comment}</span>}
      </div>
      <button type="submit">{t.submit_review}</button>
      {errors.submit && <span className="error">{errors.submit}</span>}
    </form>
  );
}

export default ReviewForm;
