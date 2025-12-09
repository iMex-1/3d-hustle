import { motion } from 'framer-motion';
import { FaCube, FaUsers, FaRocket, FaHeart, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/about.css';

function About() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>À Propos d'OakMesh</h1>
                    <p>Votre plateforme de modèles BIM au format IFC</p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Notre Mission</h2>
                    <p>
                        Nous nous engageons à fournir aux professionnels du BIM un accès à
                        des modèles IFC de haute qualité. Notre plateforme offre une collection
                        soigneusement sélectionnée d'éléments architecturaux qui donnent vie à vos projets BIM.
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
                        <h3>Modèles BIM de Qualité</h3>
                        <p>Chaque modèle IFC est soigneusement sélectionné et optimisé pour un usage professionnel.</p>
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
                        <p>Téléchargez au format IFC pour une compatibilité maximale avec tous les logiciels BIM.</p>
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
                        <p>De nouveaux modèles ajoutés régulièrement pour garder vos projets BIM à jour.</p>
                    </motion.div>
                </div>

                <div className="about-section">
                    <h2>Ce Que Nous Offrons</h2>
                    <div className="offer-list">
                        <div className="offer-item">
                            <h4>Zelige</h4>
                            <p>Carreaux et revêtements traditionnels pour vos projets architecturaux.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Boiserie</h4>
                            <p>Éléments en bois et menuiserie pour enrichir vos modèles BIM.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Plâtre</h4>
                            <p>Ornements et décorations en plâtre pour ajouter du caractère à vos designs.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Logiciels BIM Supportés</h2>
                    <p>Nos modèles IFC fonctionnent parfaitement avec :</p>
                    <ul className="software-list">
                        <li>Autodesk Revit</li>
                        <li>ArchiCAD</li>
                        <li>Tekla Structures</li>
                        <li>Bentley AECOsim</li>
                        <li>Allplan</li>
                        <li>Vectorworks</li>
                        <li>Et tous les logiciels compatibles IFC...</li>
                    </ul>
                </div>

                <div className="about-section contact-section">
                    <h2>Contactez-Nous</h2>
                    <p>Des questions ? N'hésitez pas à nous contacter :</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <div>
                                <h4>Email</h4>
                                <a href="mailto:contact@oakmesh.com">contact@oakmesh.com</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <div>
                                <h4>Téléphone</h4>
                                <a href="tel:+212123456789">+212 123 456 789</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
