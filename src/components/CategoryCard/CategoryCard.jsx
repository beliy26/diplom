function CategoryCard({title, text, className}) {
    return (
        <div className={`preview-card ${className}`}>
            <div className="preview-content">
                <h3 className="preview-title">{title}</h3>
                <p className="preview-text">{text}</p>
            </div>
        </div>
    )
};

export default CategoryCard;