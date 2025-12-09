import { motion } from 'framer-motion';
import { FaCube, FaUsers, FaRocket, FaHeart, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/about.css';

function About() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>À Propos de OakMesh</h1>
                    <p>Votre destination privilégiée pour des modèles BIM de haute qualité</p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Notre Mission</h2>
                    <p>
                        Nous nous engageons à fournir aux architectes, ingénieurs et professionnels du BIM un accès à
                        des modèles IFC de haute qualité. Notre plateforme offre une collection
                        soigneusement sélectionnée de modèles BIM qui donnent vie à vos projets de construction.
                    </p>
                </div>

                <div className="features-grid">
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="feature-icon">
                            <FaCube />
                        </div>
                        <h3>Modèles de Qualité</h3>
                        <p>Chaque modèle BIM est soigneusement sélectionné et optimisé pour un usage professionnel.</p>
                    </motion.div>

                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="feature-icon">
                            <FaRocket />
                        </div>
                        <h3>Format IFC</h3>
                        <p>Tous nos modèles sont disponibles au format IFC pour une compatibilité maximale avec les logiciels BIM.</p>
                    </motion.div>

                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="feature-icon">
                            <FaUsers />
                        </div>
                        <h3>Facile à Utiliser</h3>
                        <p>Parcourez, prévisualisez et téléchargez avec notre interface intuitive et notre visionneuse 3D.</p>
                    </motion.div>

                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="feature-icon">
                            <FaHeart />
                        </div>
                        <h3>Toujours en Croissance</h3>
                        <p>De nouveaux modèles ajoutés régulièrement pour garder vos projets créatifs frais.</p>
                    </motion.div>
                </div>

                <div className="about-section">
                    <h2>Ce Que Nous Offrons</h2>
                    <div className="offer-list">
                        <div className="offer-item">
                            <h4>Zelige</h4>
                            <p>Modèles de carreaux traditionnels marocains pour vos projets de décoration.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Boiserie</h4>
                            <p>Éléments en bois pour enrichir vos conceptions architecturales.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Platre</h4>
                            <p>Modèles de plâtre décoratif pour vos projets d'intérieur.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Logiciels Supportés</h2>
                    <p>Nos modèles IFC fonctionnent parfaitement avec :</p>
                    <ul className="software-list">
                        <li>Revit</li>
                        <li>ArchiCAD</li>
                        <li>Tekla Structures</li>
                        <li>Allplan</li>
                        <li>Vectorworks</li>
                        <li>BIM 360</li>
                        <li>Navisworks</li>
                        <li>Et bien d'autres...</li>
                    </ul>
                </div>

                <div className="about-section contact-section">
                    <h2>Contactez-Nous</h2>
                    <p>Des questions ? N'hésitez pas à nous contacter :</p>
                    <div className="contact-info-simple">
                        <motion.div
                            className="contact-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="contact-icon">
                                <FaEnvelope />
                            </div>
                            <div className="contact-details">
                                <h4>Email</h4>
                                <a href="mailto:contact@oakmesh.com">contact@oakmesh.com</a>
                            </div>
                        </motion.div>

                        <motion.div
                            className="contact-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="contact-icon">
                                <FaPhone />
                            </div>
                            <div className="contact-details">
                                <h4>Téléphone</h4>
                                <a href="tel:+212123456789">+212 123 456 789</a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
