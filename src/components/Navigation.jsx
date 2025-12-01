import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube, FaInfoCircle, FaEnvelope, FaSearch, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, userRecord, onLogout, onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            onNavigate('gallery');
        }
    };

    const handleNavClick = (page, options) => {
        setMobileMenuOpen(false);
        onNavigate(page, options);
    };

    return (
        <motion.nav
            className="navigation"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-container">
                <motion.div
                    className="nav-brand"
                    onClick={() => handleNavClick('home')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img 
                        src={theme === 'dark' ? '/logo/LogoInversed.png' : '/logo/Logo.png'} 
                        alt="OakMesh" 
                        className="brand-logo" 
                    />
                    <h2 className="brand-name">OakMesh</h2>
                </motion.div>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <AnimatePresence>
                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li className={currentPage === 'home' ? 'active' : ''}>
                            <a onClick={() => handleNavClick('home')}><FaHome /><span className="nav-text">Accueil</span></a>
                        </li>
                        
                        <li className={currentPage === 'categories' ? 'active' : ''}>
                            <a onClick={() => handleNavClick('categories')}><FaCube /><span className="nav-text">Galerie</span></a>
                        </li>
                        <li className={currentPage === 'about' ? 'active' : ''}>
                            <a onClick={() => handleNavClick('about')}><FaInfoCircle /><span className="nav-text">À propos</span></a>
                        </li>
                        <li className={currentPage === 'contact' ? 'active' : ''}>
                            <a onClick={() => handleNavClick('contact')}><FaEnvelope /><span className="nav-text">Contact</span></a>
                        </li>
                        {user && userRecord && userRecord.isAdmin && (
                            <li className={currentPage === 'admin' ? 'active' : ''}>
                                <a onClick={() => handleNavClick('admin')}><FaUserShield /><span className="nav-text">Admin</span></a>
                            </li>
                        )}
                        <li className="auth-item">
                            {user ? (
                                <div className="user-profile-container">
                                    <div className="user-profile-info">
                                        {user.photoURL && (
                                            <img 
                                                src={user.photoURL} 
                                                alt={user.displayName || 'User'} 
                                                className="user-profile-photo"
                                            />
                                        )}
                                        <span className="user-display-name">{user.displayName || user.email}</span>
                                    </div>
                                    <a 
                                        className="sign-out-btn" 
                                        onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                    >
                                        <FaSignOutAlt /><span className="nav-text">Déconnexion</span>
                                    </a>
                                </div>
                            ) : (
                                <a onClick={() => handleNavClick('login')}>
                                    <FaSignInAlt /><span className="nav-text">Connexion</span>
                                </a>
                            )}
                        </li>
                    </ul>
                </AnimatePresence>

                <div className="nav-right">
                    <motion.button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
}

export default Navigation;
