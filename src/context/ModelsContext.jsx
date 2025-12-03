import { createContext, useContext, useState, useEffect } from 'react';
import * as databaseService from '../services/databaseService';
import { getPublicFileUrl } from '../utils/storageHelpers';

const ModelsContext = createContext();

export function ModelsProvider({ children }) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = databaseService.listenToModels((rawModels) => {
            console.log('Models loaded globally:', rawModels.length);

            // Transform models once globally
            const transformedModels = rawModels.map(model => ({
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

            setModels(transformedModels);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <ModelsContext.Provider value={{ models, loading }}>
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
