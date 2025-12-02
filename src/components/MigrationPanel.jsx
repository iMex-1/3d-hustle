import { useState } from 'react';
import { migrateFirebaseToR2Structure, previewMigration, rollbackMigration } from '../utils/migrateToR2';

export default function MigrationPanel() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    setResult(null);
    try {
      const previewData = await previewMigration();
      setPreview(previewData);
      setShowPreview(true);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir migrer tous les modèles vers la structure R2 ?')) {
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const migrationResult = await migrateFirebaseToR2Structure();
      setResult(migrationResult);
      
      // Refresh preview after migration
      if (migrationResult.success) {
        const previewData = await previewMigration();
        setPreview(previewData);
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!confirm('⚠️⚠️⚠️ ATTENTION! Êtes-vous ABSOLUMENT sûr de vouloir annuler la migration ?\n\nCela restaurera les anciens chemins de fichiers locaux.')) {
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const rollbackResult = await rollbackMigration();
      setResult(rollbackResult);
      
      // Refresh preview after rollback
      if (rollbackResult.success) {
        const previewData = await previewMigration();
        setPreview(previewData);
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#232837',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
        🔄 Migration vers R2 Storage
      </h2>
      
      <p style={{ color: '#B8BCC8', marginBottom: '1.5rem' }}>
        Migrez vos modèles de l'ancien système de fichiers local vers la nouvelle structure R2 organisée.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handlePreview}
          disabled={loading}
          style={{
            background: 'rgba(0, 168, 150, 0.2)',
            color: '#00A896',
            border: '1px solid rgba(0, 168, 150, 0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          👁️ Prévisualiser la Migration
        </button>

        <button
          onClick={handleMigrate}
          disabled={loading || !preview || preview.needsMigration === 0}
          style={{
            background: loading ? '#666' : 'linear-gradient(135deg, #00A896 0%, #00C8B3 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: loading || !preview || preview.needsMigration === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading || !preview || preview.needsMigration === 0 ? 0.5 : 1
          }}
        >
          {loading ? '⏳ Migration en cours...' : '🚀 Lancer la Migration'}
        </button>

        <button
          onClick={handleRollback}
          disabled={loading || !preview || preview.alreadyMigrated === 0}
          style={{
            background: 'rgba(255, 59, 48, 0.2)',
            color: '#FF3B30',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: loading || !preview || preview.alreadyMigrated === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading || !preview || preview.alreadyMigrated === 0 ? 0.5 : 1
          }}
        >
          ↩️ Annuler la Migration
        </button>
      </div>

      {result && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: result.success ? 'rgba(0, 168, 150, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          border: `1px solid ${result.success ? 'rgba(0, 168, 150, 0.3)' : 'rgba(255, 59, 48, 0.3)'}`,
          color: result.success ? '#00A896' : '#FF3B30'
        }}>
          <strong>{result.success ? '✅ Succès!' : '❌ Erreur'}</strong>
          <p style={{ marginTop: '0.5rem' }}>{result.message}</p>
          {result.migratedCount !== undefined && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Migrés: {result.migratedCount} | Ignorés: {result.skippedCount} | Total: {result.totalCount}
            </p>
          )}
        </div>
      )}

      {showPreview && preview && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '1.5rem',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#FFFFFF', margin: 0 }}>
              Aperçu de la Migration
            </h3>
            <button
              onClick={() => setShowPreview(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {preview.totalCount}
              </div>
              <div style={{ color: '#B8BCC8', fontSize: '0.9rem' }}>Total Modèles</div>
            </div>

            <div style={{ 
              background: 'rgba(0, 168, 150, 0.1)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(0, 168, 150, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ color: '#00A896', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {preview.alreadyMigrated}
              </div>
              <div style={{ color: '#B8BCC8', fontSize: '0.9rem' }}>Déjà Migrés</div>
            </div>

            <div style={{ 
              background: 'rgba(255, 193, 7, 0.1)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(255, 193, 7, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <div style={{ color: '#FFC107', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {preview.needsMigration}
              </div>
              <div style={{ color: '#B8BCC8', fontSize: '0.9rem' }}>À Migrer</div>
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {preview.models.map((model, index) => (
              <div
                key={model.modelId}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  border: `1px solid ${model.alreadyMigrated ? 'rgba(0, 168, 150, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <strong style={{ color: '#FFFFFF' }}>{model.modelName}</strong>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    background: model.alreadyMigrated ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                    color: model.alreadyMigrated ? '#00A896' : '#FFC107'
                  }}>
                    {model.alreadyMigrated ? '✅ Migré' : '⏳ À migrer'}
                  </span>
                </div>

                {!model.alreadyMigrated && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: '#FF3B30', marginBottom: '0.25rem' }}>
                      ❌ Ancien: {model.old.ifcUrl}
                    </div>
                    <div style={{ color: '#00A896' }}>
                      ✅ Nouveau: {model.new.ifcUrl}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
