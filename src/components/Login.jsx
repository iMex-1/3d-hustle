import { useState } from 'react';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authenticateAdmin } from '../data/users';
import '../styles/auth.css';

function Login({ onLogin, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const admin = authenticateAdmin(username, password);

        if (admin) {
            onLogin(admin);
            onNavigate('admin');
        } else {
            setError('Invalid admin credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Admin Login</h2>
                <p className="auth-subtitle">Access the 3D Marketplace Dashboard</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FaUser /> Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaLock /> Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn-submit">Login to Dashboard</button>
                </form>

                <div className="demo-credentials">
                    <p><strong>Admin Credentials:</strong></p>
                    <p>Username: admin</p>
                    <p>Password: admin123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
