import { FaCube, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';
import '../styles/about.css';

function About() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About 3D Marketplace</h1>
                    <p>Your premier destination for high-quality 3D models</p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        We're dedicated to providing designers, developers, and creators with access to
                        premium 3D models in multiple formats. Our marketplace offers a curated collection
                        of furniture, lighting, and decorative objects that bring your projects to life.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaCube />
                        </div>
                        <h3>Quality Models</h3>
                        <p>Every 3D model is carefully selected and optimized for professional use.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaRocket />
                        </div>
                        <h3>Multiple Formats</h3>
                        <p>Download in GLB, GLTF, OBJ, FBX, or STL format for maximum compatibility.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaUsers />
                        </div>
                        <h3>Easy to Use</h3>
                        <p>Browse, preview, and download with our intuitive interface and 3D viewer.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FaHeart />
                        </div>
                        <h3>Always Growing</h3>
                        <p>New models added regularly to keep your creative projects fresh.</p>
                    </div>
                </div>

                <div className="about-section">
                    <h2>What We Offer</h2>
                    <div className="offer-list">
                        <div className="offer-item">
                            <h4>Furniture Collection</h4>
                            <p>Modern chairs, sofas, tables, and storage solutions for interior design projects.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Lighting Models</h4>
                            <p>Lamps, chandeliers, and light fixtures to illuminate your 3D scenes.</p>
                        </div>
                        <div className="offer-item">
                            <h4>Decorative Objects</h4>
                            <p>Vases, sculptures, and accessories to add character to your designs.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Supported Software</h2>
                    <p>Our 3D models work seamlessly with:</p>
                    <ul className="software-list">
                        <li>Blender</li>
                        <li>Autodesk Maya</li>
                        <li>3ds Max</li>
                        <li>Cinema 4D</li>
                        <li>Unity</li>
                        <li>Unreal Engine</li>
                        <li>SketchUp</li>
                        <li>And many more...</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default About;
