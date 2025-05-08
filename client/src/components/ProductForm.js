import { useForm } from '../hooks/useForm';
import { productValidation } from '../utils/validations';
import axios from 'axios';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function ProductForm({ category }) {
  const { t } = useContext(LanguageContext);
  const { formData, errors, handleChange, handleSubmit } = useForm(
    {
      titleEn: '',
      titleRu: '',
      descriptionEn: '',
      descriptionRu: '',
      price: '',
      tagsEn: '',
      tagsRu: '',
      images: []
    },
    productValidation,
    async (data) => {
      const formData = new FormData();
      formData.append('titleEn', data.titleEn);
      formData.append('titleRu', data.titleRu);
      formData.append('descriptionEn', data.descriptionEn);
      formData.append('descriptionRu', data.descriptionRu);
      formData.append('price', data.price);
      formData.append('tagsEn', data.tagsEn);
      formData.append('tagsRu', data.tagsRu);
      formData.append('category', category);
      data.images.forEach(img => formData.append('images', img));

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      window.location.reload();
    }
  );

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div>
        <input
          type="text"
          name="titleEn"
          placeholder={t.title_en}
          value={formData.titleEn}
          onChange={handleChange}
        />
        {errors.titleEn && <span className="error">{errors.titleEn}</span>}
      </div>
      <div>
        <input
          type="text"
          name="titleRu"
          placeholder={t.title_ru}
          value={formData.titleRu}
          onChange={handleChange}
        />
        {errors.titleRu && <span className="error">{errors.titleRu}</span>}
      </div>
      <div>
        <textarea
          name="descriptionEn"
          placeholder={t.description_en}
          value={formData.descriptionEn}
          onChange={handleChange}
        />
        {errors.descriptionEn && <span className="error">{errors.descriptionEn}</span>}
      </div>
      <div>
        <textarea
          name="descriptionRu"
          placeholder={t.description_ru}
          value={formData.descriptionRu}
          onChange={handleChange}
        />
        {errors.descriptionRu && <span className="error">{errors.descriptionRu}</span>}
      </div>
      <div>
        <input
          type="number"
          name="price"
          placeholder={t.price}
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>
      <div>
        <input
          type="text"
          name="tagsEn"
          placeholder={t.tags_en}
          value={formData.tagsEn}
          onChange={handleChange}
        />
        {errors.tagsEn && <span className="error">{errors.tagsEn}</span>}
      </div>
      <div>
        <input
          type="text"
          name="tagsRu"
          placeholder={t.tags_ru}
          value={formData.tagsRu}
          onChange={handleChange}
        />
        {errors.tagsRu && <span className="error">{errors.tagsRu}</span>}
      </div>
      <div>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={(e) => handleChange({
            target: {
              name: 'images',
              value: Array.from(e.target.files)
            }
          })}
        />
        {errors.images && <span className="error">{errors.images}</span>}
      </div>
      <button type="submit">{t.add_product}</button>
    </form>
  );
}

export default ProductForm;
