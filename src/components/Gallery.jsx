import { useState, useEffect } from 'react';
import { objects as initialObjects } from '../data/objects';
import XeokitViewer from './XeokitViewer';
import '../styles/gallery.css';

function Gallery({ onSelectObject, searchQuery = '', selectedCategory: propCategory = null }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [objects, setObjects] = useState([]);

    const categories = ['Tout', 'Architecture', 'MEP', 'Structure', 'Paysage', 'Infrastructure'];
    const categoryMap = {
        'Architecture': 'Architecture',
        'MEP': 'MEP',
        'Structure': 'Structure',
        'Paysage': 'Paysage',
        'Infrastructure': 'Infrastructure'
    };

    useEffect(() => {
        // Always use initialObjects and save to localStorage
        console.log('Gallery: Loading objects', initialObjects);
        setObjects(initialObjects);
        localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
    }, []);

    useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchQuery]);

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

    useEffect(() => {
        console.log('Gallery: Current objects state', objects);
        console.log('Gallery: Filtered objects', filteredObjects);
    }, [objects, filteredObjects]);

    return (
        <div className="gallery">
            <div className="gallery-header">
                <h1>Galerie de Modèles IFC/XKT</h1>
                <p>Parcourez notre collection de {objects.length} modèles BIM</p>
            </div>

            <div className="gallery-controls">
                <input
                    type="text"
                    placeholder="Rechercher des modèles..."
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
                {filteredObjects.map((obj) => (
                    <div
                        key={obj.id}
                        className="gallery-card"
                        onClick={() => onSelectObject(obj.id)}
                    >
                        <div className="card-image">
                            {obj.xktFile ? (
                                <XeokitViewer xktUrl={obj.xktFile} height="100%" width="100%" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: '#666' }}>Pas de prévisualisation</p>
                                </div>
                            )}
                            <div className="card-overlay">
                                <button className="btn-view">Voir les Détails</button>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>{obj.name}</h3>
                            <span className="badge">{obj.category}</span>
                            <div className="card-meta">
                                <span>📦 {obj.fileSize}</span>
                                <span>⬇️ {obj.downloads}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredObjects.length === 0 && (
                <div className="no-results">
                    <p>Aucun modèle trouvé correspondant à vos critères</p>
                </div>
            )}
        </div>
    );
}

export default Gallery;
