import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import '../styles/contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Contactez-Nous</h1>
                    <p>Des questions ? Nous serions ravis de vous entendre.</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="contact-info">
                    <h2>Informations de Contact</h2>
                    <p>Contactez-nous via l'un de ces canaux :</p>

                    <div className="info-cards">
                        <motion.div
                            className="info-card"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>
                            <h3>Email</h3>
                            <p>support@3dmarketplace.com</p>
                        </motion.div>

                        <motion.div
                            className="info-card"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="info-icon">
                                <FaPhone />
                            </div>
                            <h3>Téléphone</h3>
                            <p>+1 (555) 123-4567</p>
                        </motion.div>

                        <motion.div
                            className="info-card"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>Localisation</h3>
                            <p>123 Rue du Design<br />Ville Créative, CC 12345</p>
                        </motion.div>
                    </div>
                </div>

                <div className="contact-form-container">
                    <h2>Envoyez-Nous un Message</h2>
                    {submitted ? (
                        <motion.div
                            className="success-message"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FaPaperPlane />
                            <h3>Message Envoyé !</h3>
                            <p>Merci de nous avoir contactés. Nous vous répondrons bientôt.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit}
                            className="contact-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="form-group">
                                <label>Nom *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre.email@exemple.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sujet *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="De quoi s'agit-il ?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Votre message..."
                                    rows="6"
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="btn-submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPaperPlane /> Envoyer le Message
                            </motion.button>
                        </motion.form>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Contact;
