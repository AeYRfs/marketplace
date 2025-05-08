import { useForm } from '../hooks/useForm';
import { registerValidation } from '../utils/validations';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function Register() {
  const { t } = useContext(LanguageContext);
  const history = useHistory();
  const { formData, errors, handleChange, handleSubmit } = useForm(
    {
      userName: '',
      email: '',
      password: ''
    },
    registerValidation,
    async (data) => {
      await axios.post('http://localhost:5000/api/auth/register', data);
      history.push('/login');
    }
  );

  return (
    <div className="register">
      <h1>{t.register}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="userName"
            placeholder={t.username}
            value={formData.userName}
            onChange={handleChange}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit">{t.register}</button>
      </form>
      <p>
        {t.have_account} <Link to="/login">{t.login}</Link>
      </p>
    </div>
  );
}

export default Register;