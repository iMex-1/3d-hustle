import { ref, get, set, update, remove, push, onValue } from 'firebase/database';
import { db as defaultDb } from '../firebase.js';

// Allow database instance to be overridden for testing
let db = defaultDb;

/**
 * Set database instance (for testing purposes)
 * @param {Database} dbInstance - Firebase database instance
 */
export function setDatabaseInstance(dbInstance) {
  db = dbInstance;
}

/**
 * Reset database instance to default
 */
export function resetDatabaseInstance() {
  db = defaultDb;
}

/**
 * User Data Operations
 */

/**
 * Sync user data to database - creates new user or updates existing user
 * @param {Object} user - Firebase user object
 * @returns {Promise<void>}
 */
export async function syncUserData(user) {
  try {
    if (!user || !user.uid) {
      throw new Error('Invalid user object: uid is required');
    }

    const userRef = ref(db, `users/${user.uid}`);

    // Check if user exists
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // Update existing user - preserve isAdmin field
      const existingData = snapshot.val();
      await update(userRef, {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || ''
      });
      console.log(`Updated existing user: ${user.uid}`);
    } else {
      // Create new user with default isAdmin = false
      await set(userRef, {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        isAdmin: false
      });
      console.log(`Created new user: ${user.uid}`);
    }
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw new Error(`Failed to sync user data: ${error.message}`);
  }
}

/**
 * Get user data from database
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User record or null if not found
 */
export async function getUserData(uid) {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}

/**
 * Update user admin status
 * @param {string} uid - User ID
 * @param {boolean} isAdmin - Admin status
 * @returns {Promise<void>}
 */
export async function updateUserAdmin(uid, isAdmin) {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    if (typeof isAdmin !== 'boolean') {
      throw new Error('isAdmin must be a boolean value');
    }

    const userRef = ref(db, `users/${uid}`);

    // Check if user exists
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error(`User ${uid} does not exist`);
    }

    await update(userRef, { isAdmin });
    console.log(`Updated admin status for user ${uid}: ${isAdmin}`);
  } catch (error) {
    console.error('Error updating user admin status:', error);
    throw new Error(`Failed to update user admin status: ${error.message}`);
  }
}

/**
 * Model Data Operations
 */

/**
 * Get all models from database
 * @returns {Promise<Array>} Array of model records
 */
export async function getAllModels() {
  try {
    const modelsRef = ref(db, 'models');
    const snapshot = await get(modelsRef);

    if (snapshot.exists()) {
      const modelsData = snapshot.val();
      // Convert object to array with model_id included
      return Object.entries(modelsData).map(([id, data]) => ({
        model_id: id,
        ...data
      }));
    }

    return [];
  } catch (error) {
    console.error('Error getting all models:', error);
    throw new Error(`Failed to get all models: ${error.message}`);
  }
}

/**
 * Get a specific model by ID
 * @param {string} modelId - Model ID
 * @returns {Promise<Object|null>} Model record or null if not found
 */
