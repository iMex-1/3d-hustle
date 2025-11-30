import { useState, useEffect, useRef } from 'react';
import { objects as initialObjects } from '../data/objects';
import XeokitViewer from './XeokitViewer';
import '../styles/homepage.css';

function Homepage({ onNavigate, onSelectObject, user }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchDeltaX, setTouchDeltaX] = useState(0);
    const [objects, setObjects] = useState([]);
    const containerRef = useRef(null);
    const autoPlayInterval = 5000;

    useEffect(() => {
        // Always use initialObjects and save to localStorage
        setObjects(initialObjects);
        localStorage.setItem('3d_objects', JSON.stringify(initialObjects));
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
                                        <div className="slide-badge">📦 {slide.subtitle}</div>
                                        <h1 className="slide-title">{slide.title}</h1>
                                        <p className="slide-description">{slide.description}</p>
                                        <div className="slide-buttons">
                                            {slide.buttons.map((button, btnIndex) => (
                                                <button
                                                    key={btnIndex}
                                                    onClick={button.action}
                                                    className={`slide-btn ${button.primary ? 'slide-btn-primary' : 'slide-btn-secondary'}`}
                                                >
                                                    {button.text}
                                                    <span className="btn-arrow">→</span>
                                                </button>
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
                            <button
                                key={index}
                                className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
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
                    {featuredObjects.map((obj) => (
                        <div
                            key={obj.id}
                            className="featured-card"
                            onClick={() => onSelectObject(obj.id)}
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
                                    <button className="btn-view-details">Voir les Détails</button>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{obj.name}</h3>
                                <p className="category">{obj.category}</p>
                                <p className="description">{obj.description}</p>
                                <div className="card-stats">
                                    <span>📦 {obj.fileSize}</span>
                                    <span>⬇️ {obj.downloads}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Homepage;
