import { useState, useEffect } from 'react';
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
        <div className="object-detail">
            <button
                className="btn-back"
                onClick={() => onNavigate('gallery')}
            >
                ← Retour à la Galerie
            </button>

            <div className="detail-container">
                <div className="detail-image">
                    {object.xktFile ? (
                        <XeokitViewer xktUrl={object.xktFile} height="100%" width="100%" />
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
                                <span className="spec-label">Format de Visualisation</span>
                                <span className="spec-value">XKT</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Format de Téléchargement</span>
                                <span className="spec-value">IFC</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Téléchargements</span>
                                <span className="spec-value">{object.downloads.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="download-section">
                        <h3>Télécharger le Modèle</h3>
                        <div className="format-buttons">
                            <button
                                className="btn-download"
                                onClick={handleDownload}
                            >
                                ⬇️ Télécharger IFC
                            </button>
                        </div>
                        <p className="download-note">
                            Le fichier IFC peut être ouvert dans Revit, ArchiCAD, Tekla, et autres logiciels BIM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ObjectDetail;
