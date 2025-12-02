import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase/config';
import { uploadToR2, generateModelPaths } from '../utils/storageHelpers';

export default function AdminModelUpload() {
  const [formData, setFormData] = useState({
    model_name: '',
    model_description: '',
    model_category: 'Zelige'
  });
  
  const [ifcFile, setIfcFile] = useState(null);
  const [xktFile, setXktFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.model_name || !ifcFile || !xktFile) {
      setError('Please fill all fields and select both files');
      return;
    }
    
    setUploading(true);
    setError('');
    setProgress('Starting upload...');
    
    try {
      // Generate paths
      const paths = generateModelPaths(formData.model_name);
      
      // Upload IFC file
      setProgress('Uploading IFC file...');
      const ifcResult = await uploadToR2(ifcFile, formData.model_name, 'ifc');
      
      // Upload XKT file
      setProgress('Uploading XKT file...');
      const xktResult = await uploadToR2(xktFile, formData.model_name, 'xkt');
      
      // Save to Firebase
      setProgress('Saving to database...');
      const modelsRef = ref(database, 'models');
      const newModelRef = push(modelsRef);
      
      await set(newModelRef, {
        model_name: formData.model_name,
        model_folder: paths.folder,
        model_description: formData.model_description,
        model_category: formData.model_category,
        model_ifc_url: ifcResult.path,
        model_xkt_url: xktResult.path,
        model_ifc_size: ifcResult.size,
        model_xkt_size: xktResult.size,
        model_owner: 'admin',
        model_created_at: Date.now(),
        model_updated_at: Date.now(),
        downloads: 0,
        featured: false
      });
      
      setProgress('✅ Upload complete!');
      
      // Reset form
      setTimeout(() => {
        setFormData({
          model_name: '',
          model_description: '',
          model_category: 'Zelige'
        });
        setIfcFile(null);
        setXktFile(null);
        setProgress('');
        setUploading(false);
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
      setProgress('');
    }
  };

  return (
    <div className="admin-upload-container">
      <h2>Upload New Model</h2>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Model Name *</label>
          <input
            type="text"
            value={formData.model_name}
            onChange={(e) => setFormData({...formData, model_name: e.target.value})}
            placeholder="e.g., Building Architecture"
            disabled={uploading}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.model_description}
            onChange={(e) => setFormData({...formData, model_description: e.target.value})}
            placeholder="Describe the model..."
            rows="4"
            disabled={uploading}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.model_category}
            onChange={(e) => setFormData({...formData, model_category: e.target.value})}
            disabled={uploading}
          >
            <option value="Zelige">Zelige</option>
            <option value="Boiserie">Boiserie</option>
            <option value="Platre">Platre</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>IFC File * (.ifc)</label>
          <input
            type="file"
            accept=".ifc"
            onChange={(e) => setIfcFile(e.target.files[0])}
            disabled={uploading}
            required
          />
          {ifcFile && <span className="file-info">📄 {ifcFile.name} ({(ifcFile.size / 1024 / 1024).toFixed(2)} MB)</span>}
        </div>
        
        <div className="form-group">
          <label>XKT File * (.xkt)</label>
          <input
            type="file"
            accept=".xkt"
            onChange={(e) => setXktFile(e.target.files[0])}
            disabled={uploading}
            required
          />
          {xktFile && <span className="file-info">📄 {xktFile.name} ({(xktFile.size / 1024 / 1024).toFixed(2)} MB)</span>}
        </div>
        
        {error && <div className="error-message">❌ {error}</div>}
        {progress && <div className="progress-message">⏳ {progress}</div>}
        
        <button type="submit" disabled={uploading} className="btn-upload">
          {uploading ? 'Uploading...' : 'Upload Model'}
        </button>
      </form>
    </div>
  );
}
