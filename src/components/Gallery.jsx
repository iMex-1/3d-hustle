import { useState, useEffect } from 'react';
import { FaCube, FaDownload, FaSearch } from 'react-icons/fa';
import { objects as initialObjects } from '../data/objects';
import '../styles/gallery.css';

function Gallery({ onSelectObject, searchQuery = '', selectedCategory: propCategory = null }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [objects, setObjects] = useState([]);

    const categories = ['Tout', 'Mobilier', 'Éclairage', 'Décoration'];
    const categoryMap = {
        'Mobilier': 'Furniture',
        'Éclairage': 'Lighting',
        'Décoration': 'Decoration'
    };

    // Load objects from localStorage
    useEffect(() => {
        const savedObjects = localStorage.getItem('3d_objects');
        if (savedObjects) {
            setObjects(JSON.parse(savedObjects));
        } else {
            setObjects(initialObjects);
        }
    }, []);

    // Update search term from props
    useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchQuery]);

    // Update category from props
    useEffect(() => {
        if (propCategory) {
            setSelectedCategory(propCategory);
        }
    }, [propCategory]);

    const filteredObjects = objects.filter(obj => {
        const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tout' || obj.category === categoryMap[selectedCategory];
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="gallery">
            <div className="gallery-header">
                <h1>Galerie d'Objets 3D</h1>
                <p>Parcourez notre collection de {objects.length} modèles 3D premium</p>
            </div>

            <div className="gallery-controls">
                <input
                    type="text"
                    placeholder="Rechercher des objets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"

                />

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="gallery-grid">
                {filteredObjects.map(obj => (
                    <div key={obj.id} className="gallery-card" onClick={() => onSelectObject(obj.id)}>
                        <div className="card-image">
                            <model-viewer
                                src={obj.model}
                                alt={obj.name}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1"
                                style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
                            ></model-viewer>
                            <div className="card-overlay">
                                <button className="btn-view">Voir les Détails</button>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>{obj.name}</h3>
                            <span className="badge">{obj.category}</span>
                            <div className="card-meta">
                                <span><FaCube /> {obj.fileSize}</span>
                                <span><FaDownload /> {obj.downloads}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredObjects.length === 0 && (
                <div className="no-results">
                    <p>Aucun objet trouvé correspondant à vos critères</p>
                </div>
            )}
        </div>
    );
}

export default Gallery;
