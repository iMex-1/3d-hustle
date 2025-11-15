import { useState, useEffect } from 'react';
import '../styles/navigation.css';

function Navigation({ currentPage, onNavigate, user, onLogout }) {
    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand" onClick={() => onNavigate('home')}>
                    <h2>3D Marketplace</h2>
                </div>

                <ul className="nav-links">
                    <li className={currentPage === 'home' ? 'active' : ''}>
                        <a onClick={() => onNavigate('home')}>Home</a>
                    </li>
                    <li className={currentPage === 'gallery' ? 'active' : ''}>
                        <a onClick={() => onNavigate('gallery')}>Gallery</a>
                    </li>
                    {user && user.role === 'admin' && (
                        <li className={currentPage === 'admin' ? 'active' : ''}>
                            <a onClick={() => onNavigate('admin')}>Admin</a>
                        </li>
                    )}
                </ul>

                <div className="nav-auth">
                    {user ? (
                        <div className="user-menu">
                            <span className="username">Welcome, {user.username}</span>
                            <button onClick={onLogout} className="btn-logout">Logout</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => onNavigate('login')} className="btn-login">Login</button>
                            <button onClick={() => onNavigate('register')} className="btn-register">Register</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
