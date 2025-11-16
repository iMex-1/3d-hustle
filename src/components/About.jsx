import { FaCube, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';
import '../styles/about.css';

function About() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>À Propos de la Marketplace 3D</h1>
                    <p>Votre destination privilégiée pour des modèles 3D de haute qualité</p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Notre Mission</h2>
                    <p>
                        Nous nous engageons à fournir aux designers, développeurs et créateurs un accès à
                        des modèles 3D premium dans plusieurs formats. Notre marketplace offre une collection
                        soigneusement sélectionnée de mobilier, d'éclairage et d'objets décoratifs qui donnent vie à vos projets.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaCube />
                        </div>
                        <h3>Modèles de Qualité</h3>
                        <p>Chaque modèle 3D est soigneusement sélectionné et optimisé pour un usage professionnel.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaRocket />
                        </div>
                        <h3>Formats Multiples</h3>
                        <p>Téléchargez au format GLB, GLTF, OBJ, FBX ou STL pour une compatibilité maximale.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaUsers />
                        </div>
                        <h3>Facile à Utiliser</h3>
                        <p>Parcourez, prévisualisez et téléchargez avec notre interface intuitive et notre visionneuse 3D.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaHeart />
                        </div>
                        <h3>Toujours en Croissance</h3>
                        <p>De nouveaux modèles ajoutés régulièrement pour garder vos projets créatifs frais.</p>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Ce Que Nous Offrons</h2>
                    <div className="offer-list">
                        <div className="offer-item">
                            <h4>Collection de Mobilier</h4>
                            <p>Chaises modernes, canapés, tables et solutions de rangement pour projets de design d'intérieur.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Modèles d'Éclairage</h4>
                            <p>Lampes, lustres et luminaires pour illuminer vos scènes 3D.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Objets Décoratifs</h4>
                            <p>Vases, sculptures et accessoires pour ajouter du caractère à vos designs.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Logiciels Supportés</h2>
                    <p>Nos modèles 3D fonctionnent parfaitement avec :</p>
                    <ul className="software-list">
                        <li>Blender</li>
                        <li>Autodesk Maya</li>
                        <li>3ds Max</li>
                        <li>Cinema 4D</li>
                        <li>Unity</li>
                        <li>Unreal Engine</li>
                        <li>SketchUp</li>
                        <li>Et bien d'autres...</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default About;
