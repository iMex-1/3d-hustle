import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube, FaInfoCircle, FaEnvelope, FaSearch, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ user, userRecord, onLogout, onSearch }) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = location.pathname.substring(1) || 'home';
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
            setMobileMenuOpen(false);
        }
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <motion.nav
            className="navigation"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-container">
                <Link to="/" onClick={handleNavClick} style={{ textDecoration: 'none' }}>
                    <motion.div
                        className="nav-brand"
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
                </Link>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <motion.li
                        className={currentPage === '' || currentPage === 'home' ? 'active' : ''}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link to="/" onClick={handleNavClick}>
                            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <FaHome />
                            </motion.span>
                            <span className="nav-text">Accueil</span>
                        </Link>
                    </motion.li>

                    <motion.li
                        className={currentPage === 'gallery' ? 'active' : ''}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="/gallery" onClick={handleNavClick}>
                            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <FaCube />
                            </motion.span>
                            <span className="nav-text">Galerie</span>
                        </Link>
                    </motion.li>

                    <motion.li
                        className={currentPage === 'about' ? 'active' : ''}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link to="/about" onClick={handleNavClick}>
                            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <FaInfoCircle />
                            </motion.span>
                            <span className="nav-text">À propos</span>
                        </Link>
                    </motion.li>

                    <motion.li
                        className={currentPage === 'contact' ? 'active' : ''}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/contact" onClick={handleNavClick}>
                            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <FaEnvelope />
                            </motion.span>
                            <span className="nav-text">Contact</span>
                        </Link>
                    </motion.li>

                    {user && userRecord && userRecord.isAdmin && (
                        <motion.li
                            className={currentPage === 'admin' ? 'active' : ''}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to="/admin" onClick={handleNavClick}>
                                <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <FaUserShield />
                                </motion.span>
                                <span className="nav-text">Admin</span>
                            </Link>
                        </motion.li>
                    )}

                    <motion.li
                        className="auth-item"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {user ? (
                            <div className="user-profile-container">
                                <div className="user-profile-info">
                                    {user.photoURL && (
                                        <motion.img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="user-profile-photo"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                    )}
                                    <span className="user-display-name">{user.displayName || user.email}</span>
                                </div>
                                <motion.button
                                    className="sign-out-btn"
                                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaSignOutAlt /><span className="nav-text">Déconnexion</span>
                                </motion.button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={handleNavClick}>
                                <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <FaSignInAlt />
                                </motion.span>
                                <span className="nav-text">Connexion</span>
                            </Link>
                        )}
                    </motion.li>
                </ul>

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
