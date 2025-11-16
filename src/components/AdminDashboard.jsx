import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCube, FaDownload, FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import Notification from './Notification';
import { objects as initialObjects } from '../data/objects';
import '../styles/admin.css';

const SUPPORTED_FORMATS = ['GLB', 'GLTF', 'OBJ', 'FBX', 'STL'];
const CATEGORIES = ['Mobilier', 'Éclairage', 'Décoration'];

function AdminDashboard() {
    const [objectList, setObjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Mobilier',
        description: '',
        model: null,
        modelName: '',
        fileSize: '',
        formats: []
    });

    useEffect(() => {
        const savedObjects = localStorage.getItem('3d_objects');
        if (savedObjects) {
            setObjectList(JSON.parse(savedObjects));
        } else {
            setObjectList(initialObjects);
            localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
        }
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
            model: null,
            modelName: obj.model,
            fileSize: obj.fileSize,
            formats: obj.formats
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

    const handleModelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const modelUrl = URL.createObjectURL(file);
            const extension = file.name.split('.').pop().toUpperCase();
            const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
            const formattedName = fileName
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

            setFormData(prev => ({
                ...prev,
                name: prev.name || formattedName, // Only set if name is empty
                model: modelUrl,
                modelName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                formats: [extension]
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.formats.length === 0) {
            showNotification('Veuillez télécharger un fichier de modèle 3D', 'error');
            return;
        }

        const objectData = {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: 'https://via.placeholder.com/400x300/' +
                (formData.category === 'Mobilier' ? '6366f1' :
                    formData.category === 'Éclairage' ? 'f59e0b' : '10b981') +
                '/ffffff?text=' + encodeURIComponent(formData.name),
            model: formData.model || formData.modelName,
            fileSize: formData.fileSize,
            polygons: 0,
            vertices: 0,
            formats: formData.formats
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
            category: 'Mobilier',
            description: '',
            model: null,
            modelName: '',
            fileSize: '',
            formats: []
        });
    };

    const toggleFeatured = (id) => {
        setObjectList(objectList.map(obj =>
            obj.id === id ? { ...obj, featured: !obj.featured } : obj
        ));
    };

    const handleFormatToggle = (format) => {
        setFormData(prev => ({
            ...prev,
            formats: prev.formats.includes(format)
                ? prev.formats.filter(f => f !== format)
                : [...prev.formats, format]
        }));
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1><FaCube /> Gestionnaire d'Objets</h1>
                    <p className="admin-subtitle">Gérez l'inventaire de votre marketplace 3D</p>
                </div>
                <button className="btn-add-object" onClick={() => setShowModal(true)}>
                    <FaPlus /> Ajouter un Objet
                </button>
            </div>

            <div className="objects-grid">
                {objectList.map(obj => (
                    <div key={obj.id} className="object-card">
                        <div className="object-card-preview">
                            <model-viewer
                                src={obj.model}
                                alt={obj.name}
                                auto-rotate
                                camera-controls
                                style={{ width: '100%', height: '100%' }}
                            ></model-viewer>
                            {obj.featured && <span className="featured-badge">En Vedette</span>}
                        </div>
                        <div className="object-card-content">
                            <h3>{obj.name}</h3>
                            <p className="object-category">{obj.category}</p>
                            <p className="object-description">{obj.description}</p>
                            <div className="object-meta">
                                <span><FaCube /> {obj.fileSize}</span>
                                <span><FaDownload /> {obj.downloads}</span>
                            </div>
                            <div className="object-formats">
                                {obj.formats.map(format => (
                                    <span key={format} className="format-badge">{format}</span>
                                ))}
                            </div>
                        </div>
                        <div className="object-card-actions">
                            <label className="featured-toggle">
                                <input
                                    type="checkbox"
                                    checked={obj.featured}
                                    onChange={() => toggleFeatured(obj.id)}
                                />
                                En Vedette
                            </label>
                            <div className="action-buttons">
                                <button onClick={() => handleEdit(obj)} className="btn-edit">
                                    <FaEdit /> Modifier
                                </button>
                                <button onClick={() => confirmDelete(obj.id)} className="btn-delete">
                                    <FaTrash /> Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Modifier l\'Objet' : 'Ajouter un Nouvel Objet'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label><FaUpload /> Télécharger un Modèle 3D * (GLB, GLTF, OBJ, FBX, STL)</label>
                                <input
                                    type="file"
                                    accept=".glb,.gltf,.obj,.fbx,.stl"
                                    onChange={handleModelUpload}
                                    className="file-input"
                                />
                                {formData.modelName && (
                                    <div className="file-preview">
                                        <FaCube /> {formData.modelName} ({formData.fileSize})
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Nom de l'Objet *</label>
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

                            <div className="form-group">
                                <label>Formats Supplémentaires (Optionnel)</label>
                                <div className="format-checkboxes">
                                    {SUPPORTED_FORMATS.map(format => (
                                        <label key={format} className="format-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={formData.formats.includes(format)}
                                                onChange={() => handleFormatToggle(format)}
                                            />
                                            <span>{format}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-cancel">
                                    <FaTimes /> Annuler
                                </button>
                                <button type="submit" className="btn-submit">
                                    <FaSave /> {editingId ? 'Mettre à Jour' : 'Créer'} l'Objet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><FaExclamationTriangle /> Confirmer la Suppression</h2>
                            <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer cet objet 3D ? Cette action ne peut pas être annulée.</p>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmModal(false)} className="btn-cancel">
                                Annuler
                            </button>
                            <button onClick={handleDelete} className="btn-delete">
                                <FaTrash /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
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
