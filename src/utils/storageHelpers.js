// Storage helper utilities for Cloudflare R2 via Worker

const WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

/**
 * Generate a folder-safe name from model name
 * Example: "Building Architecture" -> "building-architecture"
 */
export const generateFolderName = (modelName) => {
  return modelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate storage paths for a model
 * Returns both IFC and XKT paths in organized folder structure
 */
export const generateModelPaths = (modelName) => {
  const folderName = generateFolderName(modelName);
  const basePath = `/models/${folderName}`;
  
  return {
    folder: folderName,
    ifcPath: `${basePath}/${folderName}.ifc`,
    xktPath: `${basePath}/${folderName}.xkt`,
    ifcFileName: `${folderName}.ifc`,
    xktFileName: `${folderName}.xkt`
  };
};

/**
 * Get public URL for a file
 */
export const getPublicFileUrl = (path) => {
  return `${WORKER_URL}${path}`;
};

/**
 * Upload file to R2 via Cloudflare Worker
 * @param {File} file - The file to upload
 * @param {string} modelName - Name of the model
 * @param {string} fileType - 'ifc' or 'xkt'
 * @returns {Promise<{path: string, url: string, size: number}>}
 */
export const uploadToR2 = async (file, modelName, fileType) => {
  const paths = generateModelPaths(modelName);
  const path = fileType === 'ifc' ? paths.ifcPath : paths.xktPath;
  const url = `${WORKER_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-admin-secret': ADMIN_SECRET
      },
      body: file
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }
    
    return {
      path,
      url: getPublicFileUrl(path),
      size: file.size
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    throw error;
  }
};

/**
 * Delete a single file from R2
 * @param {string} path - Path to file (e.g., /models/building-architecture/building-architecture.ifc)
 */
export const deleteFileFromR2 = async (path) => {
  const url = `${WORKER_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'x-admin-secret': ADMIN_SECRET
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }
    
    return true;
  } catch (error) {
    console.error('R2 delete error:', error);
    throw error;
  }
};

/**
 * Delete model folder and all files (IFC + XKT)
 * @param {string} modelName - Name of the model
 */
export const deleteModelFromR2 = async (modelName) => {
  const paths = generateModelPaths(modelName);
  
  try {
    // Delete both files
    await Promise.all([
      deleteFileFromR2(paths.ifcPath),
      deleteFileFromR2(paths.xktPath)
    ]);
    
    return true;
  } catch (error) {
    console.error('Failed to delete model files:', error);
    throw error;
  }
};

/**
 * Check if a file exists in R2
 * @param {string} path - Path to file
 */
export const checkFileExists = async (path) => {
  const url = `${WORKER_URL}${path}`;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};
