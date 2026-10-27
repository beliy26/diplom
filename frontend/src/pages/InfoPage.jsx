import { Link } from 'react-router-dom';

// Простая страница-заглушка для разделов, которые ещё не готовы
function InfoPage({ title, text = 'Раздел в разработке.' }) {
  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>
      <h1 className="page-title">{title}</h1>
      <p>{text}</p>
    </section>
  );
}

export default InfoPage;
