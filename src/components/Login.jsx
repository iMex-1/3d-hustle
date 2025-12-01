import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { signInWithGoogle } from '../services/authService';
import { syncUserData } from '../services/databaseService';
import '../styles/auth.css';

function Login({ onLogin, onNavigate }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            // Sign in with Google
            const result = await signInWithGoogle();
            const user = result.user;

            // Sync user data to database
            try {
                await syncUserData(user);
            } catch (syncError) {
                console.error('Failed to sync user data:', syncError);
                // Continue even if sync fails - user is still authenticated
            }

            // Call onLogin with user data
            onLogin({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            });

            // Navigate to home page (admin link will appear in nav if user has admin permissions)
            onNavigate('home');
        } catch (error) {
            console.error('Sign-in error:', error);
            setError(error.message || 'Échec de la connexion avec Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                <p className="auth-subtitle">Accédez au Tableau de Bord de la Marketplace 3D</p>

                {error && <p className="error-message">{error}</p>}

                <button 
                    onClick={handleGoogleSignIn} 
                    className="btn-submit"
                    disabled={loading}
                >
                    <FaGoogle style={{ marginRight: '0.5rem' }} />
                    {loading ? 'Connexion en cours...' : 'Se connecter avec Google'}
                </button>

                <div className="demo-credentials">
                    <p><strong>Note :</strong></p>
                    <p>Utilisez votre compte Google pour vous connecter.</p>
                    <p>Les permissions administrateur sont gérées dans la base de données.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
