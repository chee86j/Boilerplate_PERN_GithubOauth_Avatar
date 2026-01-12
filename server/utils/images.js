import fs from 'fs/promises';
import path from 'path';

/*
 * Convert a base64 data URL to a Buffer
 * @param {string} dataUrl - The base64 data URL to convert
 * @returns {Buffer} The resulting Buffer
 */
export const dataUrlToBuffer = (dataUrl) => {
  // Extract the base64 data from the data URL
  const base64Data = dataUrl.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

/*
 * Save an image from a base64 data URL
 * @param {string} dataUrl - The base64 data URL of the image
 * @param {string} uploadDir - The directory to save the image in
 * @param {string} fileName - The name to give the file
 * @returns {Promise<string>} A promise that resolves with the file path
 */
export const saveImage = async (dataUrl, uploadDir, fileName) => {
  try {
    // Create the upload directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Convert the data URL to a buffer
    const buffer = dataUrlToBuffer(dataUrl);

    // Create the full file path
    const filePath = path.join(uploadDir, fileName);

    // Write the buffer to a file
    await fs.writeFile(filePath, buffer);

    return filePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

/*
 * Delete a file if it exists
 * @param {string} filePath - The path to the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // If the file doesn't exist, we don't need to do anything
    if (error.code !== 'ENOENT') {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

/*
 * Get the MIME type from a data URL
 * @param {string} dataUrl - The data URL to extract the MIME type from
 * @returns {string} The MIME type
 */
export const getMimeType = (dataUrl) => {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,/);
  if (!matches || matches.length !== 2) {
    throw new Error('Invalid data URL');
  }
  return matches[1];
};

/*
 * Validate an image data URL
 * @param {string} dataUrl - The data URL to validate
 * @returns {boolean} Whether the data URL is valid
 */
export const isValidImageDataUrl = (dataUrl) => {
  try {
    const mimeType = getMimeType(dataUrl);
    return mimeType.startsWith('image/');
  } catch (error) {
    return false;
  }
}; 
