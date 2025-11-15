import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCube, FaDownload, FaImage, FaUpload } from 'react-icons/fa';
import { objects as initialObjects } from '../data/objects';
import '../styles/admin.css';

const SUPPORTED_FORMATS = ['GLB', 'GLTF', 'OBJ', 'FBX', 'STL'];
const CATEGORIES = ['Furniture', 'Lighting', 'Decoration'];

function AdminDashboard() {
    const [objectList, setObjectList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Furniture',
        description: '',
        images: [],
        model: null,
        modelName: '',
        fileSize: '',
        polygons: '',
        vertices: '',
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

    const handleEdit = (obj) => {
        setEditingId(obj.id);
        setFormData({
            name: obj.name,
            category: obj.category,
            description: obj.description,
            images: typeof obj.image === 'string' ? [obj.image] : obj.images || [obj.image],
            model: null,
            modelName: obj.model,
            fileSize: obj.fileSize,
            polygons: obj.polygons,
            vertices: obj.vertices,
            formats: obj.formats
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this 3D object? This action cannot be undone.')) {
            const updatedList = objectList.filter(obj => obj.id !== id);
            setObjectList(updatedList);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls]
        }));
    };

    const handleModelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const modelUrl = URL.createObjectURL(file);
            const extension = file.name.split('.').pop().toUpperCase();
            setFormData(prev => ({
                ...prev,
                model: modelUrl,
                modelName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                formats: [extension]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const moveImageToFirst = (index) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const [image] = newImages.splice(index, 1);
            newImages.unshift(image);
            return { ...prev, images: newImages };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.formats.length === 0) {
            alert('Please upload a 3D model file');
            return;
        }

        if (formData.images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        const objectData = {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.images[0],
            images: formData.images,
            model: formData.model || formData.modelName,
            fileSize: formData.fileSize,
            polygons: parseInt(formData.polygons),
            vertices: parseInt(formData.vertices),
            formats: formData.formats
        };

        if (editingId) {
            setObjectList(objectList.map(obj =>
                obj.id === editingId ? { ...obj, ...objectData } : obj
            ));
        } else {
            const newObject = {
                id: Math.max(...objectList.map(o => o.id), 0) + 1,
                ...objectData,
                downloads: 0,
                featured: false
            };
            setObjectList([...objectList, newObject]);
        }

        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            name: '',
            category: 'Furniture',
            description: '',
            images: [],
            model: null,
            modelName: '',
            fileSize: '',
            polygons: '',
            vertices: '',
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
                    <h1><FaCube /> Objects Manager</h1>
                    <p className="admin-subtitle">Manage your 3D marketplace inventory</p>
                </div>
                <button className="btn-add-object" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Object
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
                            {obj.featured && <span className="featured-badge">Featured</span>}
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
                                Featured
                            </label>
                            <div className="action-buttons">
                                <button onClick={() => handleEdit(obj)} className="btn-edit">
                                    <FaEdit /> Edit
                                </button>
                                <button onClick={() => handleDelete(obj.id)} className="btn-delete">
                                    <FaTrash /> Delete
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
                            <h2>{editingId ? 'Edit Object' : 'Add New Object'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Object Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Modern Office Chair"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
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
                                    <label>File Size</label>
                                    <input
                                        type="text"
                                        value={formData.fileSize}
                                        onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                                        placeholder="Auto-filled from upload"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detailed description..."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><FaUpload /> Upload 3D Model * (GLB, GLTF, OBJ, FBX, STL)</label>
                                <input
                                    type="file"
                                    accept=".glb,.gltf,.obj,.fbx,.stl"
                                    onChange={handleModelUpload}
                                    className="file-input"
                                />
                                {formData.modelName && (
                                    <div className="file-preview">
                                        <FaCube /> {formData.modelName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label><FaImage /> Upload Images * (Multiple allowed)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="file-input"
                                />
                                {formData.images.length > 0 && (
                                    <div className="image-preview-grid">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="image-preview-item">
                                                <img src={img} alt={`Preview ${index + 1}`} />
                                                {index === 0 && <span className="primary-badge">Primary</span>}
                                                <div className="image-actions">
                                                    {index !== 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImageToFirst(index)}
                                                            className="btn-set-primary"
                                                        >
                                                            Set as Primary
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="btn-remove-image"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Polygons *</label>
                                    <input
                                        type="number"
                                        value={formData.polygons}
                                        onChange={(e) => setFormData({ ...formData, polygons: e.target.value })}
                                        placeholder="45000"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Vertices *</label>
                                    <input
                                        type="number"
                                        value={formData.vertices}
                                        onChange={(e) => setFormData({ ...formData, vertices: e.target.value })}
                                        placeholder="23000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Additional Formats (Optional)</label>
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
                                    <FaTimes /> Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    <FaSave /> {editingId ? 'Update' : 'Create'} Object
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