export async function getModelById(modelId) {
  try {
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    const modelRef = ref(db, `models/${modelId}`);
    const snapshot = await get(modelRef);

    if (snapshot.exists()) {
      return {
        model_id: modelId,
        ...snapshot.val()
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting model by ID:', error);
    throw new Error(`Failed to get model: ${error.message}`);
  }
}

/**
 * Create a new model in the database
 * @param {Object} modelData - Model data (without model_id)
 * @returns {Promise<string>} The generated model ID
 */
export async function createModel(modelData) {
  try {
    if (!modelData) {
      throw new Error('Model data is required');
    }

    // Generate unique ID
    const modelsRef = ref(db, 'models');
    const newModelRef = push(modelsRef);
    const modelId = newModelRef.key;

    // Set timestamps
    const timestamp = Date.now();
    const modelRecord = {
      ...modelData,
      model_created_at: timestamp,
      model_updated_at: timestamp,
      downloads: modelData.downloads || 0,
      featured: modelData.featured || false
    };

    await set(newModelRef, modelRecord);
    console.log(`Created new model: ${modelId}`);

    return modelId;
  } catch (error) {
    console.error('Error creating model:', error);
    throw new Error(`Failed to create model: ${error.message}`);
  }
}

/**
 * Update an existing model
 * @param {string} modelId - Model ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateModel(modelId, updates) {
  try {
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Update data is required');
    }

    const modelRef = ref(db, `models/${modelId}`);

    // Check if model exists
    const snapshot = await get(modelRef);
    if (!snapshot.exists()) {
      throw new Error(`Model ${modelId} does not exist`);
    }

    // Add updated timestamp
    const updateData = {
      ...updates,
      model_updated_at: Date.now()
    };

    await update(modelRef, updateData);
    console.log(`Updated model: ${modelId}`);
  } catch (error) {
    console.error('Error updating model:', error);
    throw new Error(`Failed to update model: ${error.message}`);
  }
}

/**
 * Delete a model from the database
 * @param {string} modelId - Model ID
 * @returns {Promise<void>}
 */
export async function deleteModel(modelId) {
  try {
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    const modelRef = ref(db, `models/${modelId}`);

    // Check if model exists
    const snapshot = await get(modelRef);
    if (!snapshot.exists()) {
      throw new Error(`Model ${modelId} does not exist`);
    }

    await remove(modelRef);
    console.log(`Deleted model: ${modelId}`);
  } catch (error) {
    console.error('Error deleting model:', error);
    throw new Error(`Failed to delete model: ${error.message}`);
  }
}

/**
 * Real-time Listener Functions
 */

/**
 * Listen to all models in real-time
 * @param {Function} callback - Callback function to invoke when data changes
 * @returns {Function} Unsubscribe function
 */
export function listenToModels(callback) {
  try {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const modelsRef = ref(db, 'models');

    const unsubscribe = onValue(modelsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const modelsData = snapshot.val();
          // Convert object to array with model_id included
          const modelsArray = Object.entries(modelsData).map(([id, data]) => ({
            model_id: id,
            ...data
          }));
          callback(modelsArray);
        } else {
          callback([]);
        }
      } catch (error) {
        console.error('Error in models listener callback:', error);
      }
    }, (error) => {
      console.error('Error listening to models:', error);
      // Attempt to re-establish connection after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect to models listener...');
        listenToModels(callback);
      }, 5000);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up models listener:', error);
    throw new Error(`Failed to set up models listener: ${error.message}`);
  }
}

/**
 * Listen to a specific user in real-time
 * @param {string} uid - User ID
 * @param {Function} callback - Callback function to invoke when data changes
 * @returns {Function} Unsubscribe function
 */
export function listenToUser(uid, callback) {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const userRef = ref(db, `users/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error in user listener callback:', error);
      }
    }, (error) => {
      console.error('Error listening to user:', error);
      // Attempt to re-establish connection after a delay
      setTimeout(() => {
        console.log(`Attempting to reconnect to user ${uid} listener...`);
        listenToUser(uid, callback);
      }, 5000);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up user listener:', error);
    throw new Error(`Failed to set up user listener: ${error.message}`);
  }
}

/**
 * Increment download count for a model
 * @param {string} modelId - Model ID
 * @returns {Promise<void>}
 */
export async function incrementDownloadCount(modelId) {
  try {
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    const modelRef = ref(db, `models/${modelId}`);

    // Get current model data
    const snapshot = await get(modelRef);
    if (!snapshot.exists()) {
      throw new Error(`Model ${modelId} does not exist`);
    }

    const currentData = snapshot.val();
    const currentDownloads = currentData.downloads || 0;

    // Increment download count
    await update(modelRef, {
      downloads: currentDownloads + 1,
      model_updated_at: Date.now()
    });

    console.log(`Incremented download count for model ${modelId}: ${currentDownloads} -> ${currentDownloads + 1}`);
  } catch (error) {
    console.error('Error incrementing download count:', error);
    throw new Error(`Failed to increment download count: ${error.message}`);
  }
}
