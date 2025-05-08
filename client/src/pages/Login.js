import { useForm } from '../hooks/useForm';
import { loginValidation } from '../utils/validations';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function Login() {
  const { t } = useContext(LanguageContext);
  const history = useHistory();
  const { formData, errors, handleChange, handleSubmit } = useForm(
    {
      email: '',
      password: ''
    },
    loginValidation,
    async (data) => {
      const res = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      history.push('/');
    }
  );

  return (
    <div className="login">
      <h1>{t.login}</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{t.login}</button>
      </form>
      <p>
        {t.no_account} <Link to="/register">{t.register}</Link>
      </p>
    </div>
  );
}

export default Login;