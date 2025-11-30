import { useState, useEffect } from 'react';
import Notification from './Notification';
import XeokitViewer from './XeokitViewer';
import { objects as initialObjects } from '../data/objects';
import '../styles/admin.css';

const CATEGORIES = ['Zelige', 'Boiserie', 'Platre', 'Autre'];

function AdminDashboard() {
    const [objectList, setObjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Zelige',
        description: '',
        xktFile: null,
        xktFileName: '',
        ifcFile: null,
        ifcFileName: '',
        fileSize: ''
    });

    useEffect(() => {
        // Always use initialObjects and save to localStorage
        setObjectList(initialObjects);
        localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
    }, []);

    useEffect(() => {
        if (objectList.length > 0) {
            localStorage.setItem('3d_objects', JSON.stringify(objectList));
        }
    }, [objectList]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleEdit = (obj) => {
        setEditingId(obj.id);
        setFormData({
            name: obj.name,
            category: obj.category,
            description: obj.description,
            xktFile: obj.xktFile,
            xktFileName: obj.xktFile,
            ifcFile: obj.ifcFile,
            ifcFileName: obj.ifcFile,
            fileSize: obj.fileSize
        });
        setShowModal(true);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirmModal(true);
    };

    const handleDelete = () => {
        const updatedList = objectList.filter(obj => obj.id !== deleteId);
        setObjectList(updatedList);
        setShowConfirmModal(false);
        setDeleteId(null);
        showNotification('Objet supprimé avec succès', 'success');
    };

    const handleXKTUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            const formattedName = fileName
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            setFormData(prev => ({
                ...prev,
                name: prev.name || formattedName,
                xktFile: fileUrl,
                xktFileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' Mo'
            }));
        }
    };

    const handleIFCUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                ifcFile: fileUrl,
                ifcFileName: file.name
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.xktFile) {
            showNotification('Veuillez télécharger un fichier XKT', 'error');
            return;
        }

        if (!formData.ifcFile) {
            showNotification('Veuillez télécharger un fichier IFC', 'error');
            return;
        }

        const objectData = {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            xktFile: formData.xktFile,
            ifcFile: formData.ifcFile,
            fileSize: formData.fileSize
        };

        if (editingId) {
            setObjectList(objectList.map(obj =>
                obj.id === editingId ? { ...obj, ...objectData } : obj
            ));
            showNotification('Objet mis à jour avec succès', 'success');
        } else {
            const newObject = {
                id: Math.max(...objectList.map(o => o.id), 0) + 1,
                ...objectData,
                downloads: 0,
                featured: false
            };
            setObjectList([...objectList, newObject]);
            showNotification('Objet créé avec succès', 'success');
        }

        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            name: '',
            category: 'Zelige',
            description: '',
            xktFile: null,
            xktFileName: '',
            ifcFile: null,
            ifcFileName: '',
            fileSize: ''
        });
    };

    const toggleFeatured = (id) => {
        setObjectList(objectList.map(obj =>
            obj.id === id ? { ...obj, featured: !obj.featured } : obj
        ));
    };



    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1>Gestionnaire de Modèles BIM</h1>
                    <p className="admin-subtitle">Gérez l'inventaire de modèles IFC/XKT</p>
                </div>
                <button className="btn-add-object" onClick={() => setShowModal(true)}>
                    Ajouter un Modèle
                </button>
            </div>

            <div className="objects-grid">
                {objectList.map((obj, index) => (
                    <div key={obj.id} className="object-card animate-fade-in-up" style={{ '--index': index }}>
                        <div className="object-card-preview">
                            {obj.xktFile ? (
                                <XeokitViewer xktUrl={obj.xktFile} height="100%" width="100%" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'var(--color-viewport-bg, #0A0A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: 'var(--color-on-surface-secondary, #666)' }}>Pas de prévisualisation</p>
                                </div>
                            )}
                            {obj.featured && <span className="featured-badge">⭐</span>}
                        </div>
                        <div className="object-card-content">
                            <div className="card-header">
                                <h3>{obj.name}</h3>
                                <span className="object-category">{obj.category}</span>
                            </div>
                            <div className="object-meta">
                                <span>Taille: {obj.fileSize}</span>
                                <span>Téléchargements: {obj.downloads}</span>
                            </div>
                        </div>
                        <div className="object-card-actions">
                            <label className="featured-toggle">
                                <input
                                    type="checkbox"
                                    checked={obj.featured}
                                    onChange={() => toggleFeatured(obj.id)}
                                />
                                Vedette
                            </label>
                            <div className="action-buttons">
                                <button onClick={() => handleEdit(obj)} className="btn-edit" title="Modifier">
                                    Modifier
                                </button>
                                <button onClick={() => confirmDelete(obj.id)} className="btn-delete" title="Supprimer">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Modifier le Modèle' : 'Ajouter un Nouveau Modèle'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Télécharger Fichier XKT * (pour visualisation)</label>
                                <input
                                    type="file"
                                    accept=".xkt"
                                    onChange={handleXKTUpload}
                                    className="file-input"
                                />
                                {formData.xktFileName && (
                                    <div className="file-preview">
                                        {formData.xktFileName} ({formData.fileSize})
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Télécharger Fichier IFC * (pour téléchargement)</label>
                                <input
                                    type="file"
                                    accept=".ifc"
                                    onChange={handleIFCUpload}
                                    className="file-input"
                                />
                                {formData.ifcFileName && (
                                    <div className="file-preview">
                                        {formData.ifcFileName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Nom du Modèle *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Rempli automatiquement depuis le nom du fichier"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Catégorie *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description détaillée..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-cancel">
                                    Annuler
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingId ? 'Mettre à Jour' : 'Créer'} le Modèle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚠️ Confirmer la Suppression</h2>
                            <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action ne peut pas être annulée.</p>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmModal(false)} className="btn-cancel">
                                Annuler
                            </button>
                            <button onClick={handleDelete} className="btn-delete">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
