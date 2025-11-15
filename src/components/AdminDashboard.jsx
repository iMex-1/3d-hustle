import { useState } from 'react';
import { objects } from '../data/objects';
import '../styles/admin.css';

function AdminDashboard() {
    const [objectList, setObjectList] = useState(objects);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Furniture',
        description: '',
        image: '',
        fileSize: '',
        polygons: '',
        vertices: '',
        formats: []
    });

    const handleEdit = (obj) => {
        setEditingId(obj.id);
        setFormData({
            name: obj.name,
            category: obj.category,
            description: obj.description,
            image: obj.image,
            fileSize: obj.fileSize,
            polygons: obj.polygons,
            vertices: obj.vertices,
            formats: obj.formats
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this object?')) {
            setObjectList(objectList.filter(obj => obj.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setObjectList(objectList.map(obj =>
                obj.id === editingId ? { ...obj, ...formData } : obj
            ));
            setEditingId(null);
        } else {
            const newObject = {
                id: Math.max(...objectList.map(o => o.id)) + 1,
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

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="admin-content">
                <div className="admin-form">
                    <h2>{editingId ? 'Edit Object' : 'Add New Object'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Furniture</option>
                                <option>Lighting</option>
                                <option>Decoration</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>File Size</label>
                                <input
                                    type="text"
                                    value={formData.fileSize}
                                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                                    placeholder="e.g., 12.5 MB"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Polygons</label>
                                <input
                                    type="number"
                                    value={formData.polygons}
                                    onChange={(e) => setFormData({ ...formData, polygons: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Vertices</label>
                                <input
                                    type="number"
                                    value={formData.vertices}
                                    onChange={(e) => setFormData({ ...formData, vertices: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Formats</label>
                            <div className="format-checkboxes">
                                {['OBJ', 'FBX', 'GLB', 'STL'].map(format => (
                                    <label key={format}>
                                        <input
                                            type="checkbox"
                                            checked={formData.formats.includes(format)}
                                            onChange={() => handleFormatToggle(format)}
                                        />
                                        {format}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit">
                                {editingId ? 'Update' : 'Add'} Object
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="btn-cancel">
                                    Cancel
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
                                <img src={obj.image} alt={obj.name} />
                                <div className="object-info">
                                    <h3>{obj.name}</h3>
                                    <p>{obj.category}</p>
                                    <span>{obj.downloads} downloads</span>
                                </div>
                                <div className="object-actions">
                                    <button onClick={() => handleEdit(obj)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(obj.id)} className="btn-delete">Delete</button>
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
