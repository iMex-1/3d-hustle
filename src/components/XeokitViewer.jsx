import { useEffect, useRef, useState } from 'react';
import { Viewer, XKTLoaderPlugin, GLTFLoaderPlugin } from '@xeokit/xeokit-sdk';
import '../styles/xeokit-viewer.css';

function XeokitViewer({ modelUrl, height = '100%', width = '100%', enableZoom = false }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const rotationRef = useRef(null);
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || !modelUrl) {
            return;
        }

        console.log('XeokitViewer: Loading model from URL:', modelUrl);
        setIsLoading(true);
        setHasError(false);

        try {
            // Create viewer
            const viewer = new Viewer({
                canvasId: canvasRef.current.id,
                transparent: true,
                backgroundColor: [0.95, 0.95, 0.95, 1.0]
            });

            viewerRef.current = viewer;

            // Configure camera for better initial view
            if (enableZoom) {
                // Product page: Allow default camera controls for zoom
                viewer.camera.eye = [10, 10, 10];
                viewer.camera.look = [0, 0, 0];
                viewer.camera.up = [0, 1, 0];
            } else {
                // Gallery cards: Closer zoom with rotation
                viewer.camera.eye = [5, 5, 5];
                viewer.camera.look = [0, 0, 0];
                viewer.camera.up = [0, 1, 0];
            }

            // Determine file type and create appropriate loader
            const fileExtension = modelUrl.split('.').pop().toLowerCase();
            let loader;
            let model;

            if (fileExtension === 'xkt') {
                // Create XKT loader
                loader = new XKTLoaderPlugin(viewer);
                model = loader.load({
                    id: `model-${Date.now()}`,
                    src: modelUrl,
                    edges: true,
                });
            } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
                // Create GLTF loader
                loader = new GLTFLoaderPlugin(viewer);
                model = loader.load({
                    id: `model-${Date.now()}`,
                    src: modelUrl,
                    edges: false, // Disable edges for GLB files as they can cause issues
                    backfaces: true
                });
            } else {
                console.error('XeokitViewer: Unsupported file format', fileExtension);
                setHasError(true);
                setIsLoading(false);
                return;
            }

            model.on('loaded', () => {
                console.log('Model loaded successfully:', modelUrl);
                setIsLoading(false);
                setHasError(false);

                // Fit model to view
                viewer.cameraFlight.flyTo({
                    aabb: model.aabb,
                    duration: 1.0,
                    fitFOV: enableZoom ? 45 : 35
                });

                if (!enableZoom) {
                    // Start very slow rotation animation for gallery cards
                    let angle = 0;
                    rotationRef.current = setInterval(() => {
                        if (!isHovered && viewerRef.current) {
                            angle += 0.005; // Slightly faster rotation for better visibility
                            const distance = 8;
                            const eye = [
                                Math.sin(angle) * distance,
                                distance * 0.6,
                                Math.cos(angle) * distance
                            ];
                            viewer.camera.eye = eye;
                            viewer.camera.look = [0, 0, 0];
                        }
                    }, 50); // 20fps for smoother animation
                }
            });

            model.on('error', (error) => {
                console.error('XeokitViewer: Error loading model', modelUrl, error);
                setHasError(true);
                setIsLoading(false);
            });

        } catch (error) {
            console.error('XeokitViewer: Error creating viewer', error);
        }

        // Cleanup
        return () => {
            if (rotationRef.current) {
                clearInterval(rotationRef.current);
            }
            if (viewerRef.current) {
                try {
                    viewerRef.current.destroy();
                } catch (error) {
                    console.error('XeokitViewer: Error destroying viewer', error);
                }
            }
        };
    }, [modelUrl, enableZoom]);

    // Handle hover zoom (only for gallery cards, not product page)
    useEffect(() => {
        if (!enableZoom && viewerRef.current && viewerRef.current.scene.models.length > 0) {
            const model = Object.values(viewerRef.current.scene.models)[0];
            if (isHovered) {
                viewerRef.current.cameraFlight.flyTo({
                    aabb: model.aabb,
                    duration: 0.3,
                    fitFOV: 30 // Zoom in on hover
                });
            } else {
                viewerRef.current.cameraFlight.flyTo({
                    aabb: model.aabb,
                    duration: 0.3,
                    fitFOV: 35 // Zoom out
                });
            }
        }
    }, [isHovered, enableZoom]);

    // Prevent page scroll when zooming on 3D model
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enableZoom) return;

        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        // Add event listener with passive: false to allow preventDefault
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [enableZoom]);

    return (
        <div
            ref={containerRef}
            className="xeokit-viewer-container"
            style={{ width, height }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <canvas
                ref={canvasRef}
                id={`xeokit-canvas-${Math.random().toString(36).substr(2, 9)}`}
                style={{ width: '100%', height: '100%' }}
            />

            {isLoading && (
                <div className="viewer-loading">
                    <div className="loading-spinner"></div>
                    <span>Chargement du modèle...</span>
                </div>
            )}

            {hasError && (
                <div className="viewer-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>Erreur de chargement</span>
                </div>
            )}

            {!isLoading && !hasError && !enableZoom && (
                <div className="viewer-hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    <span>Survolez pour zoomer</span>
                </div>
            )}

            {!isLoading && !hasError && enableZoom && (
                <div className="viewer-hint viewer-hint-zoom">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <span>Molette pour zoomer • Clic pour pivoter</span>
                </div>
            )}
        </div>
    );
}

export default XeokitViewer;
