import { useEffect, useRef } from 'react';
import { Viewer, XKTLoaderPlugin } from '@xeokit/xeokit-sdk';
import '../styles/xeokit-viewer.css';

function XeokitViewer({ xktUrl, height = '100%', width = '100%' }) {
    const canvasRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !xktUrl) {
            console.log('XeokitViewer: Missing canvas or xktUrl', { canvas: !!canvasRef.current, xktUrl });
            return;
        }

        console.log('XeokitViewer: Loading model from', xktUrl);

        try {
            // Create viewer
            const viewer = new Viewer({
                canvasId: canvasRef.current.id,
                transparent: true,
            });

            viewerRef.current = viewer;

            // Configure camera
            viewer.camera.eye = [-3.933, 2.855, 27.018];
            viewer.camera.look = [4.400, 3.724, 8.899];
            viewer.camera.up = [-0.018, 0.999, 0.039];

            // Create XKT loader
            const xktLoader = new XKTLoaderPlugin(viewer);

            // Load the model
            const model = xktLoader.load({
                id: `model-${Date.now()}`,
                src: xktUrl,
                edges: true,
            });

            model.on('loaded', () => {
                console.log('XeokitViewer: Model loaded successfully', xktUrl);
                viewer.cameraFlight.flyTo(model);
            });

            model.on('error', (error) => {
                console.error('XeokitViewer: Error loading model', xktUrl, error);
            });

        } catch (error) {
            console.error('XeokitViewer: Error creating viewer', error);
        }

        // Cleanup
        return () => {
            if (viewerRef.current) {
                try {
                    viewerRef.current.destroy();
                } catch (error) {
                    console.error('XeokitViewer: Error destroying viewer', error);
                }
            }
        };
    }, [xktUrl]);

    return (
        <div className="xeokit-viewer-container" style={{ width, height }}>
            <canvas
                ref={canvasRef}
                id={`xeokit-canvas-${Math.random().toString(36).substr(2, 9)}`}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default XeokitViewer;
