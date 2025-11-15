import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../styles/notification.css';

function Notification({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-icon">
                {type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            </div>
            <div className="notification-message">{message}</div>
            <button className="notification-close" onClick={onClose}>
                <FaTimes />
            </button>
        </div>
    );
}

export default Notification;
