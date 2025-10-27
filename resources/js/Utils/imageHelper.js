/**
 * Image Helper Utilities
 * 
 * Provides helper functions for handling image URLs in the application
 */

/**
 * Get the full image URL for a given filename and folder
 * 
 * @param {string} filename - The image filename
 * @param {string} folder - The folder name (default: 'medtalks_tv')
 * @param {string} baseImagePath - Base URL for images (from Inertia shared props)
 * @returns {string} - Full image URL
 */
export const getImageUrl = (filename, folder = 'medtalks_tv', baseImagePath) => {
    if (!filename) return null;
    
    // If filename is already a full URL, return it
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    
    return `${baseImagePath}/${folder}/${filename}`;
};

/**
 * Get the episode image URL
 * 
 * @param {string} filename - The image filename
 * @param {string} baseImagePath - Base URL for images (from Inertia shared props)
 * @returns {string} - Full episode image URL
 */
export const getEpisodeImageUrl = (filename, baseImagePath) => {
    return getImageUrl(filename, 'medtalks_tv', baseImagePath);
};

/**
 * Get the sponsor banner URL
 * 
 * @param {string} filename - The banner filename
 * @param {string} baseImagePath - Base URL for images (from Inertia shared props)
 * @returns {string} - Full sponsor banner URL
 */
export const getSponsorBannerUrl = (filename, baseImagePath) => {
    return getImageUrl(filename, 'sponsor_pages', baseImagePath);
};

/**
 * Check if image URL is valid
 * 
 * @param {string} url - Image URL to check
 * @returns {boolean} - True if valid
 */
export const isValidImageUrl = (url) => {
    if (!url) return false;
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    
    return validExtensions.some(ext => lowerUrl.includes(ext));
};
