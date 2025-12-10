import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ModelsProvider } from './context/ModelsContext';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import Categories from './components/Categories';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import * as authService from './services/authService';
import * as databaseService from './services/databaseService';
import './styles/design-system.css';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userRecord, setUserRecord] = useState(null);
  const [notification, setNotification] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Subscribe to Firebase auth state changes
    const unsubscribeAuth = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false); // Auth state is now determined
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
    // Show loading while auth state is being determined
    if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Vérification des permissions...</p>
          </div>
        </div>
      );
    }

    // If no user, redirect to login
    if (!user) {
      setNotification({ message: 'Connexion requise', type: 'error' });
      return <Navigate to="/login" replace />;
    }

    // If user exists but userRecord is still loading, show loading
    if (user && userRecord === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du profil utilisateur...</p>
          </div>
        </div>
      );
    }

    // Check admin access after everything is loaded
    if (!userRecord || !userRecord.isAdmin) {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Routes>
            <Route path="/" element={<Homepage user={user} />} />
            <Route path="/gallery" element={<Categories />} />
            <Route path="/gallery/category/:category" element={<Gallery />} />
            <Route path="/gallery/product/:productId" element={<Gallery />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
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
      <ModelsProvider>
        <AppContent />
      </ModelsProvider>
    </Router>
  );
}

export default App;
