import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ArrowUpRight, Box } from "lucide-react";
import { useModels } from "../context/ModelsContext";
import { useAuth } from "../hooks/useAuth";
import * as databaseService from "../services/databaseService";
import XeokitViewer from "./XeokitViewer";
import SignInModal from "./SignInModal";
import "../styles/gallery.css";

function Gallery() {
  const { models: objects, loading } = useModels();
  const { user } = useAuth();
  const { category: urlCategory, productId } = useParams();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [selectedObject, setSelectedObject] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const categories = ["Tout", "Zelige", "Boiserie", "Platre", "Autre"];

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    if (productId && objects.length > 0) {
      const obj = objects.find((o) => o.id === productId);
      if (obj) {
        setSelectedObject(obj);
      }
    }
  }, [productId, objects]);

  const handleBackToGallery = () => {
    setSelectedObject(null);
    window.history.replaceState({}, "", "/gallery");
  };

  const filteredObjects = objects.filter((obj) => {
    const matchesSearch =
      obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tout" || obj.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (obj) => {
    // Check if user is authenticated before allowing download
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    const downloadUrl = obj.downloadFile || obj.ifcFile;
    if (downloadUrl) {
      try {
        await databaseService.incrementDownloadCount(obj.id);
        window.open(downloadUrl, "_blank");
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  // Show loading when we have a productId but haven't loaded the object yet
  if (productId && !selectedObject && loading) {
    return (
      <div className="gallery">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (selectedObject) {
    return (
      <div className="gallery">
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
        <div className="product-detail">
          <button className="back-button" onClick={handleBackToGallery}>
            ← Retour à la galerie
          </button>

          <div className="detail-container">
            <div className="detail-viewer">
              {selectedObject.xktFile ? (
                (() => {
                  const fileExtension = selectedObject.xktFile
                    .split(".")
                    .pop()
                    .toLowerCase();
                  const isImage = [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                  ].includes(fileExtension);

                  return isImage ? (
                    <img
                      src={selectedObject.xktFile}
                      alt={selectedObject.name}
                      style={{
                        width: "100%",
                        height: "600px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        background: "hsl(30, 10%, 20%)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <XeokitViewer
                      modelUrl={selectedObject.xktFile}
                      height="600px"
                      width="100%"
                      enableZoom={true}
                    />
                  );
                })()
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "600px",
                    background: "hsl(30, 10%, 20%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <p style={{ color: "hsl(30, 15%, 60%)" }}>
                    Pas de prévisualisation disponible
                  </p>
                </div>
              )}
              {/* Fallback error display for images */}
              <div
                style={{
                  width: "100%",
                  height: "600px",
                  background: "hsl(30, 10%, 20%)",
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                }}
              >
                <p style={{ color: "hsl(30, 15%, 60%)" }}>
                  Erreur de chargement de l'image
                </p>
              </div>
            </div>

            <div className="detail-info">
              <h1>{selectedObject.name}</h1>
              <span className="badge">{selectedObject.category}</span>

              <div className="detail-description">
                <h3>Description</h3>
                <p>{selectedObject.description}</p>
              </div>

              <div className="detail-meta">
                <div className="meta-row">
                  <span className="meta-label">Taille du fichier:</span>
                  <span className="meta-value">{selectedObject.fileSize}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Téléchargements:</span>
                  <span className="meta-value">{selectedObject.downloads}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Catégorie:</span>
                  <span className="meta-value">{selectedObject.category}</span>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  className="btn-download"
                  onClick={() => handleDownload(selectedObject)}
                  disabled={
                    !selectedObject.downloadFile && !selectedObject.ifcFile
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Télécharger le modèle{" "}
                  {(selectedObject.downloadType || "IFC").toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
      <div className="gallery-header">
        <h1>Moroccan Design BIM</h1>
        <p>Parcourez notre collection de {objects.length} modèles BIM</p>
      </div>

      <div className="gallery-controls">
        <input
          type="text"
          placeholder="Rechercher des modèles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {filteredObjects.map((obj, index) => (
          <div
            key={obj.id}
            className="gallery-card group"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedObject(obj)}
          >
            <div className="card-image">
              {obj.xktFile ? (
                (() => {
                  const fileExtension = obj.xktFile
                    .split(".")
                    .pop()
                    .toLowerCase();
                  const isImage = [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                  ].includes(fileExtension);

                  return isImage ? (
                    <img
                      src={obj.xktFile}
                      alt={obj.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <XeokitViewer
                      modelUrl={obj.xktFile}
                      height="100%"
                      width="100%"
                      enableZoom={false}
                    />
                  );
                })()
              ) : (
                <div className="image-placeholder">
                  <Box className="placeholder-icon" />
                  <span>Chargement...</span>
                </div>
              )}
              {/* Fallback error display for images */}
              <div className="image-placeholder" style={{ display: "none" }}>
                <Box className="placeholder-icon" />
                <span>Erreur de chargement</span>
              </div>
              <span className="category-badge">{obj.category}</span>
            </div>

            <div className="card-content">
              <h3 className="card-title">{obj.name}</h3>
              <p className="card-description">
                {obj.description ||
                  "Modèle BIM de haute qualité disponible au téléchargement."}
              </p>
              <button className="btn-explore">
                <span>Voir Détails</span>
                <ArrowUpRight className="btn-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredObjects.length === 0 && (
        <div className="no-results">
          <p>Aucun modèle trouvé correspondant à vos critères</p>
        </div>
      )}
    </div>
  );
}

export default Gallery;
