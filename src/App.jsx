import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import ObjectDetail from './components/ObjectDetail';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Notification from './components/Notification';

function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);
  const location = useLocation();

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
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!user || user.role !== 'admin') {
      setNotification({ message: 'Accès administrateur requis', type: 'error' });
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="app">
      <Navigation
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Homepage user={user} />
              </motion.main>
            }
          />
          <Route
            path="/gallery"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Gallery searchQuery={searchQuery} selectedCategory={selectedCategory} />
              </motion.main>
            }
          />
          <Route
            path="/object/:id"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ObjectDetail />
              </motion.main>
            }
          />
          <Route
            path="/about"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <About />
              </motion.main>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Contact />
              </motion.main>
            }
          />
          <Route
            path="/login"
            element={
              <motion.main
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Login onLogin={handleLogin} />
              </motion.main>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <motion.main
                  className="main-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminDashboard />
                </motion.main>
              </ProtectedRoute>
            }
          />
        </Routes>
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
