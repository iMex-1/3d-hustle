import { useState } from 'react';
import AdminModelUpload from '../components/AdminModelUpload';
import AdminModelManager from '../components/AdminModelManager';
import '../styles/admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload Model
          </button>
          <button
            className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Manage Models
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'upload' && <AdminModelUpload />}
        {activeTab === 'manage' && <AdminModelManager />}
      </div>
    </div>
  );
}
