import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserShield,
  FaSignInAlt,
  FaSignOutAlt,
  FaCube,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ScrambleText from "./ScrambleText";
import "../styles/navigation.css";

function Navigation({ user, userRecord, onLogout }) {
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || "home";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link
          to="/"
          onClick={handleNavClick}
          style={{ textDecoration: "none" }}
        >
          <div className="nav-brand">
            <img
              src="/logo/Logo.png"
              alt="MDBIM Logo"
              className="brand-logo"
              onError={(e) => {
                console.error("Navigation logo failed to load");
                e.target.style.display = "none";
              }}
            />
            <h2 className="brand-name font-display">MDBIM</h2>
          </div>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <li
            className={
              currentPage === "" || currentPage === "home" ? "active" : ""
            }
          >
            <Link to="/" onClick={handleNavClick}>
              <span>
                <FaHome />
              </span>
              <span className="nav-text">
                {isMobile && mobileMenuOpen ? (
                  <ScrambleText text="Accueil" isActive={mobileMenuOpen} delay={0} />
                ) : (
                  "Accueil"
                )}
              </span>
            </Link>
          </li>

          <li className={currentPage === "gallery" ? "active" : ""}>
            <Link to="/gallery" onClick={handleNavClick}>
              <span>
                <FaCube />
              </span>
              <span className="nav-text">
                {isMobile && mobileMenuOpen ? (
                  <ScrambleText text="Galerie" isActive={mobileMenuOpen} delay={200} />
                ) : (
                  "Galerie"
                )}
              </span>
            </Link>
          </li>

          <li className={currentPage === "about" ? "active" : ""}>
            <Link to="/about" onClick={handleNavClick}>
              <span>
                <FaInfoCircle />
              </span>
              <span className="nav-text">
                {isMobile && mobileMenuOpen ? (
                  <ScrambleText text="À propos" isActive={mobileMenuOpen} delay={400} />
                ) : (
                  "À propos"
                )}
              </span>
            </Link>
          </li>

          {user && userRecord && userRecord.isAdmin && (
            <li className={currentPage === "admin" ? "active" : ""}>
              <Link to="/admin" onClick={handleNavClick}>
                <span>
                  <FaUserShield />
                </span>
                <span className="nav-text">
                  {isMobile && mobileMenuOpen ? (
                    <ScrambleText text="Admin" isActive={mobileMenuOpen} delay={600} />
                  ) : (
                    "Admin"
                  )}
                </span>
              </Link>
            </li>
          )}

          <li className="auth-item">
            {user ? (
              <div className="user-profile-container">
                <div className="user-profile-info">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="user-profile-photo"
                    />
                  )}
                  <span className="user-display-name">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  className="sign-out-btn"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <FaSignOutAlt />
                  <span className="nav-text">
                    {isMobile && mobileMenuOpen ? (
                      <ScrambleText text="Déconnexion" isActive={mobileMenuOpen} delay={800} />
                    ) : (
                      "Déconnexion"
                    )}
                  </span>
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={handleNavClick}>
                <span>
                  <FaSignInAlt />
                </span>
                <span className="nav-text">
                  {isMobile && mobileMenuOpen ? (
                    <ScrambleText text="Connexion" isActive={mobileMenuOpen} delay={600} />
                  ) : (
                    "Connexion"
                  )}
                </span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
