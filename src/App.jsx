import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import ObjectDetail from './components/ObjectDetail';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      alert('Admin access required');
      return;
    }
    setCurrentPage(page);
    setSelectedObjectId(null);
  };

  const handleSelectObject = (objectId) => {
    setSelectedObjectId(objectId);
    setCurrentPage('detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={handleNavigate} onSelectObject={handleSelectObject} user={user} />;
      case 'gallery':
        return <Gallery onSelectObject={handleSelectObject} />;
      case 'detail':
        return <ObjectDetail objectId={selectedObjectId} onNavigate={handleNavigate} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Homepage onNavigate={handleNavigate} onSelectObject={handleSelectObject} user={user} />;
    }
  };

  return (
    <div className="app">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
