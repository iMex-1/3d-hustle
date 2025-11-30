import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { objects as initialObjects } from '../data/objects';
import XeokitViewer from './XeokitViewer';
import '../styles/object-detail.css';

function ObjectDetail({ objectId, onNavigate }) {
    const [objects, setObjects] = useState([]);

    useEffect(() => {
        // Always use initialObjects and save to localStorage
        setObjects(initialObjects);
        localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
    }, []);



    const object = objects.find(obj => obj.id === objectId);

    if (!object) {
        return (
            <div className="object-detail">
                <p>Objet non trouvé</p>
                <button onClick={() => onNavigate('gallery')}>Retour à la Galerie</button>
            </div>
        );
    }

    const handleDownload = () => {
        if (!object.ifcFile) return;

        const link = document.createElement('a');
        link.href = object.ifcFile;
        link.download = `${object.name.replace(/\s+/g, '_')}.ifc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const updatedObjects = objects.map(obj =>
            obj.id === object.id ? { ...obj, downloads: obj.downloads + 1 } : obj
        );
        localStorage.setItem('3d_objects', JSON.stringify(updatedObjects));
        setObjects(updatedObjects);
    };

    return (
        <motion.div
            className="object-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.button
                className="btn-back"
                onClick={() => onNavigate('gallery')}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Retour à la Galerie
            </motion.button>

            <motion.div
                className="detail-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div
                    className="detail-image"
                    onMouseEnter={() => {
                        // Disable page scroll when hovering over 3D viewer
                        document.body.style.overflow = 'hidden';
                    }}
                    onMouseLeave={() => {
                        // Re-enable page scroll when leaving 3D viewer
                        document.body.style.overflow = 'auto';
                    }}
                >
                    {object.xktFile ? (
                        <XeokitViewer xktUrl={object.xktFile} height="100%" width="100%" enableZoom={true} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#666' }}>Pas de prévisualisation</p>
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <h1>{object.name}</h1>
                    <span className="category-badge">{object.category}</span>

                    <p className="description">{object.description}</p>

                    <div className="specs">
                        <h3>Spécifications</h3>
                        <div className="spec-grid">
                            <div className="spec-item">
                                <span className="spec-label">Taille du Fichier</span>
                                <span className="spec-value">{object.fileSize}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Format de Téléchargement</span>
                                <span className="spec-value">IFC</span>
                            </div>
                        </div>
                    </div>

                    <div className="download-section">
                        <h3>Télécharger le Modèle</h3>
                        <div className="format-buttons">
                            <motion.button
                                className="btn-download"
                                onClick={handleDownload}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Télécharger IFC
                            </motion.button>
                        </div>
                        <p className="download-note">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                            Le fichier IFC peut être ouvert dans Revit, ArchiCAD, Tekla, et autres logiciels BIM.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ObjectDetail;
