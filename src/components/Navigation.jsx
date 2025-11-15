import { useState } from 'react';
import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube, FaInfoCircle, FaEnvelope, FaChevronDown, FaSearch } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, onLogout, onSearch }) {
    const [showCategories, setShowCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['Furniture', 'Lighting', 'Decoration'];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            onNavigate('gallery');
        }
    };

    const handleCategoryClick = (category) => {
        setShowCategories(false);
        onNavigate('gallery', { category });
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand" onClick={() => onNavigate('home')}>
                    <FaCube className="brand-icon" />
                    <h2>3D Marketplace</h2>
                </div>

                <ul className="nav-links">
                    <li className={currentPage === 'home' ? 'active' : ''}>
                        <a onClick={() => onNavigate('home')}><FaHome /> Home</a>
                    </li>
                    <li className={currentPage === 'gallery' ? 'active' : ''}>
                        <a onClick={() => onNavigate('gallery')}><FaImages /> Gallery</a>
                    </li>
                    <li
                        className="nav-dropdown"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                    >
                        <a className="dropdown-toggle">
                            <FaCube /> Categories <FaChevronDown />
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
                        <a onClick={() => onNavigate('about')}><FaInfoCircle /> About</a>
                    </li>
                    <li className={currentPage === 'contact' ? 'active' : ''}>
                        <a onClick={() => onNavigate('contact')}><FaEnvelope /> Contact</a>
                    </li>
                    {user && user.role === 'admin' && (
                        <li className={currentPage === 'admin' ? 'active' : ''}>
                            <a onClick={() => onNavigate('admin')}><FaUserShield /> Dashboard</a>
                        </li>
                    )}
                </ul>

                <div className="nav-right">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </form>

                    <div className="nav-auth">
                        {user ? (
                            <div className="user-menu">
                                <span className="username">Admin: {user.username}</span>
                                <button onClick={onLogout} className="btn-logout"><FaSignOutAlt /> Logout</button>
                            </div>
                        ) : (
                            <button onClick={() => onNavigate('login')} className="btn-login"><FaSignInAlt /> Admin Login</button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
