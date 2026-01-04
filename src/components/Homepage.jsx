import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight, Box } from "lucide-react";
import { useModels } from "../context/ModelsContext";
import XeokitViewer from "./XeokitViewer";
import "../styles/design-system.css";
import "../styles/homepage-clean.css";
import DecorativeDiamond, {
  DecorativeSectionDivider,
  CornerOrnament,
  FloatingDecorations,
} from "./DecorativeDiamond";

// Analytics tracking functions - replace with your actual analytics implementation
const trackSocialClick = (platform) => {
  try {
    // Replace with your analytics implementation (Google Analytics, Mixpanel, etc.)
    console.log(`Social click tracked: ${platform}`);
    // Example: gtag('event', 'social_click', { platform });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
  }
};

const trackFooterClick = (section, link) => {
  try {
    console.log(`Footer click tracked: ${section} - ${link}`);
    // Example: gtag('event', 'footer_click', { section, link });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
  }
};

function Homepage() {
  const navigate = useNavigate();
  const { models, loading } = useModels();
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayInterval = 6000;

  const slides = [
    {
      id: "welcome",
      badge: "Moroccan Design BIM",
      title: "Bienvenue sur MDBIM",
      description:
        "Découvrez notre plateforme de visualisation 3D pour modèles BIM. Explorez des fichiers IFC avec une technologie de pointe.",
      cta: "Explorer la Galerie",
      image: "/heroslides/Slide1.png",
      alt: "Interface de visualisation 3D MDBIM avec modèles BIM",
    },
    {
      id: "models",
      badge: "Moroccan Design BIM",
      title: "Bibliothèque BIM Complète",
      description:
        "Accédez à une vaste collection de modèles IFC organisés par catégorie. Zelige, Boiserie, Platre et autres éléments.",
      cta: "Voir les Modèles",
      image: "/heroslides/Slide2.png",
      alt: "Collection de modèles BIM organisés par catégorie",
    },
    {
      id: "viewer",
      badge: "Moroccan Design BIM",
      title: "Viewer 3D Intégré",
      description:
        "Visualisez vos modèles BIM directement dans le navigateur avec notre viewer 3D haute performance basé sur xeokit.",
      cta: "Tester le Viewer",
      image: "/heroslides/Slide3.png",
      alt: "Viewer 3D haute performance pour modèles BIM",
    },
  ];

  const categories = [
    {
      name: "Zelige",
      description: "Carreaux de mosaïque traditionnels marocains",
      features: [
        "Carreaux émaillés",
        "Motifs géométriques",
        "Couleurs personnalisées",
      ],
    },
    {
      name: "Boiserie",
      description: "Panneaux et ornements en bois sculpté",
      features: ["Bois de cèdre", "Sculptures à la main", "Détails complexes"],
    },
    {
      name: "Platre",
      description: "Décorations et moulures en plâtre",
      features: [
        "Détails sculptés",
        "Motifs traditionnels",
        "Designs personnalisés",
      ],
    },
  ];

  // Get featured models from R2 storage
  const featuredModels = models.filter((model) => model.featured).slice(0, 4);

  // If no featured models, get first 4 models
  const availableModels =
    featuredModels.length > 0 ? featuredModels : models.slice(0, 4);

  // Debug logging
  console.log("Total models loaded:", models.length);
  console.log("Featured models:", featuredModels.length);
  console.log("Available models for homepage:", availableModels.length);
  if (availableModels.length > 0) {
    console.log("First model XKT URL:", availableModels[0].xktFile);
  }

  // Map to products format
  const products =
    availableModels.length > 0
      ? availableModels.map((model) => ({
          id: model.id,
          title: model.name,
          category: model.category,
          description: model.description,
          image: model.xktFile, // This is the R2 storage URL
        }))
      : [
          {
            id: 1,
            title: "Modèle BIM Exemple",
            category: "Autre",
            description:
              "Modèle d'exemple en cours de chargement depuis le stockage cloud.",
            image: null,
          },
        ];

  const features = [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        {/* Floating Decorative Elements in Hero */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-20 left-10 opacity-20">
            <DecorativeDiamond size="sm" variant="outline" animated />
          </div>
          <div className="absolute top-32 right-20 opacity-15">
            <DecorativeDiamond size="xs" variant="gold" />
          </div>
          <div className="absolute bottom-40 left-16 opacity-25">
            <DecorativeDiamond size="md" variant="subtle" animated />
          </div>
          <div className="absolute top-1/3 right-10 opacity-10">
            <DecorativeDiamond size="lg" variant="gradient" />
          </div>
        </div>

        {/* Background Image with Overlay */}
        <div className="hero-background">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            className="hero-image"
            loading="eager"
            onError={(e) => {
              console.error("Hero image failed to load:", e.target.src);
              e.target.style.display = "none";
            }}
          />
          <div className="hero-overlay"></div>
        </div>

        {/* Moroccan Pattern Overlay */}
        <div className="hero-pattern moroccan-pattern"></div>

        {/* Corner Ornaments - Hidden on Mobile */}
        <div className="corner-ornaments">
          <div className="corner-ornament corner-tl"></div>
          <div className="corner-ornament corner-tr"></div>
          <div className="corner-ornament corner-bl"></div>
          <div className="corner-ornament corner-br"></div>
        </div>

        {/* Decorative Top Divider - Hidden on Mobile */}
        <div className="decorative-divider decorative-divider-top">
          <div className="divider-line"></div>
          <div className="divider-diamond"></div>
          <div className="divider-line"></div>
        </div>

        {/* Carousel Content */}
        <div className="carousel-content">
          <div key={currentSlide} className="slide-content animate-slide-up">
            <div className="slide-badge">
              <div className="badge-diamond"></div>
              <span className="text-xs tracking-widest font-body font-light">
                {slides[currentSlide].badge}
              </span>
              <div className="badge-diamond"></div>
            </div>

            <h1 className="slide-title font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-white mb-4 sm:mb-6">
              {slides[currentSlide].title}
            </h1>

            <p className="slide-description text-sm sm:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0">
              {slides[currentSlide].description}
            </p>

            <div className="slide-buttons flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-0">
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={() => navigate("/gallery")}
                aria-label={`${slides[currentSlide].cta} - Naviguer vers la galerie`}
              >
                {slides[currentSlide].cta}
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                className="btn btn-outline w-full sm:w-auto"
                onClick={() => navigate("/about")}
                aria-label="En savoir plus sur MDBIM"
              >
                En Savoir Plus
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="carousel-nav">
          <button
            className="nav-btn nav-prev"
            onClick={prevSlide}
            aria-label="Diapositive précédente"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="nav-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`nav-indicator ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="nav-btn nav-next"
            onClick={nextSlide}
            aria-label="Diapositive suivante"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Decorative Bottom Divider - Hidden on Mobile */}
        <div className="decorative-divider decorative-divider-bottom">
          <div className="divider-line"></div>
          <div className="divider-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`grid-square ${i === 4 ? "active" : ""}`}
              ></div>
            ))}
          </div>
          <div className="divider-line"></div>
        </div>
      </section>

      {/* Decorative Gap Filler - Hero to Categories */}
      <div className="gap-filler relative">
        <div className="gap-filler-content">
          <DecorativeSectionDivider />
        </div>
        <FloatingDecorations density="low" />

        {/* Artistic diamonds for first gap */}
        <div className="absolute top-4 left-1/4 opacity-15">
          <DecorativeDiamond size="md" variant="gold" animated />
        </div>
        <div className="absolute bottom-4 right-1/4 opacity-20">
          <DecorativeDiamond size="sm" variant="gradient" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-10 hidden lg:block">
          <DecorativeDiamond size="lg" variant="subtle" animated />
        </div>
        <div className="absolute top-1/2 right-8 opacity-10 hidden lg:block">
          <DecorativeDiamond size="lg" variant="subtle" animated />
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section py-24 bg-card moroccan-pattern">
        <div className="container">
          {/* Section Header */}
          <div className="section-header text-center mb-16 relative">
            {/* Decorative elements around section header */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-30">
              <DecorativeDiamond size="xs" variant="filled" />
            </div>
            <div className="absolute top-4 -left-8 opacity-20 hidden lg:block">
              <DecorativeDiamond size="sm" variant="outline" animated />
            </div>
            <div className="absolute top-4 -right-8 opacity-20 hidden lg:block">
              <DecorativeDiamond size="sm" variant="outline" animated />
            </div>

            <div className="decorative-label">
              <div className="label-line"></div>
              <DecorativeDiamond size="xs" variant="gold" />
              <span className="text-xs tracking-widest font-body font-medium text-muted-foreground">
                NOS CATÉGORIES
              </span>
              <DecorativeDiamond size="xs" variant="gold" />
              <div className="label-line"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Modèles BIM par Catégorie
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explorez notre bibliothèque complète de modèles BIM organisés par
              domaine d'expertise. Chaque catégorie contient des modèles IFC de
              haute qualité prêts à l'emploi.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                index={index}
              />
            ))}
          </div>

          {/* Decorative Footer */}
          <div className="decorative-footer mt-16 relative">
            {/* Additional artistic diamonds around the footer diamonds */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-20">
              <DecorativeDiamond size="sm" variant="gold" animated />
            </div>
            <div className="absolute -bottom-4 left-1/3 opacity-15">
              <DecorativeDiamond size="xs" variant="outline" />
            </div>
            <div className="absolute -bottom-4 right-1/3 opacity-15">
              <DecorativeDiamond size="xs" variant="outline" />
            </div>

            <div className="footer-diamonds">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`diamond ${i === 2 ? "active" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Gap Filler - Categories to Products */}
      <div className="gap-filler relative">
        <div className="gap-filler-content">
          <DecorativeSectionDivider />
        </div>
        <FloatingDecorations density="medium" />

        {/* Artistic diamonds for second gap */}
        <div className="absolute top-6 left-1/3 opacity-25">
          <DecorativeDiamond size="sm" variant="terracotta" animated />
        </div>
        <div className="absolute bottom-6 right-1/3 opacity-25">
          <DecorativeDiamond size="sm" variant="terracotta" animated />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15">
          <DecorativeDiamond size="xl" variant="outline" />
        </div>
        <div className="absolute top-2 right-12 opacity-20 hidden md:block">
          <DecorativeDiamond size="md" variant="gold" />
        </div>
        <div className="absolute bottom-2 left-12 opacity-20 hidden md:block">
          <DecorativeDiamond size="md" variant="gold" />
        </div>
      </div>

      {/* Products Section */}
      <section className="products-section py-24">
        <div className="container">
          <div className="section-header text-center mb-16 relative">
            {/* Decorative elements for products section */}
            <div className="absolute -top-6 left-1/4 opacity-25 hidden md:block">
              <DecorativeDiamond size="sm" variant="gradient" animated />
            </div>
            <div className="absolute -top-6 right-1/4 opacity-25 hidden md:block">
              <DecorativeDiamond size="sm" variant="gradient" animated />
            </div>

            <div className="decorative-label">
              <div className="label-line"></div>
              <DecorativeDiamond size="xs" variant="terracotta" />
              <span className="text-xs tracking-widest font-body font-medium text-muted-foreground">
                MODÈLES VEDETTES
              </span>
              <DecorativeDiamond size="xs" variant="terracotta" />
              <div className="label-line"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Collection Premium
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Découvrez notre sélection de modèles BIM premium avec des détails
              exceptionnels et des propriétés techniques complètes pour vos
              projets.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Decorative elements during loading */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <DecorativeDiamond size="3xl" variant="gradient" animated />
              </div>

              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="product-card animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-image bg-muted flex items-center justify-center relative">
                    <div className="loading-spinner"></div>
                    {/* Small decorative element in loading cards */}
                    <div className="absolute top-2 right-2 opacity-20">
                      <DecorativeDiamond size="xs" variant="outline" />
                    </div>
                  </div>
                  <div className="card-content p-5">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Decorative Gap Filler - Products to About */}
      <div className="gap-filler relative">
        <div className="gap-filler-content">
          <DecorativeSectionDivider />
        </div>
        <FloatingDecorations density="low" />

        {/* Artistic diamonds for third gap */}
        <div className="absolute top-8 left-1/5 opacity-20">
          <DecorativeDiamond size="lg" variant="gradient" animated />
        </div>
        <div className="absolute bottom-8 right-1/5 opacity-20">
          <DecorativeDiamond size="lg" variant="gradient" animated />
        </div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 opacity-10">
          <DecorativeDiamond size="2xl" variant="subtle" />
        </div>
        <div className="absolute bottom-1/3 left-16 opacity-15 hidden lg:block">
          <DecorativeDiamond size="md" variant="gold" animated />
        </div>
        <div className="absolute bottom-1/3 right-16 opacity-15 hidden lg:block">
          <DecorativeDiamond size="md" variant="gold" animated />
        </div>
      </div>

      {/* About Section */}
      <section className="about-section py-24 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="relative">
              {/* Decorative elements in about section */}
              <div className="absolute -top-4 -left-4 opacity-20">
                <DecorativeDiamond size="md" variant="subtle" />
              </div>
              <div className="absolute top-20 -right-6 opacity-15">
                <DecorativeDiamond size="sm" variant="gold" animated />
              </div>

              <div className="decorative-label mb-6">
                <DecorativeDiamond size="xs" variant="outline" />
                <span className="text-xs tracking-widest font-body font-medium text-muted-foreground">
                  À PROPOS
                </span>
                <DecorativeDiamond size="xs" variant="outline" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                L'Avenir de la Visualisation BIM
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>
                  MDBIM (Moroccan Design BIM) est une plateforme innovante
                  dédiée à la visualisation et au partage de modèles BIM. Nous
                  utilisons les dernières technologies WebGL pour offrir une
                  expérience 3D fluide directement dans votre navigateur.
                </p>
                <p>
                  Notre mission est de démocratiser l'accès aux modèles IFC et
                  de faciliter la collaboration entre tous les acteurs du
                  secteur de la construction et de l'architecture.
                </p>
              </div>

              {/* Contact Info */}
              <div className="contact-info space-y-4 pt-8 border-t border-border">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Contactez-nous
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    contact@mdbim.ma
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Support Technique
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    support@mdbim.ma
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Decorative elements around features */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-20">
                <DecorativeDiamond size="lg" variant="gradient" animated />
              </div>
              <div className="absolute bottom-4 -right-8 opacity-15">
                <DecorativeDiamond size="md" variant="gold" />
              </div>

              {features.length > 0 ? (
                features.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    index={index}
                  />
                ))
              ) : (
                // Placeholder when no features
                <div className="col-span-2 flex items-center justify-center p-12">
                  <div className="text-center">
                    <DecorativeDiamond size="xl" variant="subtle" animated />
                    <p className="text-muted-foreground mt-4">
                      Fonctionnalités à venir
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-horizontal border-t border-border py-12">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-brand relative">
            {/* Decorative elements in footer */}
            <div className="absolute -top-6 -left-2 opacity-15">
              <DecorativeDiamond size="sm" variant="outline" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo/Logo.png"
                alt="MDBIM Logo"
                className="footer-logo"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
                onError={(e) => {
                  console.error("Footer logo failed to load");
                  e.target.style.display = "none";
                }}
              />
              <span className="font-display font-semibold text-lg">MDBIM</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Plateforme de visualisation BIM innovante pour modèles IFC et
              fichiers 3D. Transformez vos données architecturales en
              expériences interactives.
            </p>
            <div
              className="flex gap-3"
              role="group"
              aria-label="Réseaux sociaux"
            >
              <a
                href="https://twitter.com/mdbim_ma"
                className="social-btn"
                aria-label="Suivez-nous sur Twitter"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick("twitter")}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/mdbim"
                className="social-btn"
                aria-label="Consultez notre code sur GitHub"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick("github")}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/mdbim"
                className="social-btn"
                aria-label="Connectez-vous sur LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick("linkedin")}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="font-semibold mb-4 text-foreground">Produit</h4>
              <ul
                className="space-y-2 text-sm text-muted-foreground"
                role="list"
              >
                <li>
                  <button
                    onClick={() => {
                      trackFooterClick("Produit", "Fonctionnalités");
                      navigate("/features");
                    }}
                    className="hover:text-foreground transition-colors text-left w-full"
                    aria-label="Découvrir les fonctionnalités"
                  >
                    Fonctionnalités
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      trackFooterClick("Produit", "Tarifs");
                      navigate("/pricing");
                    }}
                    className="hover:text-foreground transition-colors text-left w-full"
                    aria-label="Consulter les tarifs"
                  >
                    Tarifs
                  </button>
                </li>
                <li>
                  <a
                    href="/docs"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Produit", "Documentation")}
                    aria-label="Accéder à la documentation"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/api"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Produit", "API")}
                    aria-label="Consulter l'API"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="font-semibold mb-4 text-foreground">Entreprise</h4>
              <ul
                className="space-y-2 text-sm text-muted-foreground"
                role="list"
              >
                <li>
                  <button
                    onClick={() => {
                      trackFooterClick("Entreprise", "À propos");
                      navigate("/about");
                    }}
                    className="hover:text-foreground transition-colors text-left w-full"
                    aria-label="En savoir plus sur l'entreprise"
                  >
                    À propos
                  </button>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Entreprise", "Carrières")}
                    aria-label="Voir les opportunités de carrière"
                  >
                    Carrières
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Entreprise", "Blog")}
                    aria-label="Lire notre blog"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Entreprise", "Presse")}
                    aria-label="Ressources presse"
                  >
                    Presse
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="font-semibold mb-4 text-foreground">Ressources</h4>
              <ul
                className="space-y-2 text-sm text-muted-foreground"
                role="list"
              >
                <li>
                  <button
                    onClick={() => {
                      trackFooterClick("Ressources", "Tutoriels");
                      navigate("/tutorials");
                    }}
                    className="hover:text-foreground transition-colors text-left w-full"
                    aria-label="Accéder aux tutoriels"
                  >
                    Tutoriels
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      trackFooterClick("Ressources", "Exemples");
                      navigate("/gallery");
                    }}
                    className="hover:text-foreground transition-colors text-left w-full"
                    aria-label="Voir les exemples"
                  >
                    Exemples
                  </button>
                </li>
                <li>
                  <a
                    href="/community"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Ressources", "Communauté")}
                    aria-label="Rejoindre la communauté"
                  >
                    Communauté
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Ressources", "Support")}
                    aria-label="Obtenir de l'aide"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="font-semibold mb-4 text-foreground">Légal</h4>
              <ul
                className="space-y-2 text-sm text-muted-foreground"
                role="list"
              >
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Légal", "Confidentialité")}
                    aria-label="Politique de confidentialité"
                  >
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Légal", "Conditions")}
                    aria-label="Conditions d'utilisation"
                  >
                    Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="hover:text-foreground transition-colors"
                    onClick={() => trackFooterClick("Légal", "Cookies")}
                    aria-label="Politique des cookies"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom border-t border-border mt-8 pt-8 relative">
          {/* Decorative elements in footer bottom */}
          <div className="absolute top-2 left-1/4 opacity-15 hidden md:block">
            <DecorativeDiamond size="sm" variant="outline" />
          </div>
          <div className="absolute top-2 right-1/4 opacity-15 hidden md:block">
            <DecorativeDiamond size="sm" variant="outline" />
          </div>

          <div className="footer-container">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <p>
                  &copy; {new Date().getFullYear()} MDBIM. Tous droits réservés.
                </p>
                <span className="hidden sm:inline text-border">|</span>
                <p className="flex items-center gap-1">
                  Propulsé par
                  <a
                    href="https://xeokit.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors font-medium"
                    onClick={() => trackFooterClick("Bottom", "Xeokit")}
                  >
                    xeokit
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>Version 1.0.0</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>
                  Statut:
                  <span className="inline-flex items-center gap-1 ml-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Opérationnel
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MDBIM - Moroccan Design BIM",
            description:
              "Plateforme de visualisation BIM innovante pour modèles IFC et fichiers 3D",
            url: "https://mdbim.ma",
            logo: "https://mdbim.ma/logo/Logo.png",
            sameAs: [
              "https://twitter.com/mdbim_ma",
              "https://github.com/mdbim",
              "https://linkedin.com/company/mdbim",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              url: "https://mdbim.ma/support",
            },
          })}
        </script>
      </footer>
    </div>
  );
}

// Category Card Component
function CategoryCard({ category, index }) {
  const handleClick = () => {
    // Navigate to category page or show more details
    console.log(`Clicked on ${category.name}`);
  };

  return (
    <div
      className="category-card animate-slide-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleClick}
    >
      {/* Corner Decorations */}
      <CornerOrnament position="top-left" size="sm" />
      <CornerOrnament position="top-right" size="sm" />
      <CornerOrnament position="bottom-left" size="sm" />
      <CornerOrnament position="bottom-right" size="sm" />

      {/* Lantern Icon - Idle by default, Moving on hover */}
      <div className="lantern-container">
        <img 
          src="/cards lantern/idle lantern.png" 
          alt="Lantern" 
          className="lantern-idle"
        />
        <img 
          src="/cards lantern/moving lantern.png" 
          alt="Lantern animé" 
          className="lantern-moving"
        />
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-header relative">
          {/* Small decorative diamond next to title */}
          <div className="absolute -left-6 top-1 opacity-30">
            <DecorativeDiamond size="xs" variant="gold" />
          </div>

          <h3 className="text-2xl font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            {category.name}
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {category.description}
          </p>
        </div>

        {/* Features */}
        <div className="features flex flex-wrap gap-2 mb-4">
          {category.features.map((feature, i) => (
            <span
              key={i}
              className="feature-tag text-xs border border-border px-2 py-1 text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="bottom-line"></div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to product details in gallery
    navigate(`/gallery/product/${product.id}`);
  };

  return (
    <div
      className="product-card animate-slide-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleClick}
    >
      {/* Corner Decoration */}
      <CornerOrnament position="top-right" size="xs" />

      <div className="card-image">
        {product.image ? (
          (() => {
            const fileExtension = product.image.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
            
            return isImage ? (
              <img 
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <XeokitViewer
                modelUrl={product.image}
                height="100%"
                width="100%"
                enableZoom={false}
              />
            );
          })()
        ) : (
          <div className="image-placeholder bg-muted flex items-center justify-center text-muted-foreground flex-col">
            <Box className="w-8 h-8" />
            <span className="text-xs mt-2">Chargement...</span>
          </div>
        )}
        {/* Fallback error display for images */}
        <div 
          className="image-placeholder bg-muted flex items-center justify-center text-muted-foreground flex-col"
          style={{ display: "none" }}
        >
          <Box className="w-8 h-8" />
          <span className="text-xs mt-2">Erreur de chargement</span>
        </div>
        <div className="category-badge bg-background border border-border text-xs px-2 py-1">
          {product.category}
        </div>
      </div>

      <div className="card-content p-5">
        <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-foreground transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description ||
            "Modèle BIM de haute qualité disponible au téléchargement."}
        </p>
        <button className="btn-ghost w-full flex items-center justify-between group-hover:text-foreground transition-colors">
          <span>Voir Détails</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <div
      className="feature-card p-4 border border-border bg-background hover:border-foreground/20 transition-colors animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Icon className="w-5 h-5 mb-3" />
      <h4 className="text-sm font-display font-semibold text-foreground mb-1">
        {feature.title}
      </h4>
      <p className="text-xs text-muted-foreground">{feature.description}</p>
    </div>
  );
}

export default Homepage;
