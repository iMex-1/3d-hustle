import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as databaseService from '../services/databaseService';
import { getPublicFileUrl } from '../utils/storageHelpers';
import XeokitViewer from './XeokitViewer';
import '../styles/homepage.css';

function Homepage({ onNavigate, onSelectObject, user }) {
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

    const featuredObjects = objects.filter(obj => obj.featured);

    const slides = [
        {
            id: 'welcome',
            type: 'welcome',
            image: '/heroslides/Slide1.png',
            title: 'Bienvenue sur OakMesh',
            subtitle: 'Plateforme de Modèles BIM',
            description: 'Explorez des modèles IFC/XKT de haute qualité pour vos projets.',
            buttons: [
                { text: 'Parcourir la Galerie', action: () => onNavigate('gallery'), primary: true },
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
                { text: 'Voir Tous les Modèles', action: () => onNavigate('gallery'), primary: true }
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
                { text: 'En Savoir Plus', action: () => onNavigate('gallery'), primary: true }
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
            <section className="featured-section" id="featured">
                <div className="section-header">
                    <h2 className="section-title">Modèles BIM en Vedette</h2>
                    <p className="section-description">
                        Modèles premium sélectionnés pour votre prochain projet
                    </p>
                </div>
                <div className="featured-grid">
                    {featuredObjects.map((obj, index) => (
                        <motion.div
                            key={obj.id}
                            className="featured-card"
                            onClick={() => onSelectObject(obj.id)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
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
                                <h3>{obj.name}</h3>
                                <p className="category">{obj.category}</p>
                                <p className="description">{obj.description}</p>
                                <div className="card-stats">
                                    <span>Taille: {obj.fileSize}</span>
                                    <span>Téléchargements: {obj.downloads}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Homepage;
