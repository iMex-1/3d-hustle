import { FaHome, FaImages, FaUserShield, FaSignInAlt, FaSignOutAlt, FaCube } from 'react-icons/fa';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, onLogout }) {
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
                    {user && user.role === 'admin' && (
                        <li className={currentPage === 'admin' ? 'active' : ''}>
                            <a onClick={() => onNavigate('admin')}><FaUserShield /> Dashboard</a>
                        </li>
                    )}
                </ul>

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
        </nav>
    );
}

export default Navigation;
