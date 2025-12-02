import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import Categories from './components/Categories';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Notification from './components/Notification';
import * as authService from './services/authService';
import * as databaseService from './services/databaseService';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [user, setUser] = useState(null);
  const [userRecord, setUserRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Subscribe to Firebase auth state changes
    const unsubscribeAuth = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to user record changes for permission updates
  useEffect(() => {
    let unsubscribeUser = null;

    if (user && user.uid) {
      // Subscribe to user record in database
      unsubscribeUser = databaseService.listenToUser(user.uid, (userData) => {
        setUserRecord(userData);
      });
    } else {
      // Clear user record when not authenticated
      setUserRecord(null);
    }

    // Cleanup on unmount or when user changes
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [user]);

  const handleLogin = (userData) => {
    // Login is now handled by Firebase auth state listener
    // This function can be removed or kept for compatibility
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
      setNotification({ message: 'Erreur lors de la déconnexion', type: 'error' });
    }
  };

  const handleNavigate = (page, options = {}) => {
    if (page === 'admin' && (!user || !userRecord || !userRecord.isAdmin)) {
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
    setCurrentPage('gallery');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={handleNavigate} onSelectObject={handleSelectObject} user={user} />;
      case 'gallery':
        return <Gallery onSelectObject={handleSelectObject} searchQuery={searchQuery} selectedCategory={selectedCategory} selectedObjectId={selectedObjectId} />;
      case 'categories':
        return <Categories onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard user={user} />;
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
        userRecord={userRecord}
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
