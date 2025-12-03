import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import * as authService from './services/authService';
import * as databaseService from './services/databaseService';

// Lazy load components
const Homepage = lazy(() => import('./components/Homepage'));
const Gallery = lazy(() => import('./components/Gallery'));
const Categories = lazy(() => import('./components/Categories'));
const Login = lazy(() => import('./components/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

// Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: 'var(--color-text, #999)',
    fontSize: '1.1rem'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Chargement...</p>
    </div>
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userRecord, setUserRecord] = useState(null);
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
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setNotification({ message: 'Erreur lors de la déconnexion', type: 'error' });
    }
  };

  const handleSearch = (query) => {
    navigate('/gallery', { state: { searchQuery: query } });
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user || !userRecord || !userRecord.isAdmin) {
      setNotification({ message: 'Accès administrateur requis', type: 'error' });
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="app">
      <Navigation
        user={user}
        userRecord={userRecord}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Homepage user={user} />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/category/:category" element={<Gallery />} />
              <Route path="/gallery/product/:productId" element={<Gallery />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard user={user} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
