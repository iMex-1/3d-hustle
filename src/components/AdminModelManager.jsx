import { useState, useEffect } from "react";
import { FaFile, FaPalette, FaStar, FaTrash } from "react-icons/fa";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase/config";
import { deleteModelFromR2 } from "../utils/storageHelpers";

export default function AdminModelManager() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const modelsRef = ref(database, "models");

    const unsubscribe = onValue(modelsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const modelsList = Object.entries(data).map(([id, model]) => ({
          id,
          ...model,
        }));
        setModels(modelsList);
      } else {
        setModels([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (modelId, modelName) => {
    if (
      !confirm(
        `Delete "${modelName}"? This will remove both files from storage.`
      )
    ) {
      return;
    }

    setDeleting(modelId);

    try {
      // Delete from R2 storage
      await deleteModelFromR2(modelName);

      // Delete from Firebase
      const modelRef = ref(database, `models/${modelId}`);
      await remove(modelRef);

      alert("Model deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete model: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading models...</div>;
  }

  return (
    <div className="admin-model-manager">
      <h2>Manage Models ({models.length})</h2>

      {models.length === 0 ? (
        <p>No models uploaded yet.</p>
      ) : (
        <div className="models-grid">
          {models.map((model) => (
            <div key={model.id} className="model-card-admin">
              <div className="model-header">
                <h3>{model.model_name}</h3>
                {model.featured && (
                  <span className="badge-featured">
                    <FaStar /> Featured
                  </span>
                )}
              </div>

              <div className="model-info">
                <p>
                  <strong>Category:</strong> {model.model_category}
                </p>
                <p>
                  <strong>Folder:</strong> {model.model_folder}
                </p>
                <p>
                  <strong>Downloads:</strong> {model.downloads || 0}
                </p>
                <p className="model-desc">{model.model_description}</p>
              </div>

              <div className="model-files">
                <div className="file-item">
                  <span>
                    <FaFile /> IFC:
                  </span>
                  <span>
                    {(model.model_ifc_size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="file-item">
                  <span>
                    <FaPalette /> XKT:
                  </span>
                  <span>
                    {(model.model_xkt_size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <div className="model-actions">
                <a
                  href={`${import.meta.env.VITE_R2_WORKER_URL}${
                    model.model_ifc_url
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-test"
                >
                  Test IFC
                </a>
                <a
                  href={`${import.meta.env.VITE_R2_WORKER_URL}${
                    model.model_xkt_url
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-test"
                >
                  Test XKT
                </a>
                <button
                  onClick={() => handleDelete(model.id, model.model_name)}
                  disabled={deleting === model.id}
                  className="btn-delete"
                >
                  {deleting === model.id ? (
                    "Deleting..."
                  ) : (
                    <>
                      <FaTrash /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
