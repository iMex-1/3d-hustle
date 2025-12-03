import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as databaseService from '../services/databaseService';
import { getPublicFileUrl } from '../utils/storageHelpers';
import XeokitViewer from './XeokitViewer';
import { FaThLarge, FaTree, FaPaintRoller, FaCube, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/homepage.css';

function Homepage({ user }) {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchDeltaX, setTouchDeltaX] = useState(0);
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const autoPlayInterval = 5000;

    useEffect(() => {
        // Load models from Firebase in real-time
        const unsubscribe = databaseService.listenToModels((models) => {
            // Transform Firebase models to match expected format
            const transformedModels = models.map(model => ({
                id: model.model_id,
                name: model.model_name,
                category: model.model_category,
                description: model.model_description,
                xktFile: getPublicFileUrl(model.model_xkt_url),
                ifcFile: getPublicFileUrl(model.model_ifc_url),
                fileSize: model.model_xkt_size ? `${(model.model_xkt_size / (1024 * 1024)).toFixed(1)} Mo` : 'N/A',
                downloads: model.downloads || 0,
                featured: model.featured || false
            }));

            setObjects(transformedModels);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Limit featured objects to reduce initial load
    const featuredObjects = objects.filter(obj => obj.featured).slice(0, 6);

    const slides = [
        {
            id: 'welcome',
            type: 'welcome',
            image: '/heroslides/Slide1.png',
            title: 'Bienvenue sur OakMesh',
            subtitle: 'Plateforme de Modèles BIM',
            description: 'Explorez des modèles IFC/XKT de haute qualité pour vos projets.',
            buttons: [
                { text: 'Parcourir la Galerie', action: () => navigate('/gallery'), primary: true },
                { text: 'Voir les Vedettes', action: () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }
            ]
        },
        {
            id: 'models',
            type: 'models',
            image: '/heroslides/Slide2.png',
            title: 'Explorez les Modèles BIM',
            subtitle: 'Ressources de Haute Qualité',
            description: 'Découvrez des modèles organisés par catégorie. Architecture, MEP, Structure et Infrastructure.',
            buttons: [
                { text: 'Voir Tous les Modèles', action: () => navigate('/gallery'), primary: true }
            ]
        },
        {
            id: 'formats',
            type: 'formats',
            image: '/heroslides/Slide3.png',
            title: 'Formats IFC & XKT',
            subtitle: 'Visualisation • Téléchargement',
            description: 'Visualisez en XKT et téléchargez en IFC. Compatible avec tous les logiciels BIM.',
            buttons: [
                { text: 'En Savoir Plus', action: () => navigate('/gallery'), primary: true }
            ]
        }
    ];

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, autoPlayInterval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAutoPlaying, slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    const onTouchStart = (e) => {
        if (!e.touches || e.touches.length === 0) return;
        setIsDragging(true);
        setIsAutoPlaying(false);
        setTouchStartX(e.touches[0].clientX);
        setTouchDeltaX(0);
    };

    const onTouchMove = (e) => {
        if (!isDragging || !e.touches || e.touches.length === 0) return;
        const currentX = e.touches[0].clientX;
        setTouchDeltaX(currentX - touchStartX);
    };

    const onTouchEnd = () => {
        if (!isDragging) return;
        const threshold = 50;
        if (Math.abs(touchDeltaX) > threshold) {
            if (touchDeltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        setIsDragging(false);
        setTouchDeltaX(0);
        setIsAutoPlaying(true);
    };

    return (
        <div className="homepage">
            <div
                className="hero-carousel"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="carousel-container"
                    ref={containerRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onTouchCancel={onTouchEnd}
                >
                    <div
                        className="carousel-slides"
                        style={{
                            transform: (() => {
                                const base = -currentSlide * 33.333;
                                if (isDragging && containerRef.current) {
                                    const width = containerRef.current.clientWidth || 1;
                                    const dragPercent = (touchDeltaX / width) * 33.333;
                                    return `translateX(${base + dragPercent}%)`;
                                }
                                return `translateX(${base}%)`;
                            })(),
                            transition: isDragging ? 'none' : undefined,
                        }}
                    >
                        {slides.map((slide) => (
                            <div key={slide.id} className={`carousel-slide slide-${slide.type}`}>
                                <div
                                    className="slide-background"
                                    style={{
                                        backgroundImage: `url(${slide.image})`,
                                    }}
                                />
                                <div className="slide-overlay" />
                                <div className="slide-content">
                                    <div className="slide-text-content">
                                        <div className="slide-badge">{slide.subtitle}</div>
                                        <h1 className="slide-title">{slide.title}</h1>
                                        <p className="slide-description">{slide.description}</p>
                                        <div className="slide-buttons">
                                            {slide.buttons.map((button, btnIndex) => (
                                                <motion.button
                                                    key={btnIndex}
                                                    onClick={button.action}
                                                    className={`slide-btn ${button.primary ? 'slide-btn-primary' : 'slide-btn-secondary'}`}
                                                    whileHover={{ x: 4 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {button.text}
                                                    <span className="btn-arrow">→</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`carousel-arrow carousel-arrow-left ${currentSlide === 0 ? 'hidden' : ''}`}
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        ‹
                    </button>

                    <button
                        className="carousel-arrow carousel-arrow-right"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        ›
                    </button>

                    <div className="carousel-nav">
                        {slides.map((_, index) => (
                            <motion.button
                                key={index}
                                className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <section className="categories-section">
                <div className="section-header">
                    <h2 className="section-title">Parcourir par Catégorie</h2>
                    <p className="section-description">
                        Explorez nos modèles organisés par type de construction
                    </p>
                </div>
                <motion.div
                    className="categories-grid-simple"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <SimpleCategoryCard
                        category="Zelige"
                        icon={FaThLarge}
                        description="Carreaux et revêtements"
                    />
                    <SimpleCategoryCard
                        category="Boiserie"
                        icon={FaTree}
                        description="Bois et menuiserie"
                    />
                    <SimpleCategoryCard
                        category="Platre"
                        icon={FaPaintRoller}
                        description="Ornements en plâtre"
                    />
                    <SimpleCategoryCard
                        category="Autre"
                        icon={FaCube}
                        description="Autres éléments"
                    />
                </motion.div>
            </section>

            <section className="featured-section" id="featured">
                <div className="section-header">
                    <h2 className="section-title">Modèles BIM en Vedette</h2>
                    <p className="section-description">
                        Modèles premium sélectionnés pour votre prochain projet
                    </p>
                </div>
                <div className="featured-grid">
                    {featuredObjects.map((obj, index) => (
                        <div
                            key={obj.id}
                            className="featured-card"
                            onClick={() => navigate(`/gallery/product/${obj.id}`)}
                        >
                            <div className="card-image">
                                {obj.xktFile ? (
                                    <XeokitViewer xktUrl={obj.xktFile} height="100%" width="100%" />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ color: '#666' }}>Pas de prévisualisation</p>
                                    </div>
                                )}
                                <div className="card-overlay-hover">
                                    <motion.button
                                        className="btn-view-details"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Voir les Détails
                                    </motion.button>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-header">
                                    <span className="card-category">{obj.category}</span>
                                    <h3>{obj.name}</h3>
                                    <p className="card-description">{obj.description}</p>
                                </div>
                                <div className="card-divider"></div>
                                <motion.button
                                    className="btn-card-details"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/gallery/product/${obj.id}`);
                                    }}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>Voir Détails</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CategoryShowcase
                objects={objects}
            />
        </div>
    );
}

function CategoryShowcase({ objects }) {
    const navigate = useNavigate();
    const categories = [
        { name: 'Zelige', icon: FaThLarge, description: 'Carreaux et revêtements traditionnels' },
        { name: 'Boiserie', icon: FaTree, description: 'Éléments en bois et menuiserie' },
        { name: 'Platre', icon: FaPaintRoller, description: 'Ornements et décorations' },
        { name: 'Autre', icon: FaCube, description: 'Autres éléments architecturaux' }
    ];

    return (
        <section className="category-showcase">
            {categories.map((category) => {
                const categoryObjects = objects.filter(obj => obj.category === category.name);
                const Icon = category.icon;

                return (
                    <div key={category.name} className="category-section">
                        <div className="category-header">
                            <div className="category-header-content">
                                <Icon className="category-icon" />
                                <div className="category-title-group">
                                    <h2 className="category-title">{category.name}</h2>
                                    <p className="category-subtitle">{category.description}</p>
                                </div>
                            </div>
                            <motion.button
                                className="btn-view-category"
                                onClick={() => navigate(`/gallery/category/${category.name}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Voir tout
                            </motion.button>
                        </div>

                        {categoryObjects.length > 0 ? (
                            <CategoryCarousel
                                objects={categoryObjects}
                            />
                        ) : (
                            <div className="no-models-inline">
                                <p>Aucun modèle disponible</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );
}

function CategoryCarousel({ objects }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsToShow = 3;

    // Limit to first 9 items for performance
    const limitedObjects = objects.slice(0, 9);

    const nextSlide = () => {
        if (currentIndex < limitedObjects.length - cardsToShow) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="carousel-wrapper">
            <button
                className="carousel-btn carousel-btn-prev"
                onClick={prevSlide}
                disabled={currentIndex === 0}
            >
                <FaChevronLeft />
            </button>

            <div className="carousel-track-container">
                <motion.div
                    className="carousel-track"
                    animate={{ x: -currentIndex * (100 / cardsToShow) + '%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {limitedObjects.map((obj, index) => (
                        <div key={obj.id} className="carousel-card">
                            <div
                                className="showcase-card"
                                onClick={() => navigate(`/gallery/product/${obj.id}`)}
                            >
                                <div className="showcase-card-image">
                                    {obj.xktFile ? (
                                        <XeokitViewer xktUrl={obj.xktFile} height="100%" width="100%" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p style={{ color: '#666' }}>Pas de prévisualisation</p>
                                        </div>
                                    )}
                                </div>
                                <div className="showcase-card-content">
                                    <div className="card-header">
                                        <span className="card-category">{obj.category}</span>
                                        <h3>{obj.name}</h3>
                                        <p className="showcase-description">{obj.description}</p>
                                    </div>
                                    <div className="card-divider"></div>
                                    <motion.button
                                        className="btn-card-details"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/gallery/product/${obj.id}`);
                                        }}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>Voir Détails</span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <button
                className="carousel-btn carousel-btn-next"
                onClick={nextSlide}
                disabled={currentIndex >= objects.length - cardsToShow}
            >
                <FaChevronRight />
            </button>
        </div>
    );
}

function SimpleCategoryCard({ category, icon: Icon, description }) {
    const navigate = useNavigate();

    return (
        <motion.div
            className="simple-category-card"
            onClick={() => navigate(`/gallery/category/${category}`)}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
            whileHover={{
                y: -8,
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="category-icon-wrapper"
                whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.2
                }}
                transition={{ duration: 0.5 }}
            >
                <Icon />
            </motion.div>
            <h3>{category}</h3>
            <p>{description}</p>
        </motion.div>
    );
}

export default Homepage;
