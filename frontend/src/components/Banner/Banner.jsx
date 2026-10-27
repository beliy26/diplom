function Banner() {
    return (
        <section className="banner">
            <div className="info">
                <img src="/images/logo.png" alt="Логотип" width={160} height={160} />
                    <div className="brands">
                        <span className="brand-capita">CAPiTA</span>
                        <span className="divider">×</span>
                        <span className="brand-union">UNION</span>
                    </div>
                <h1 className="title">
                    Специализируемся на сноубордах <br />
                    Capita и креплениях Union
                </h1>

                <ul className="features">
                    <li>
                        <img src="/images/shield.png" alt="" aria-hidden="true" />
                        <span>Оригинальное оборудование</span>
                    </li>
                    <li>
                        <img src="/images/truck.png" alt="" aria-hidden="true" />
                        <span>Доставка по России</span>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default Banner;