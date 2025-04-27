import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

/**
 * Load SVG content from an asset
 * @param {string} assetPath - The path to the asset
 * @returns {Promise<string>} - The SVG content as a string
 */
export const loadSvgAsset = async (assetPath) => {
  try {
    // Load the asset
    const [asset] = await Asset.loadAsync(assetPath);
    
    // Read the file content
    const fileContent = await FileSystem.readAsStringAsync(asset.localUri);
    return fileContent;
  } catch (error) {
    console.error('Error loading SVG asset:', error);
    return null;
  }
};
