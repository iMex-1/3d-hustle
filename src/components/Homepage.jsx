import { objects } from '../data/objects';
import '../styles/homepage.css';

function Homepage({ onNavigate, onSelectObject }) {
    const featuredObjects = objects.filter(obj => obj.featured);

    return (
        <div className="homepage">
            <section className="hero">
                <div className="hero-content">
                    <h1>Premium 3D Models Marketplace</h1>
                    <p>Discover high-quality 3D objects for your projects</p>
                    <button className="btn-primary" onClick={() => onNavigate('gallery')}>
                        Browse Gallery
                    </button>
                </div>
            </section>

            <section className="featured-section">
                <h2>Featured Objects</h2>
                <div className="featured-grid">
                    {featuredObjects.map(obj => (
                        <div key={obj.id} className="featured-card" onClick={() => onSelectObject(obj.id)}>
                            <div className="card-image">
                                <img src={obj.image} alt={obj.name} />
                            </div>
                            <div className="card-content">
                                <h3>{obj.name}</h3>
                                <p className="category">{obj.category}</p>
                                <p className="description">{obj.description}</p>
                                <div className="card-stats">
                                    <span>📦 {obj.fileSize}</span>
                                    <span>⬇️ {obj.downloads}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Homepage;
