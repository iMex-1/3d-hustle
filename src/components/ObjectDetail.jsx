import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaCube, FaChartBar } from 'react-icons/fa';
import { objects as initialObjects } from '../data/objects';
import '../styles/object-detail.css';

function ObjectDetail({ objectId, onNavigate }) {
    const [objects, setObjects] = useState([]);

    // Load objects from localStorage
    useEffect(() => {
        const dataVersion = localStorage.getItem('3d_objects_version');
        const currentVersion = '2.0'; // Updated for new categories
        
        if (dataVersion !== currentVersion) {
            // Force update with new data structure
            localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
            localStorage.setItem('3d_objects_version', currentVersion);
            setObjects(initialObjects);
        } else {
            const savedObjects = localStorage.getItem('3d_objects');
            if (savedObjects) {
                setObjects(JSON.parse(savedObjects));
            } else {
                setObjects(initialObjects);
                localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
            }
        }
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

    const handleDownload = (format) => {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = object.model;
        link.download = `${object.name.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update download count
        const updatedObjects = objects.map(obj =>
            obj.id === object.id ? { ...obj, downloads: obj.downloads + 1 } : obj
        );
        localStorage.setItem('3d_objects', JSON.stringify(updatedObjects));
        setObjects(updatedObjects);
    };

    return (
        <div className="object-detail">
            <motion.button
                className="btn-back"
                onClick={() => onNavigate('gallery')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaArrowLeft /> Retour à la Galerie
            </motion.button>

            <div className="detail-container">
                <motion.div
                    className="detail-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <model-viewer
                        src={object.model}
                        alt={object.name}
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        style={{ width: '100%', height: '100%' }}
                    ></model-viewer>
                </motion.div>

                <motion.div
                    className="detail-info"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
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
                                <span className="spec-label">Polygones</span>
                                <span className="spec-value">{object.polygons.toLocaleString()}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Sommets</span>
                                <span className="spec-value">{object.vertices.toLocaleString()}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Téléchargements</span>
                                <span className="spec-value">{object.downloads.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="download-section">
                        <h3>Formats Disponibles</h3>
                        <div className="format-buttons">
                            {object.formats.map((format, index) => (
                                <motion.button
                                    key={format}
                                    className="btn-download"
                                    onClick={() => handleDownload(format)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaDownload /> Télécharger {format}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ObjectDetail;
