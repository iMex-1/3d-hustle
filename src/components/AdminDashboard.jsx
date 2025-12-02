import { useState, useEffect } from 'react';
import Notification from './Notification';
import XeokitViewer from './XeokitViewer';
import * as databaseService from '../services/databaseService';
import { uploadToR2, generateModelPaths, deleteModelFromR2 } from '../utils/storageHelpers';
import '../styles/admin.css';

const CATEGORIES = ['Zelige', 'Boiserie', 'Platre', 'Autre'];

function AdminDashboard({ user }) {
    const [objectList, setObjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Zelige',
        description: '',
        xktFile: null,
        xktFileName: '',
        ifcFile: null,
        ifcFileName: '',
        fileSize: '',
        xktSize: 0,
        ifcSize: 0
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    // Subscribe to real-time model updates
    useEffect(() => {
        setLoading(true);
        
        // Set up real-time listener
        const unsubscribe = databaseService.listenToModels((models) => {
            console.log('Models received from Firebase:', models);
            setObjectList(models);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleEdit = (obj) => {
        setEditingId(obj.model_id);
        setFormData({
            name: obj.model_name,
            category: obj.model_category,
            description: obj.model_description,
            xktFile: obj.model_xkt_url,
            xktFileName: obj.filename,
            ifcFile: obj.model_ifc_url,
            ifcFileName: obj.filename,
            fileSize: obj.model_xkt_size ? `${(obj.model_xkt_size / (1024 * 1024)).toFixed(2)} Mo` : '',
            xktSize: obj.model_xkt_size,
            ifcSize: obj.model_ifc_size
        });
        setShowModal(true);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            // Find the model to get its name for R2 deletion
            const model = objectList.find(obj => obj.model_id === deleteId);
            
            if (model) {
                // Delete from R2 storage first
                try {
                    await deleteModelFromR2(model.model_name);
                } catch (r2Error) {
                    console.warn('R2 deletion failed (files may not exist):', r2Error);
                    // Continue with database deletion even if R2 fails
                }
            }
            
            // Delete from Firebase database
            await databaseService.deleteModel(deleteId);
            
            setShowConfirmModal(false);
            setDeleteId(null);
            showNotification('Objet supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting model:', error);
            showNotification('Erreur lors de la suppression', 'error');
        }
    };

    const handleXKTUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store the actual File object, not blob URL
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            const formattedName = fileName
                .replace(/[_-]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            setFormData(prev => ({
                ...prev,
                name: prev.name || formattedName,
                xktFile: file, // Store actual file
                xktFileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' Mo',
                xktSize: file.size
            }));
        }
    };

    const handleIFCUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store the actual File object, not blob URL
            setFormData(prev => ({
                ...prev,
                ifcFile: file, // Store actual file
                ifcFileName: file.name,
                ifcSize: file.size
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.xktFile) {
            showNotification('Veuillez télécharger un fichier XKT', 'error');
            return;
        }

        if (!formData.ifcFile) {
            showNotification('Veuillez télécharger un fichier IFC', 'error');
            return;
        }

        if (!user || !user.uid) {
            showNotification('Utilisateur non authentifié', 'error');
            return;
        }

        setUploading(true);
        setUploadProgress('Préparation...');

        try {
            // Generate organized paths
            const paths = generateModelPaths(formData.name);
            
            let ifcUrl, xktUrl;
            
            // Check if files are new uploads (File objects) or existing URLs (strings)
            if (formData.ifcFile instanceof File) {
                // Upload IFC to R2
                setUploadProgress('Upload du fichier IFC...');
                const ifcResult = await uploadToR2(formData.ifcFile, formData.name, 'ifc');
                ifcUrl = ifcResult.path;
            } else {
                // Keep existing URL
                ifcUrl = formData.ifcFile;
            }
            
            if (formData.xktFile instanceof File) {
                // Upload XKT to R2
                setUploadProgress('Upload du fichier XKT...');
                const xktResult = await uploadToR2(formData.xktFile, formData.name, 'xkt');
                xktUrl = xktResult.path;
            } else {
                // Keep existing URL
                xktUrl = formData.xktFile;
            }

            // Save to Firebase
            setUploadProgress('Enregistrement dans la base de données...');
            const modelData = {
                filename: formData.xktFileName || formData.name,
                model_name: formData.name,
                model_folder: paths.folder,
                model_category: formData.category,
                model_description: formData.description,
                model_owner: user.uid,
                model_ifc_url: ifcUrl,
                model_xkt_url: xktUrl,
                model_ifc_size: formData.ifcSize || 0,
                model_xkt_size: formData.xktSize || 0
            };

            if (editingId) {
                // Update existing model
                await databaseService.updateModel(editingId, modelData);
                showNotification('Objet mis à jour avec succès', 'success');
            } else {
                // Create new model
                await databaseService.createModel(modelData);
                showNotification('Objet créé avec succès', 'success');
            }

            closeModal();
        } catch (error) {
            console.error('Error saving model:', error);
            showNotification(`Erreur: ${error.message}`, 'error');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
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
            fileSize: '',
            xktSize: 0,
            ifcSize: 0
        });
    };

    const toggleFeatured = async (id) => {
        try {
            const model = objectList.find(obj => obj.model_id === id);
            if (model) {
                await databaseService.updateModel(id, {
                    featured: !model.featured
                });
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
            showNotification('Erreur lors de la mise à jour', 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1>Gestionnaire de Modèles BIM</h1>
                    <p className="admin-subtitle">Gérez l'inventaire de modèles IFC/XKT</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-add-object" onClick={() => setShowModal(true)}>
                        Ajouter un Modèle
                    </button>
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-on-surface-secondary, #666)' }}>
                    <p>Chargement des modèles...</p>
                </div>
            )}

            {!loading && objectList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-on-surface-secondary, #666)' }}>
                    <p>Aucun modèle trouvé dans la base de données.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Cliquez sur "Ajouter un Modèle" pour commencer.</p>
                </div>
            )}

            <div className="objects-grid">
                {objectList.map((obj, index) => (
                    <div key={obj.model_id} className="object-card animate-fade-in-up" style={{ '--index': index }}>
                        <div className="object-card-preview">
                            {obj.model_xkt_url ? (
                                <XeokitViewer xktUrl={obj.model_xkt_url} height="100%" width="100%" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'var(--color-viewport-bg, #0A0A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: 'var(--color-on-surface-secondary, #666)' }}>Pas de prévisualisation</p>
                                </div>
                            )}
                            {obj.featured && <span className="featured-badge">⭐</span>}
                        </div>
                        <div className="object-card-content">
                            <div className="card-header">
                                <h3>{obj.model_name}</h3>
                                <span className="object-category">{obj.model_category}</span>
                            </div>
                            <div className="object-meta">
                                <span>Taille: {obj.model_xkt_size ? `${(obj.model_xkt_size / (1024 * 1024)).toFixed(2)} Mo` : 'N/A'}</span>
                                <span>Téléchargements: {obj.downloads || 0}</span>
                            </div>
                        </div>
                        <div className="object-card-actions">
                            <label className="featured-toggle">
                                <input
                                    type="checkbox"
                                    checked={obj.featured || false}
                                    onChange={() => toggleFeatured(obj.model_id)}
                                />
                                Vedette
                            </label>
                            <div className="action-buttons">
                                <button onClick={() => handleEdit(obj)} className="btn-edit" title="Modifier">
                                    Modifier
                                </button>
                                <button onClick={() => confirmDelete(obj.model_id)} className="btn-delete" title="Supprimer">
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

                            {uploadProgress && (
                                <div style={{ 
                                    padding: '1rem', 
                                    background: 'rgba(0, 168, 150, 0.1)', 
                                    border: '1px solid rgba(0, 168, 150, 0.3)',
                                    borderRadius: '8px',
                                    color: '#00A896',
                                    textAlign: 'center'
                                }}>
                                    ⏳ {uploadProgress}
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-cancel" disabled={uploading}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-submit" disabled={uploading}>
                                    {uploading ? 'Upload en cours...' : editingId ? 'Mettre à Jour' : 'Créer'} {!uploading && 'le Modèle'}
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
