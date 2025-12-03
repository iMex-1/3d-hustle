import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as databaseService from '../services/databaseService';
import { getPublicFileUrl } from '../utils/storageHelpers';
import XeokitViewer from './XeokitViewer';
import '../styles/gallery.css';

function Gallery() {
    const { category: urlCategory } = useParams();
    const location = useLocation();
    const selectedObjectId = location.state?.selectedObjectId || null;
    const searchQuery = location.state?.searchQuery || '';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedObject, setSelectedObject] = useState(null);

    const categories = ['Tout', 'Zelige', 'Boiserie', 'Platre', 'Autre'];

    useEffect(() => {
        // Load models from Firebase in real-time
        const unsubscribe = databaseService.listenToModels((models) => {
            // Transform Firebase models to match expected format
            const transformedModels = models.map(model => ({
                id: model.model_id,
                name: model.model_name,
                category: model.model_category,
                description: model.model_description,
                xktFile: getPublicFileUrl(model.model_xkt_url),
                ifcFile: getPublicFileUrl(model.model_ifc_url),
                fileSize: model.model_xkt_size ? `${(model.model_xkt_size / (1024 * 1024)).toFixed(1)} Mo` : 'N/A',
                downloads: model.downloads || 0,
                featured: model.featured || false
            }));

            setObjects(transformedModels);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        }
    }, [urlCategory]);

    useEffect(() => {
        if (selectedObjectId && objects.length > 0) {
            const obj = objects.find(o => o.id === selectedObjectId);
            if (obj) {
                setSelectedObject(obj);
            }
        }
    }, [selectedObjectId, objects]);

    const handleBackToGallery = () => {
        setSelectedObject(null);
        window.history.replaceState({}, '', '/gallery');
    };

    const filteredObjects = objects.filter(obj => {
        const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tout' || obj.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = async (obj) => {
        if (obj.ifcFile) {
            try {
                await databaseService.incrementDownloadCount(obj.id);
                window.open(obj.ifcFile, '_blank');
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        }
    };

    if (selectedObject) {
        return (
            <div className="gallery">
                <div className="product-detail">
                    <button
                        className="back-button"
                        onClick={() => onSelectObject(null)}
                    >
                        ← Retour à la galerie
                    </button>

                    <div className="detail-container">
                        <div className="detail-viewer">
                            {selectedObject.xktFile ? (
                                <XeokitViewer
                                    xktUrl={selectedObject.xktFile}
                                    height="600px"
                                    width="100%"
                                    enableZoom={true}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '600px',
                                    background: '#0A0A0A',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px'
                                }}>
                                    <p style={{ color: '#666' }}>Pas de prévisualisation disponible</p>
                                </div>
                            )}
                        </div>

                        <div className="detail-info">
                            <h1>{selectedObject.name}</h1>
                            <span className="badge">{selectedObject.category}</span>

                            <div className="detail-description">
                                <h3>Description</h3>
                                <p>{selectedObject.description}</p>
                            </div>

                            <div className="detail-meta">
                                <div className="meta-row">
                                    <span className="meta-label">Taille du fichier:</span>
                                    <span className="meta-value">{selectedObject.fileSize}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Téléchargements:</span>
                                    <span className="meta-value">{selectedObject.downloads}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Catégorie:</span>
                                    <span className="meta-value">{selectedObject.category}</span>
                                </div>
                            </div>

                            <div className="detail-actions">
                                <button
                                    className="btn-download"
                                    onClick={() => handleDownload(selectedObject)}
                                    disabled={!selectedObject.ifcFile}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Télécharger le modèle IFC
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                {filteredObjects.map((obj, index) => (
                    <motion.div
                        key={obj.id}
                        className="gallery-card"
                        onClick={() => onSelectObject(obj.id)}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
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
                                <motion.button
                                    className="btn-view"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Voir les Détails
                                </motion.button>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>{obj.name}</h3>
                            <span className="badge">{obj.category}</span>
                            <p className="card-description">{obj.description}</p>
                            <div className="card-meta">
                                <span className="meta-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    </svg>
                                    {obj.fileSize}
                                </span>
                                <span className="meta-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    {obj.downloads}
                                </span>
                            </div>
                        </div>
                    </motion.div>
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
