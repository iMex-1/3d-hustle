import { motion } from "framer-motion";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import "../styles/about.css";

// Moroccan geometric corner pattern SVG
const MoroccanCorner = ({ position = "top-left" }) => (
  <svg
    className={`moroccan-corner ${position}`}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#B8860B" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#goldGradient)" strokeWidth="1.5">
      <polygon points="100,10 190,100 100,190 10,100" />
      <polygon points="100,30 170,100 100,170 30,100" />
      <polygon points="100,50 150,100 100,150 50,100" />
      <circle cx="100" cy="100" r="20" />
      <line x1="100" y1="10" x2="100" y2="80" />
      <line x1="100" y1="120" x2="100" y2="190" />
      <line x1="10" y1="100" x2="80" y2="100" />
      <line x1="120" y1="100" x2="190" y2="100" />
    </g>
  </svg>
);

// Decorative star/flower icon
const GoldStar = () => (
  <svg className="gold-star" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <g fill="#D4AF37">
      <polygon points="20,2 23,15 36,15 25,23 29,36 20,28 11,36 15,23 4,15 17,15" />
    </g>
  </svg>
);

// Taj Mahal style building icon for mission section
const BuildingIcon = () => (
  <svg className="building-icon" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#D4AF37" strokeWidth="2">
      <path d="M60,10 Q60,5 60,10 L60,25" />
      <ellipse cx="60" cy="35" rx="25" ry="20" />
      <rect x="35" y="50" width="50" height="40" />
      <rect x="20" y="60" width="15" height="30" />
      <rect x="85" y="60" width="15" height="30" />
      <line x1="35" y1="90" x2="85" y2="90" />
      <rect x="50" y="65" width="20" height="25" rx="10" />
    </g>
  </svg>
);

function About() {
  return (
    <div className="about-page">
      {/* Moroccan corner decorations */}
      <MoroccanCorner position="top-left" />
      <MoroccanCorner position="top-right" />

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">À propos de MDBIM</h1>
        <p className="hero-subtitle">
          Moroccan Design BIM — Modèles BIM IFC
          <br />
          de qualité professionnelle
        </p>
        <GoldStar />
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-card">
          <div className="mission-text">
            <h2>Notre Mission</h2>
            <p>
              Nous nous engageons à fournir aux professionnels du BIM un accès
              privilégié à des modèles IFC de haute qualité, inspirés du riche
              patrimoine architectural marocain. Notre plateforme offre une
              collection soigneusement sélectionnée d'éléments authentiques qui
              donnent vie à vos projets BIM avec élégance et précision.
            </p>
          </div>
          <div className="mission-visual">
            <BuildingIcon />
          </div>
        </div>
      </section>

      {/* Key Values Section */}
      <section className="values-section">
        <h2 className="section-title">Key Values</h2>
        <div className="values-grid">
          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="value-icon">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF37" strokeWidth="2">
                <rect x="5" y="15" width="30" height="20" rx="2" />
                <polygon points="20,5 35,15 5,15" />
                <line x1="12" y1="22" x2="12" y2="35" />
                <line x1="20" y1="22" x2="20" y2="35" />
                <line x1="28" y1="22" x2="28" y2="35" />
              </svg>
            </div>
            <h3>Modèles BIM de Qualité</h3>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="value-icon">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF37" strokeWidth="2">
                <polygon points="20,5 35,15 35,30 20,35 5,30 5,15" />
                <line x1="20" y1="5" x2="20" y2="35" />
                <line x1="5" y1="15" x2="35" y2="30" />
                <line x1="35" y1="15" x2="5" y2="30" />
              </svg>
            </div>
            <h3>Format IFC Universel</h3>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="value-icon">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF37" strokeWidth="2">
                <rect x="8" y="8" width="24" height="28" rx="2" />
                <line x1="12" y1="14" x2="28" y2="14" />
                <line x1="12" y1="20" x2="28" y2="20" />
                <line x1="12" y1="26" x2="20" y2="26" />
                <circle cx="24" cy="30" r="6" />
                <polyline points="22,30 24,32 27,28" />
              </svg>
            </div>
            <h3>Facile à Utiliser</h3>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="value-icon">
              <svg viewBox="0 0 40 40" fill="none" stroke="#D4AF37" strokeWidth="2">
                <ellipse cx="20" cy="32" rx="15" ry="5" />
                <path d="M20,8 Q20,5 20,8 L20,15" />
                <ellipse cx="20" cy="20" rx="12" ry="10" />
                <rect x="15" y="25" width="10" height="7" />
              </svg>
            </div>
            <h3>Toujours en Croissance</h3>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offer-section">
        <h2 className="section-title">Ce que nous offrons</h2>
        <div className="offer-grid">
          <div className="offer-card">
            <h3>Zellige</h3>
            <p>Carreaux et revêtements traditionnels authentiques</p>
            <div className="offer-icon">
              <svg viewBox="0 0 30 30" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <polygon points="15,2 28,15 15,28 2,15" />
                <circle cx="15" cy="15" r="5" />
              </svg>
            </div>
          </div>

          <div className="offer-card">
            <h3>Boiserie</h3>
            <p>Éléments en bois et menuiserie artisanale</p>
            <div className="offer-icon">
              <svg viewBox="0 0 30 30" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <polygon points="15,2 28,15 15,28 2,15" />
                <circle cx="15" cy="15" r="5" />
              </svg>
            </div>
          </div>

          <div className="offer-card">
            <h3>Plâtre</h3>
            <p>Ornements et décorations sculptées traditionnelles</p>
            <div className="offer-icon">
              <svg viewBox="0 0 30 30" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <polygon points="15,2 28,15 15,28 2,15" />
                <circle cx="15" cy="15" r="5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Supported BIM Software Section */}
      <section className="software-section">
        <h2 className="section-title">Logiciels BIM supportés</h2>
        <div className="software-grid">
          <span className="software-badge">Revit</span>
          <span className="software-badge">Archicad</span>
          <span className="software-badge">Tekla</span>
          <span className="software-badge">Bentley</span>
          <span className="software-badge">Allplan</span>
          <span className="software-badge">Vectorworks</span>
          <span className="software-badge">IFC-compatible</span>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-card">
          <h2>Contactez-nous</h2>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+212123456789">+212 123 456 789</a>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:contact@mdbim.ma">contact@mdbim.ma</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
