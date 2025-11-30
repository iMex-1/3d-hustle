import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import Categories from './components/Categories';
import ObjectDetail from './components/ObjectDetail';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Notification from './components/Notification';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const handleNavigate = (page, options = {}) => {
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      setNotification({ message: 'Accès administrateur requis', type: 'error' });
      return;
    }
    setCurrentPage(page);
    setSelectedObjectId(null);

    if (options.category) {
      setSelectedCategory(options.category);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
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
        return <Gallery onSelectObject={handleSelectObject} searchQuery={searchQuery} selectedCategory={selectedCategory} />;
      case 'categories':
        return <Categories onNavigate={handleNavigate} />;
      case 'detail':
        return <ObjectDetail objectId={selectedObjectId} onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
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
        onSearch={handleSearch}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
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

export default App;
