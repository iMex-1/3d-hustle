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
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Generate storage paths for a model
 * Returns paths for download file (IFC/RVT/RFA) and XKT in organized folder structure
 */
export const generateModelPaths = (modelName, downloadFileType = "ifc") => {
  const folderName = generateFolderName(modelName);
  const basePath = `/models/${folderName}`;

  return {
    folder: folderName,
    downloadPath: `${basePath}/${folderName}.${downloadFileType}`,
    xktPath: `${basePath}/${folderName}.xkt`,
    downloadFileName: `${folderName}.${downloadFileType}`,
    xktFileName: `${folderName}.xkt`,
    // Legacy support
    ifcPath: `${basePath}/${folderName}.ifc`,
    ifcFileName: `${folderName}.ifc`,
  };
};

/**
 * Get public URL for a file
 */
export const getPublicFileUrl = (path) => {
  if (!WORKER_URL) {
    console.error("VITE_R2_WORKER_URL is not defined in .env");
    return path; // Return path as-is if Worker URL not configured
  }

  // If path already includes the worker URL, return as-is
  if (path.startsWith("http")) {
    return path;
  }

  return `${WORKER_URL}${path}`;
};

/**
 * Upload file to R2 via Cloudflare Worker
 * @param {File} file - The file to upload
 * @param {string} modelName - Name of the model
 * @param {string} fileType - 'ifc', 'rvt', 'rfa', or 'xkt'
 * @returns {Promise<{path: string, url: string, size: number}>}
 */
export const uploadToR2 = async (file, modelName, fileType) => {
  const paths = generateModelPaths(modelName, fileType);
  // Use downloadPath for IFC/RVT/RFA, xktPath for XKT
  const path = fileType === "xkt" ? paths.xktPath : paths.downloadPath;
  const url = `${WORKER_URL}${path}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: file,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    return {
      path,
      url: getPublicFileUrl(path),
      size: file.size,
    };
  } catch (error) {
    console.error("R2 upload error:", error);
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
      method: "DELETE",
      headers: {
        "x-admin-secret": ADMIN_SECRET,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }

    return true;
  } catch (error) {
    console.error("R2 delete error:", error);
    throw error;
  }
};

/**
 * Delete model folder and all files (download file + XKT)
 * @param {string} modelName - Name of the model
 * @param {string} downloadFileType - Type of download file ('ifc', 'rvt', 'rfa')
 */
export const deleteModelFromR2 = async (
  modelName,
  downloadFileType = "ifc"
) => {
  const paths = generateModelPaths(modelName, downloadFileType);

  try {
    // Delete both files
    await Promise.all([
      deleteFileFromR2(paths.downloadPath),
      deleteFileFromR2(paths.xktPath),
    ]);

    return true;
  } catch (error) {
    console.error("Failed to delete model files:", error);
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
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};
