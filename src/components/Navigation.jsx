import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube, FaInfoCircle, FaEnvelope, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, onLogout, onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    <img src="/logo/LogoInversed.png" alt="OakMesh" className="brand-logo" />
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
                        {user && user.role === 'admin' && (
                            <li className={currentPage === 'admin' ? 'active' : ''}>
                                <a onClick={() => handleNavClick('admin')}><FaUserShield /><span className="nav-text">Admin</span></a>
                            </li>
                        )}
                        <li className="auth-item">
                            {user ? (
                                <a onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                                    <FaSignOutAlt /><span className="nav-text">Déconnexion</span>
                                </a>
                            ) : (
                                <a onClick={() => handleNavClick('login')}>
                                    <FaSignInAlt /><span className="nav-text">Connexion</span>
                                </a>
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
