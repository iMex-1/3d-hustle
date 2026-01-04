import { useNavigate } from 'react-router-dom';
import { X, LogIn } from 'lucide-react';
import '../styles/sign-in-modal.css';

function SignInModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSignIn = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="sign-in-modal-overlay" onClick={handleOverlayClick}>
            <div className="sign-in-modal-content">
                <button className="sign-in-modal-close" onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>
                
                <div className="sign-in-modal-icon">
                    <LogIn size={32} />
                </div>
                
                <h2 className="sign-in-modal-title">Connexion requise</h2>
                
                <p className="sign-in-modal-message">
                    Veuillez vous connecter pour télécharger ce modèle 3D.
                </p>
                
                <div className="sign-in-modal-actions">
                    <button className="sign-in-modal-btn-primary" onClick={handleSignIn}>
                        Se connecter
                    </button>
                    <button className="sign-in-modal-btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignInModal;
