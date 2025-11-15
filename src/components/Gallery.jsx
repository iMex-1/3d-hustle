import { useState } from 'react';
import { objects } from '../data/objects';
import '../styles/gallery.css';

function Gallery({ onSelectObject }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Furniture', 'Lighting', 'Decoration'];

    const filteredObjects = objects.filter(obj => {
        const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || obj.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="gallery">
            <div className="gallery-header">
                <h1>3D Object Gallery</h1>
                <p>Browse our collection of {objects.length} premium 3D models</p>
            </div>

            <div className="gallery-controls">
                <input
                    type="text"
                    placeholder="Search objects..."
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
                            <img src={obj.image} alt={obj.name} />
                            <div className="card-overlay">
                                <button className="btn-view">View Details</button>
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
                    <p>No objects found matching your criteria</p>
                </div>
            )}
        </div>
    );
}

export default Gallery;
