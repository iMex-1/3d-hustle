import { useState } from 'react';
import { authenticateUser } from '../data/users';
import '../styles/auth.css';

function Login({ onLogin, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = authenticateUser(username, password);

        if (user) {
            onLogin(user);
            onNavigate('home');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn-submit">Login</button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <a onClick={() => onNavigate('register')}>Register here</a>
                </p>

                <div className="demo-credentials">
                    <p><strong>Demo Credentials:</strong></p>
                    <p>Admin: admin / admin123</p>
                    <p>User: user / user123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
