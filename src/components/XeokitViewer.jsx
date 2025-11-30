import { useEffect, useRef, useState } from 'react';
import { Viewer, XKTLoaderPlugin } from '@xeokit/xeokit-sdk';
import '../styles/xeokit-viewer.css';

function XeokitViewer({ xktUrl, height = '100%', width = '100%', enableZoom = false }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);
    const rotationRef = useRef(null);
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || !xktUrl) {
            return;
        }

        try {
            // Create viewer
            const viewer = new Viewer({
                canvasId: canvasRef.current.id,
                transparent: true,
            });

            viewerRef.current = viewer;

            // Configure camera for better initial view
            if (enableZoom) {
                // Product page: Allow default camera controls for zoom
                viewer.camera.eye = [-3.933, 2.855, 27.018];
                viewer.camera.look = [4.400, 3.724, 8.899];
                viewer.camera.up = [-0.018, 0.999, 0.039];
            } else {
                // Gallery cards: Closer zoom with rotation
                viewer.camera.eye = [-2.5, 2.0, 8.0];
                viewer.camera.look = [0, 0, 0];
                viewer.camera.up = [0, 1, 0];
            }

            // Create XKT loader
            const xktLoader = new XKTLoaderPlugin(viewer);

            // Load the model
            const model = xktLoader.load({
                id: `model-${Date.now()}`,
                src: xktUrl,
                edges: true,
            });

            model.on('loaded', () => {
                if (enableZoom) {
                    // Product page: Fit to view and allow user controls
                    viewer.cameraFlight.flyTo({
                        aabb: model.aabb,
                        duration: 0.5
                    });
                    // No rotation animation for product page
                } else {
                    // Gallery cards: Closer zoom with rotation
                    viewer.cameraFlight.flyTo({
                        aabb: model.aabb,
                        duration: 0.5,
                        fitFOV: 35 // Tighter fit (smaller FOV = closer zoom)
                    });

                    // Start very slow rotation animation
                    let angle = 0;
                    rotationRef.current = setInterval(() => {
                        if (!isHovered) {
                            angle += 0.0008; // Very slow rotation (~1 full rotation per 2 minutes)
                            const radius = 8;
                            viewer.camera.eye = [
                                Math.sin(angle) * radius,
                                2.0,
                                Math.cos(angle) * radius
                            ];
                            viewer.camera.look = [0, 0, 0];
                        }
                    }, 16); // ~60fps
                }
            });

            model.on('error', (error) => {
                console.error('XeokitViewer: Error loading model', xktUrl, error);
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
    }, [xktUrl, enableZoom]);

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
            {!enableZoom && (
                <div className="viewer-hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    <span>Survolez pour zoomer</span>
                </div>
            )}
            {enableZoom && (
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
