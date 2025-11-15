import { useState, useEffect, useRef } from 'react';
import { FaRocket, FaEye, FaBook, FaCube, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { objects as initialObjects } from '../data/objects';
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

    // Load objects from localStorage
    useEffect(() => {
        const savedObjects = localStorage.getItem('3d_objects');
        if (savedObjects) {
            setObjects(JSON.parse(savedObjects));
        } else {
            setObjects(initialObjects);
        }
    }, []);

    const featuredObjects = objects.filter(obj => obj.featured);

    const slides = [
        {
            id: 'welcome',
            type: 'welcome',
            image: '/heroslides/Slide1.png',
            title: 'Welcome to 3D Marketplace',
            subtitle: 'Premium 3D Models Platform',
            description: 'Explore high-quality 3D models in multiple formats.',
            buttons: [
                { text: 'Browse Gallery', action: () => onNavigate('gallery'), primary: true },
                { text: 'View Featured', action: () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }
            ]
        },
        {
            id: 'models',
            type: 'models',
            image: '/heroslides/Slide2.png',
            title: 'Explore 3D Models',
            subtitle: 'High-Quality Assets',
            description: 'Discover 3D models organized by category. Furniture, lighting, and decoration.',
            buttons: [
                { text: 'View All Models', action: () => onNavigate('gallery'), primary: true }
            ]
        },
        {
            id: 'formats',
            type: 'formats',
            image: '/heroslides/Slide3.png',
            title: 'Multiple Formats',
            subtitle: 'GLB • GLTF • OBJ • FBX • STL',
            description: 'Download in your preferred format. Compatible with Blender, Maya, 3ds Max, and Unity.',
            buttons: [
                { text: 'Learn More', action: () => onNavigate('gallery'), primary: true }
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
                                        <div className="slide-badge"><FaCube /> {slide.subtitle}</div>
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
                        <FaChevronLeft />
                    </button>

                    <button
                        className="carousel-arrow carousel-arrow-right"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <FaChevronRight />
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
                    <h2 className="section-title">Featured 3D Models</h2>
                    <p className="section-description">
                        Handpicked premium models ready for your next project
                    </p>
                </div>
                <div className="featured-grid">
                    {featuredObjects.map(obj => (
                        <div key={obj.id} className="featured-card" onClick={() => onSelectObject(obj.id)}>
                            <div className="card-image">
                                <model-viewer
                                    src={obj.model}
                                    alt={obj.name}
                                    auto-rotate
                                    camera-controls
                                    shadow-intensity="1"
                                    style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
                                ></model-viewer>
                                <div className="card-overlay-hover">
                                    <button className="btn-view-details">View Details</button>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{obj.name}</h3>
                                <p className="category">{obj.category}</p>
                                <p className="description">{obj.description}</p>
                                <div className="card-stats">
                                    <span><FaCube /> {obj.fileSize}</span>
                                    <span><FaDownload /> {obj.downloads}</span>
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