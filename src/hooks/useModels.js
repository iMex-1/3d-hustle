import { useState, useEffect, useCallback, useMemo, useOptimistic } from 'react';
import * as databaseService from '../services/databaseService';

/**
 * Custom hook for models data management with React 19 optimizations
 * Uses useOptimistic for immediate UI updates
 */
export function useModels() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use React 19's useOptimistic for immediate UI updates
    const [optimisticModels, addOptimisticModel] = useOptimistic(
        models,
        (currentModels, optimisticModel) => {
            if (optimisticModel.action === 'add') {
                return [...currentModels, optimisticModel.model];
            }
            if (optimisticModel.action === 'update') {
                return currentModels.map(model =>
                    model.model_id === optimisticModel.model.model_id
                        ? { ...model, ...optimisticModel.model }
                        : model
                );
            }
            if (optimisticModel.action === 'delete') {
                return currentModels.filter(model => model.model_id !== optimisticModel.modelId);
            }
            return currentModels;
        }
    );

    // Load initial models data
    useEffect(() => {
        let unsubscribe = null;

        const setupListener = () => {
            try {
                setError(null);

                unsubscribe = databaseService.listenToModels((modelsData) => {
                    setModels(modelsData);
                    setLoading(false);
                });
            } catch (err) {
                console.error('Error setting up models listener:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // Optimistic model creation
    const createModel = useCallback(async (modelData) => {
        const tempId = `temp_${Date.now()}`;
        const optimisticModel = {
            ...modelData,
            model_id: tempId,
            model_created_at: Date.now(),
            model_updated_at: Date.now(),
            downloads: 0,
            featured: false,
        };

        // Immediately update UI
        addOptimisticModel({ action: 'add', model: optimisticModel });

        try {
            const modelId = await databaseService.createModel(modelData);
            return modelId;
        } catch (error) {
            // Revert optimistic update on error
            setError(error.message);
            throw error;
        }
    }, [addOptimisticModel]);

    // Optimistic model update
    const updateModel = useCallback(async (modelId, updates) => {
        const existingModel = models.find(m => m.model_id === modelId);
        if (!existingModel) {
            throw new Error('Model not found');
        }

        const optimisticModel = {
            ...existingModel,
            ...updates,
            model_updated_at: Date.now(),
        };

        // Immediately update UI
        addOptimisticModel({ action: 'update', model: optimisticModel });

        try {
            await databaseService.updateModel(modelId, updates);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }, [models, addOptimisticModel]);

    // Optimistic model deletion
    const deleteModel = useCallback(async (modelId) => {
        // Immediately update UI
        addOptimisticModel({ action: 'delete', modelId });

        try {
            await databaseService.deleteModel(modelId);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }, [addOptimisticModel]);

    // Increment download count with optimistic update
    const incrementDownloadCount = useCallback(async (modelId) => {
        const existingModel = models.find(m => m.model_id === modelId);
        if (!existingModel) {
            throw new Error('Model not found');
        }

        const optimisticModel = {
            ...existingModel,
            downloads: (existingModel.downloads || 0) + 1,
            model_updated_at: Date.now(),
        };

        // Immediately update UI
        addOptimisticModel({ action: 'update', model: optimisticModel });

        try {
            await databaseService.incrementDownloadCount(modelId);
        } catch (error) {
            console.error('Error incrementing download count:', error);
            // Don't throw error for download count failures
        }
    }, [models, addOptimisticModel]);

    // Memoized filtered models
    const getModelsByCategory = useCallback((category) => {
        return optimisticModels.filter(model =>
            model.category?.toLowerCase() === category?.toLowerCase()
        );
    }, [optimisticModels]);

    const searchModels = useCallback((query) => {
        if (!query) return optimisticModels;

        const searchTerm = query.toLowerCase();
        return optimisticModels.filter(model =>
            model.name?.toLowerCase().includes(searchTerm) ||
            model.description?.toLowerCase().includes(searchTerm) ||
            model.category?.toLowerCase().includes(searchTerm) ||
            model.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }, [optimisticModels]);

    // Memoized categories
    const categories = useMemo(() => {
        const categorySet = new Set();
        optimisticModels.forEach(model => {
            if (model.category) {
                categorySet.add(model.category);
            }
        });
        return Array.from(categorySet).sort();
    }, [optimisticModels]);

    // Memoized featured models
    const featuredModels = useMemo(() => {
        return optimisticModels.filter(model => model.featured);
    }, [optimisticModels]);

    return {
        models: optimisticModels,
        loading,
        error,
        categories,
        featuredModels,
        createModel,
        updateModel,
        deleteModel,
        incrementDownloadCount,
        getModelsByCategory,
        searchModels,
        refreshModels: () => {
            setLoading(true);
            setError(null);
        },
    };
}