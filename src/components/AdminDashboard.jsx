import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCube, FaDownload } from 'react-icons/fa';
import { objects as initialObjects } from '../data/objects';
import '../styles/admin.css';

// Supported 3D file formats
const SUPPORTED_FORMATS = ['GLB', 'GLTF', 'OBJ', 'FBX', 'STL'];
const CATEGORIES = ['Furniture', 'Lighting', 'Decoration'];

function AdminDashboard() {
    const [objectList, setObjectList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Furniture',
        description: '',
        image: '',
        model: '',
        fileSize: '',
        polygons: '',
        vertices: '',
        formats: []
    });

    // Load objects from localStorage or use initial data
    useEffect(() => {
        const savedObjects = localStorage.getItem('3d_objects');
        if (savedObjects) {
            setObjectList(JSON.parse(savedObjects));
        } else {
            setObjectList(initialObjects);
            localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
        }
    }, []);

    // Save to localStorage whenever objectList changes
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
            image: obj.image,
            model: obj.model,
            fileSize: obj.fileSize,
            polygons: obj.polygons,
            vertices: obj.vertices,
            formats: obj.formats
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this 3D object? This action cannot be undone.')) {
            const updatedList = objectList.filter(obj => obj.id !== id);
            setObjectList(updatedList);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.formats.length === 0) {
            alert('Please select at least one 3D format');
            return;
        }

        if (editingId) {
            // Update existing object
            setObjectList(objectList.map(obj =>
                obj.id === editingId ? { ...obj, ...formData } : obj
            ));
            setEditingId(null);
        } else {
            // Add new object
            const newObject = {
                id: Math.max(...objectList.map(o => o.id), 0) + 1,
                ...formData,
                downloads: 0,
                featured: false
            };
            setObjectList([...objectList, newObject]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Furniture',
            description: '',
            image: '',
            model: '',
            fileSize: '',
            polygons: '',
            vertices: '',
            formats: []
        });
        setEditingId(null);
    };

    const handleFormatToggle = (format) => {
        setFormData(prev => ({
            ...prev,
            formats: prev.formats.includes(format)
                ? prev.formats.filter(f => f !== format)
                : [...prev.formats, format]
        }));
    };

    const toggleFeatured = (id) => {
        setObjectList(objectList.map(obj =>
            obj.id === id ? { ...obj, featured: !obj.featured } : obj
        ));
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1><FaCube /> 3D Object Management Dashboard</h1>
                <p className="admin-subtitle">Manage your 3D marketplace inventory</p>
                <div className="format-info">
                    <strong>Supported Formats:</strong> {SUPPORTED_FORMATS.join(', ')}
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-form">
                    <h2>{editingId ? <><FaEdit /> Edit Object</> : <><FaPlus /> Add New Object</>}</h2>
                    <form onSubmit={handleSubmit}>
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
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Detailed description of the 3D object..."
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>3D Model Path * (relative to /models/)</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                placeholder="/models/your-model.glb"
                                required
                            />
                            <small>Place your 3D file in the public/models/ folder</small>
                        </div>

                        <div className="form-group">
                            <label>Preview Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg or leave for placeholder"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>File Size *</label>
                                <input
                                    type="text"
                                    value={formData.fileSize}
                                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                                    placeholder="e.g., 12.5 MB"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Polygons *</label>
                                <input
                                    type="number"
                                    value={formData.polygons}
                                    onChange={(e) => setFormData({ ...formData, polygons: parseInt(e.target.value) || '' })}
                                    placeholder="45000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Vertices *</label>
                                <input
                                    type="number"
                                    value={formData.vertices}
                                    onChange={(e) => setFormData({ ...formData, vertices: parseInt(e.target.value) || '' })}
                                    placeholder="23000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>3D File Formats * (Select all that apply)</label>
                            <div className="format-checkboxes">
                                {SUPPORTED_FORMATS.map(format => (
                                    <label key={format} className="format-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.formats.includes(format)}
                                            onChange={() => handleFormatToggle(format)}
                                        />
                                        <span className="format-label">{format}</span>
                                    </label>
                                ))}
                            </div>
                            <small>Supported: GLB, GLTF, OBJ, FBX, STL</small>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit">
                                <FaSave /> {editingId ? 'Update Object' : 'Add Object'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="btn-cancel">
                                    <FaTimes /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-list">
                    <h2>Manage Objects ({objectList.length})</h2>
                    <div className="object-list">
                        {objectList.map(obj => (
                            <div key={obj.id} className="object-item">
                                <div className="object-preview">
                                    <model-viewer
                                        src={obj.model}
                                        alt={obj.name}
                                        auto-rotate
                                        camera-controls
                                        style={{ width: '100%', height: '100%' }}
                                    ></model-viewer>
                                </div>
                                <div className="object-info">
                                    <h3>{obj.name}</h3>
                                    <p className="object-category">{obj.category}</p>
                                    <div className="object-meta">
                                        <span><FaCube /> {obj.fileSize}</span>
                                        <span><FaDownload /> {obj.downloads}</span>
                                    </div>
                                    <div className="object-formats">
                                        {obj.formats.map(format => (
                                            <span key={format} className="format-badge">{format}</span>
                                        ))}
                                    </div>
                                    <label className="featured-toggle">
                                        <input
                                            type="checkbox"
                                            checked={obj.featured}
                                            onChange={() => toggleFeatured(obj.id)}
                                        />
                                        Featured
                                    </label>
                                </div>
                                <div className="object-actions">
                                    <button onClick={() => handleEdit(obj)} className="btn-edit">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(obj.id)} className="btn-delete">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
