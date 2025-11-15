import { FaArrowLeft, FaDownload, FaCube, FaChartBar } from 'react-icons/fa';
import { objects } from '../data/objects';
import '../styles/object-detail.css';

function ObjectDetail({ objectId, onNavigate }) {
    const object = objects.find(obj => obj.id === objectId);

    if (!object) {
        return (
            <div className="object-detail">
                <p>Object not found</p>
                <button onClick={() => onNavigate('gallery')}>Back to Gallery</button>
            </div>
        );
    }

    const handleDownload = (format) => {
        alert(`Downloading ${object.name} in ${format} format...`);
    };

    return (
        <div className="object-detail">
            <button className="btn-back" onClick={() => onNavigate('gallery')}>
                <FaArrowLeft /> Back to Gallery
            </button>

            <div className="detail-container">
                <div className="detail-image">
                    <model-viewer
                        src={object.model}
                        alt={object.name}
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        style={{ width: '100%', height: '100%' }}
                    ></model-viewer>
                </div>

                <div className="detail-info">
                    <h1>{object.name}</h1>
                    <span className="category-badge">{object.category}</span>

                    <p className="description">{object.description}</p>

                    <div className="specs">
                        <h3>Specifications</h3>
                        <div className="spec-grid">
                            <div className="spec-item">
                                <span className="spec-label">File Size</span>
                                <span className="spec-value">{object.fileSize}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Polygons</span>
                                <span className="spec-value">{object.polygons.toLocaleString()}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Vertices</span>
                                <span className="spec-value">{object.vertices.toLocaleString()}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Downloads</span>
                                <span className="spec-value">{object.downloads.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="download-section">
                        <h3>Available Formats</h3>
                        <div className="format-buttons">
                            {object.formats.map(format => (
                                <button
                                    key={format}
                                    className="btn-download"
                                    onClick={() => handleDownload(format)}
                                >
                                    <FaDownload /> Download {format}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ObjectDetail;
