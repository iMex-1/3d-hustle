import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaInfoCircle, FaEnvelope, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ user, onLogout, onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            navigate('/gallery');
        }
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            className="navigation"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-container">
                <Link to="/">
                    <motion.div
                        className="nav-brand"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/logo/Logo.png" alt="OakMesh" className="brand-logo" />
                        <h2 className="brand-name">OakMesh</h2>
                    </motion.div>
                </Link>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <AnimatePresence>
                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li className={isActive('/') ? 'active' : ''}>
                            <Link to="/" onClick={handleNavClick}><FaHome /><span className="nav-text">Accueil</span></Link>
                        </li>
                        <li className={isActive('/gallery') ? 'active' : ''}>
                            <Link to="/gallery" onClick={handleNavClick}><FaImages /><span className="nav-text">Galerie</span></Link>
                        </li>
                        <li className={isActive('/about') ? 'active' : ''}>
                            <Link to="/about" onClick={handleNavClick}><FaInfoCircle /><span className="nav-text">À propos</span></Link>
                        </li>
                        <li className={isActive('/contact') ? 'active' : ''}>
                            <Link to="/contact" onClick={handleNavClick}><FaEnvelope /><span className="nav-text">Contact</span></Link>
                        </li>
                        {user && user.role === 'admin' && (
                            <li className={isActive('/admin') ? 'active' : ''}>
                                <Link to="/admin" onClick={handleNavClick}><FaUserShield /><span className="nav-text">Admin</span></Link>
                            </li>
                        )}
                        <li className="auth-item">
                            {user ? (
                                <a onClick={() => { onLogout(); setMobileMenuOpen(false); navigate('/'); }}>
                                    <FaSignOutAlt /><span className="nav-text">Déconnexion</span>
                                </a>
                            ) : (
                                <Link to="/login" onClick={handleNavClick}>
                                    <FaSignInAlt /><span className="nav-text">Connexion</span>
                                </Link>
                            )}
                        </li>
                    </ul>
                </AnimatePresence>

                <div className="nav-right">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Rechercher des modèles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </form>


                </div>
            </div>
        </motion.nav>
    );
}

export default Navigation;
