import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authenticateAdmin } from '../data/users';
import '../styles/auth.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const admin = authenticateAdmin(username, password);

        if (admin) {
            onLogin(admin);
            navigate('/admin');
        } else {
            setError('Identifiants administrateur invalides');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion Administrateur</h2>
                <p className="auth-subtitle">Accédez au Tableau de Bord de la Marketplace 3D</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FaUser /> Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez le nom d'utilisateur admin"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaLock /> Mot de passe</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Entrez le mot de passe admin"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn-submit">Se Connecter au Tableau de Bord</button>
                </form>

                <div className="demo-credentials">
                    <p><strong>Identifiants Admin :</strong></p>
                    <p>Nom d'utilisateur : admin</p>
                    <p>Mot de passe : admin123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
