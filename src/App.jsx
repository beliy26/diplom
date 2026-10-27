import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import CategoryCard from './components/CategoryCard/CategoryCard';


function App() {
  return (
    <div className="main-container">
      <Header />
      <main className="main-content">
        <Banner />
        <section className="catalog-preview">
          <div className="preview-grid">
            
            <CategoryCard
            title="Сноуборды"
            text={<>Лучшие модели<br />для каждого стиля катания</>}
            className="card-snowboards"
            />
            
            <CategoryCard
            title="Крепления"
            text={<>Надежность и контроль<br />в каждом спуске</>}
            className="card-bindings"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App
