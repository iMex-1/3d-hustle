import {
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    off,
    serverTimestamp,
    runTransaction
} from 'firebase/database';
import { db } from '../firebase.js';

/**
 * Enhanced Firebase service with React 19 optimizations
 * Includes better error handling, retry logic, and performance optimizations
 */

// Connection state management
let isConnected = true;
const connectionCallbacks = new Set();

// Monitor connection state
const connectedRef = ref(db, '.info/connected');
onValue(connectedRef, (snapshot) => {
    isConnected = snapshot.val() === true;
    connectionCallbacks.forEach(callback => callback(isConnected));
});

export function onConnectionStateChange(callback) {
    connectionCallbacks.add(callback);
    return () => connectionCallbacks.delete(callback);
}

// Enhanced error handling
class FirebaseServiceError extends Error {
    constructor(message, code, originalError) {
        super(message);
        this.name = 'FirebaseServiceError';
        this.code = code;
        this.originalError = originalError;
    }
}

function handleFirebaseError(error, operation) {
    console.error(`Firebase ${operation} error:`, error);

    let message = `Failed to ${operation}`;
    let code = error.code || 'unknown';

    switch (error.code) {
        case 'PERMISSION_DENIED':
            message = 'Permission denied. Please check your authentication.';
            break;
        case 'NETWORK_ERROR':
            message = 'Network error. Please check your connection.';
            break;
        case 'UNAVAILABLE':
            message = 'Service temporarily unavailable. Please try again.';
            break;
        default:
            message = error.message || message;
    }

    throw new FirebaseServiceError(message, code, error);
}

// Retry logic for network operations
async function withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxRetries || error.code === 'PERMISSION_DENIED') {
                throw error;
            }

            console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

/**
 * Enhanced database operations
 */

export async function getData(path) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            const snapshot = await get(dataRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            handleFirebaseError(error, 'get data');
        }
    });
}

export async function setData(path, data) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            await set(dataRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            handleFirebaseError(error, 'set data');
        }
    });
}

export async function updateData(path, updates) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            await update(dataRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            handleFirebaseError(error, 'update data');
        }
    });
}

export async function removeData(path) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            await remove(dataRef);
        } catch (error) {
            handleFirebaseError(error, 'remove data');
        }
    });
}

export async function pushData(path, data) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            const newRef = push(dataRef);
            await set(newRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return newRef.key;
        } catch (error) {
            handleFirebaseError(error, 'push data');
        }
    });
}

// Enhanced real-time listener with automatic reconnection
export function createListener(path, callback, options = {}) {
    const {
        onError = null,
        reconnectDelay = 5000,
        maxReconnectAttempts = 5
    } = options;

    let reconnectAttempts = 0;
    let isActive = true;
    let currentRef = null;

    const setupListener = () => {
        if (!isActive) return;

        try {
            currentRef = ref(db, path);

            const unsubscribe = onValue(
                currentRef,
                (snapshot) => {
                    reconnectAttempts = 0; // Reset on successful connection

                    try {
                        const data = snapshot.exists() ? snapshot.val() : null;
                        callback(data);
                    } catch (error) {
                        console.error('Error in listener callback:', error);
                        if (onError) onError(error);
                    }
                },
                (error) => {
                    console.error('Firebase listener error:', error);

                    if (onError) onError(error);

                    // Attempt reconnection for network errors
                    if (error.code === 'NETWORK_ERROR' && reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);

                        setTimeout(() => {
                            if (isActive) {
                                setupListener();
                            }
                        }, reconnectDelay * reconnectAttempts);
                    }
                }
            );

            return unsubscribe;
        } catch (error) {
            console.error('Error setting up listener:', error);
            if (onError) onError(error);
        }
    };

    const unsubscribe = setupListener();

    // Return cleanup function
    return () => {
        isActive = false;
        if (unsubscribe) {
            unsubscribe();
        }
        if (currentRef) {
            off(currentRef);
        }
    };
}

// Transaction support for atomic operations
export async function runDatabaseTransaction(path, updateFunction) {
    return withRetry(async () => {
        try {
            const dataRef = ref(db, path);
            const result = await runTransaction(dataRef, updateFunction);
            return result;
        } catch (error) {
            handleFirebaseError(error, 'run transaction');
        }
    });
}

// Batch operations for multiple updates
export async function batchUpdate(updates) {
    return withRetry(async () => {
        try {
            const rootRef = ref(db);

            // Add timestamps to all updates
            const timestampedUpdates = {};
            Object.keys(updates).forEach(path => {
                timestampedUpdates[path] = {
                    ...updates[path],
                    updatedAt: serverTimestamp(),
                };
            });

            await update(rootRef, timestampedUpdates);
        } catch (error) {
            handleFirebaseError(error, 'batch update');
        }
    });
}

// Utility functions
export function isOnline() {
    return isConnected;
}

export function getServerTimestamp() {
    return serverTimestamp();
}