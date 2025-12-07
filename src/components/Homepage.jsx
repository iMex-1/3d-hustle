import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModels } from '../context/ModelsContext';
import XeokitViewer from './XeokitViewer';
import { FaThLarge, FaTree, FaPaintRoller, FaCube, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,  } from 'react-icons/fa';
import '../styles/homepage.css';

function Homepage({ user }) {
    const navigate = useNavigate();
    const { models: objects, loading } = useModels();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchDeltaX, setTouchDeltaX] = useState(0);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const autoPlayInterval = 5000;

    // Limit featured objects to reduce initial load
    const featuredObjects = objects.filter(obj => obj.featured).slice(0, 3);

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

    // Scroll progress calculation - hero stays stuck during first 100vh of scroll
    useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Progress from 0 to 1 during first viewport height of scrolling
            const progress = Math.min(scrollY / windowHeight, 1);
            
            setScrollProgress(progress);
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial call
        
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
            {/* Wrapper creates scroll space for sticky effect */}
            <div style={{ minHeight: '200vh', position: 'relative' }}>
                <div
                    ref={heroRef}
                    className="hero-carousel"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'sticky',
                        top: 0,
                        '--scroll-progress': scrollProgress
                    }}
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
                        {slides.map((slide, slideIndex) => (
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
                                        <div 
                                            className="slide-badge"
                                            style={{
                                                transform: `translateY(${(1 - scrollProgress) * 80}px)`,
                                                opacity: scrollProgress
                                            }}
                                        >
                                            {slide.subtitle}
                                        </div>
                                        <h1 
                                            className="slide-title"
                                            style={{
                                                transform: `translateY(${(1 - scrollProgress) * 100}px)`,
                                                opacity: scrollProgress
                                            }}
                                        >
                                            {slide.title}
                                        </h1>
                                        <p 
                                            className="slide-description"
                                            style={{
                                                transform: `translateY(${(1 - scrollProgress) * 80}px)`,
                                                opacity: scrollProgress
                                            }}
                                        >
                                            {slide.description}
                                        </p>
                                        <div 
                                            className="slide-buttons"
                                            style={{
                                                transform: `translateY(${(1 - scrollProgress) * 60}px)`,
                                                opacity: scrollProgress
                                            }}
                                        >
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

                    {/* Scroll Indicator */}
                    <div 
                        className="scroll-indicator"
                        style={{
                            opacity: 1 - scrollProgress * 2
                        }}
                    >
                        <div className="scroll-indicator-text">Scroll</div>
                        <div className="scroll-indicator-line"></div>
                    </div>
                </div>
            </div>
            </div>

            {/* Section 1 - Mini About Teaser */}
            <motion.section 
                className="about-teaser-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Lina Azhari Studio</h2>
                <p className="teaser-subtitle">Créatrice de matières traditionnelles et modèles BIM d'exception.</p>
                <p className="teaser-description">
                    Nous transformons le savoir-faire artisanal — Zellige, Boiserie, Plâtre — en fichiers BIM et IFC prêts à intégrer vos projets architecturaux. 
                    Entre héritage marocain et précision numérique, nos modèles apportent une touche authentique à vos rendus.
                </p>
            </motion.section>

            {/* Section 2 - What We Do */}
            <motion.section 
                className="specialties-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Nos Spécialités</h2>
                <div className="specialties-grid">
                    <motion.div 
                        className="specialty-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <FaThLarge className="specialty-icon" />
                        <h3>Zellige Numérique</h3>
                        <p>Motifs traditionnels capturés en modèles 3D fidèles et optimisés.</p>
                    </motion.div>
                    <motion.div 
                        className="specialty-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <FaTree className="specialty-icon" />
                        <h3>Boiserie & Plâtre</h3>
                        <p>Sculptés à la main, digitalisés pour vos scènes BIM.</p>
                    </motion.div>
                    <motion.div 
                        className="specialty-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <FaCube className="specialty-icon" />
                        <h3>Fichiers BIM / IFC</h3>
                        <p>Modèles professionnels prêts pour vos workflows architecturaux.</p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Section 3 - The Team */}
            <motion.section 
                className="team-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Une Équipe au Cœur du Détail</h2>
                <p>
                    Derrière chaque modèle, une équipe de designers, artisans et spécialistes BIM travaillant ensemble 
                    pour allier tradition et technologie.
                </p>
            </motion.section>

            {/* Section 4 - Formation */}
            <motion.section 
                className="formation-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Un Parcours Entre Art et Technologie</h2>
                <p>
                    Formée à la modélisation 3D et passionnée par les métiers du patrimoine, Lina unit techniques artisanales 
                    et outils numériques pour créer des modèles authentiques et fiables.
                </p>
            </motion.section>

            {/* Section 5 - Featured Products Auto-Scroll */}
            <FeaturedProductsCarousel objects={featuredObjects} navigate={navigate} />
        </div>
    );
}

// Auto-scrolling featured products carousel
function FeaturedProductsCarousel({ objects, navigate }) {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        const scrollContainer = scrollRef.current;
        const scrollSpeed = 0.5; // Slow, smooth scroll

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                scrollContainer.scrollLeft += scrollSpeed;

                // Reset when reaching halfway (seamless loop)
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused]);

    // Duplicate objects for infinite scroll effect
    const duplicatedObjects = [...objects, ...objects, ...objects];

    return (
        <section className="featured-carousel-section">
            <div className="section-header-center">
                <h2>Modèles BIM en Vedette</h2>
                <p>Modèles premium sélectionnés pour votre prochain projet</p>
            </div>
            <div 
                ref={scrollRef}
                className="auto-scroll-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="auto-scroll-track">
                    {duplicatedObjects.map((obj, index) => (
                        <motion.div
                            key={`${obj.id}-${index}`}
                            className="auto-scroll-card"
                            onClick={() => navigate(`/gallery/product/${obj.id}`)}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="auto-card-image">
                                {obj.xktFile ? (
                                    <XeokitViewer xktUrl={obj.xktFile} height="100%" width="100%" />
                                ) : (
                                    <div className="no-preview">
                                        <p>Pas de prévisualisation</p>
                                    </div>
                                )}
                            </div>
                            <div className="auto-card-content">
                                <span className="auto-card-category">{obj.category}</span>
                                <h3>{obj.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryCarousel({ objects }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsToShow = 3;

    // Limit to first 6 items for performance
    const limitedObjects = objects.slice(0, 6);

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
