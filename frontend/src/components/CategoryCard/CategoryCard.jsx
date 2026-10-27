import { Link } from 'react-router-dom';

function CategoryCard({ slug, title, text }) {
    return (
        <Link to={`/catalog/${slug}`} className={`preview-card card-${slug}`}>
            <div className="preview-content">
                <h3 className="preview-title">{title}</h3>
                <p className="preview-text">{text}</p>
            </div>
        </Link>
    )
}

export default CategoryCard;
