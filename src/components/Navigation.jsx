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

                <AnimatePresence>
                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li className={currentPage === '' || currentPage === 'home' ? 'active' : ''}>
                            <Link to="/" onClick={handleNavClick}><FaHome /><span className="nav-text">Accueil</span></Link>
                        </li>

                        <li className={currentPage === 'gallery' ? 'active' : ''}>
                            <Link to="/gallery" onClick={handleNavClick}><FaCube /><span className="nav-text">Galerie</span></Link>
                        </li>
                        <li className={currentPage === 'about' ? 'active' : ''}>
                            <Link to="/about" onClick={handleNavClick}><FaInfoCircle /><span className="nav-text">À propos</span></Link>
                        </li>
                        <li className={currentPage === 'contact' ? 'active' : ''}>
                            <Link to="/contact" onClick={handleNavClick}><FaEnvelope /><span className="nav-text">Contact</span></Link>
                        </li>
                        {user && userRecord && userRecord.isAdmin && (
                            <li className={currentPage === 'admin' ? 'active' : ''}>
                                <Link to="/admin" onClick={handleNavClick}><FaUserShield /><span className="nav-text">Admin</span></Link>
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
                                    <button
                                        className="sign-out-btn"
                                        onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                    >
                                        <FaSignOutAlt /><span className="nav-text">Déconnexion</span>
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={handleNavClick}>
                                    <FaSignInAlt /><span className="nav-text">Connexion</span>
                                </Link>
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
