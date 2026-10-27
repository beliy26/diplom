import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { user, saveLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/profile" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const data = await api('/register', { method: 'POST', body: { name, email, password } });
      saveLogin(data);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page form-page">
      <h1 className="page-title">Регистрация</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Имя
          <input className="input" value={name}
            onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Пароль (не меньше 6 символов)
          <input className="input" type="password" value={password} minLength={6}
            onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Повторите пароль
          <input className="input" type="password" value={password2}
            onChange={(e) => setPassword2(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login" className="back-link">Войти</Link></p>
    </section>
  );
}

export default RegisterPage;
