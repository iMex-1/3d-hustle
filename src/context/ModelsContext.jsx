import { createContext, useContext } from 'react';
import { useModels as useModelsHook } from '../hooks/useModels';
import { getPublicFileUrl } from '../utils/storageHelpers';

const ModelsContext = createContext();

export function ModelsProvider({ children }) {
    const modelsData = useModelsHook();

    // Transform models for backward compatibility
    const transformedModels = modelsData.models.map(model => ({
        id: model.model_id || model.id,
        name: model.model_name || model.name || 'Sans nom',
        category: model.model_category || model.category || 'Autre',
        description: model.model_description || model.description || '',
        xktFile: model.model_xkt_url ? getPublicFileUrl(model.model_xkt_url) : (model.xktFile || ''),
        ifcFile: model.model_ifc_url ? getPublicFileUrl(model.model_ifc_url) : (model.ifcFile || ''),
        fileSize: model.model_xkt_size ? `${(model.model_xkt_size / (1024 * 1024)).toFixed(1)} Mo` : (model.fileSize || 'N/A'),
        downloads: model.downloads || 0,
        featured: model.featured || false
    }));

    const contextValue = {
        ...modelsData,
        models: transformedModels,
    };

    return (
        <ModelsContext.Provider value={contextValue}>
            {children}
        </ModelsContext.Provider>
    );
}

export function useModels() {
    const context = useContext(ModelsContext);
    if (!context) {
        throw new Error('useModels must be used within ModelsProvider');
    }
    return context;
}
