import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { user, saveLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // если уже вошли - сразу в профиль
  if (user) {
    return <Navigate to="/profile" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await api('/login', { method: 'POST', body: { email, password } });
      saveLogin(data);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page form-page">
      <h1 className="page-title">Вход</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Пароль
          <input className="input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit">Войти</button>
      </form>
      <p>Нет аккаунта? <Link to="/register" className="back-link">Зарегистрироваться</Link></p>
    </section>
  );
}

export default LoginPage;
