import { useState, useEffect, useRef } from 'react';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube, FaInfoCircle, FaEnvelope, FaChevronDown, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, onLogout, onSearch }) {
    const [showCategories, setShowCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const categories = ['Mobilier', 'Éclairage', 'Décoration'];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCategories(false);
            }
        };

        if (showCategories) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCategories]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            onNavigate('gallery');
        }
    };

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    const handleCategoryClick = (category) => {
        setShowCategories(false);
        setMobileMenuOpen(false);
        onNavigate('gallery', { category });
    };

    const handleNavClick = (page, options) => {
        setMobileMenuOpen(false);
        onNavigate(page, options);
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand" onClick={() => handleNavClick('home')}>
                    <img src="/logo/Logo.png" alt="OakMesh" className="brand-logo" />
                    <h2 className="brand-name">OakMesh</h2>
                </div>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li className={currentPage === 'home' ? 'active' : ''}>
                        <a onClick={() => handleNavClick('home')}><FaHome /> Accueil</a>
                    </li>
                    <li className={currentPage === 'gallery' ? 'active' : ''}>
                        <a onClick={() => handleNavClick('gallery')}><FaImages /> Galerie</a>
                    </li>
                    <li className="nav-dropdown" ref={dropdownRef}>
                        <a className="dropdown-toggle" onClick={toggleCategories}>
                            <FaCube /> Catégories <FaChevronDown className={showCategories ? 'rotate' : ''} />
                        </a>
                        {showCategories && (
                            <ul className="dropdown-menu">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <a onClick={() => handleCategoryClick(cat)}>{cat}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <li className={currentPage === 'about' ? 'active' : ''}>
                        <a onClick={() => handleNavClick('about')}><FaInfoCircle /> À propos</a>
                    </li>
                    <li className={currentPage === 'contact' ? 'active' : ''}>
                        <a onClick={() => handleNavClick('contact')}><FaEnvelope /> Contact</a>
                    </li>
                    {user && user.role === 'admin' && (
                        <li className={currentPage === 'admin' ? 'active' : ''}>
                            <a onClick={() => handleNavClick('admin')}><FaUserShield /> Tableau de bord</a>
                        </li>
                    )}
                    <li className="mobile-auth-item">
                        {user ? (
                            <a onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                                <FaSignOutAlt /> Déconnexion
                            </a>
                        ) : (
                            <a onClick={() => handleNavClick('login')}>
                                <FaSignInAlt /> Connexion
                            </a>
                        )}
                    </li>
                </ul>

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
        </nav>
    );
}

export default Navigation;
