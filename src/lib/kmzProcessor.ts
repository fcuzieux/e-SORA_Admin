import JSZip from 'jszip';
import { kml } from '@tmcw/togeojson';
import { DOMParser, XMLSerializer } from 'xmldom';

export interface ProcessedGeoFile {
  name: string;
  data: any;
  type: 'kml' | 'kmz' | 'geojson';
  images?: ProcessedImage[];
  groundOverlays?: GroundOverlay[];
}

export interface ProcessedImage {
  name: string;
  url: string;
  blob: Blob;
}

export interface GroundOverlay {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  rotation?: number;
  opacity?: number;
}

/**
 * Extracts images from KMZ archive and creates blob URLs
 */
async function extractImagesFromKmz(zip: JSZip): Promise<ProcessedImage[]> {
  const images: ProcessedImage[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp'];

  for (const [filename, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const lowerFilename = filename.toLowerCase();
      const isImage = imageExtensions.some(ext => lowerFilename.endsWith(ext));
      
      if (isImage) {
        try {
          const imageBlob = await zipEntry.async('blob');
          // Ensure proper MIME type for different image formats
          let mimeType = 'image/jpeg'; // default
          if (lowerFilename.endsWith('.png')) mimeType = 'image/png';
          else if (lowerFilename.endsWith('.gif')) mimeType = 'image/gif';
          else if (lowerFilename.endsWith('.bmp')) mimeType = 'image/bmp';
          else if (lowerFilename.endsWith('.tiff') || lowerFilename.endsWith('.tif')) mimeType = 'image/tiff';
          else if (lowerFilename.endsWith('.webp')) mimeType = 'image/webp';
          
          // Create blob with correct MIME type
          const typedBlob = new Blob([imageBlob], { type: mimeType });
          const imageUrl = URL.createObjectURL(typedBlob);
          
          console.log(`Extracted image: ${filename} (${mimeType}) - URL: ${imageUrl}`);
          
          images.push({
            name: filename,
            url: imageUrl,
            blob: typedBlob
          });
        } catch (error) {
          console.warn(`Failed to extract image ${filename}:`, error);
        }
      }
    }
  }

  console.log(`Total images extracted: ${images.length}`);
  images.forEach(img => console.log(`- ${img.name}: ${img.url}`));
  
  return images;
}

/**
 * Parses GroundOverlay elements from KML document
 */
function parseGroundOverlays(kmlDoc: any, images: ProcessedImage[]): GroundOverlay[] {
  const groundOverlays: GroundOverlay[] = [];
  const overlayElements = kmlDoc.getElementsByTagName('GroundOverlay');

  console.log(`Found ${overlayElements.length} GroundOverlay elements`);

  for (let i = 0; i < overlayElements.length; i++) {
    const overlay = overlayElements[i];
    try {
      const name = getElementTextContent(overlay, 'name') || `Ground Overlay ${i + 1}`;
      const description = getElementTextContent(overlay, 'description') || '';

      // Get icon/image reference
      const iconElements = overlay.getElementsByTagName('Icon');
      let imageUrl = '';
      if (iconElements.length > 0) {
        const hrefElements = iconElements[0].getElementsByTagName('href');
        if (hrefElements.length > 0) {
          imageUrl = hrefElements[0].textContent || '';
        }
      }
      console.log(`Extracted image: - URL: ${imageUrl}`);
      console.log(`KML : Processing overlay ${name} with image reference: ${imageUrl}`);

      // If it's a relative path, find the corresponding extracted image
      if (imageUrl && !imageUrl.startsWith('http')) {
        // Try multiple matching strategies
        const matchingImage = images.find(img =>
          img.name === imageUrl ||
          img.name.endsWith(imageUrl) ||
          img.name.toLowerCase() === imageUrl.toLowerCase() ||
          img.name.toLowerCase().endsWith(imageUrl.toLowerCase()) ||
          // Handle cases where path separators might differ
          img.name.replace(/\\/g, '/') === imageUrl.replace(/\\/g, '/') ||
          img.name.replace(/\\/g, '/').endsWith(imageUrl.replace(/\\/g, '/'))
        );

        if (matchingImage) {
          imageUrl = matchingImage.url;
          console.log(`Matched image for overlay ${name}: ${imageUrl}`);
        } else {
          console.warn(`No matching image found for overlay ${name} with reference ${imageUrl}`);
          console.log('Available images:', images.map(img => img.name));
          console.log('Looking for:', imageUrl);

          // Try a more flexible search as fallback
          const flexibleMatch = images.find(img => {
            const imgBasename = img.name.split('/').pop()?.toLowerCase() || '';
            const refBasename = imageUrl.split('/').pop()?.toLowerCase() || '';
            return imgBasename === refBasename;
          });

          if (flexibleMatch) {
            imageUrl = flexibleMatch.url;
            console.log(`Found flexible match for overlay ${name}: ${imageUrl}`);
          }
        }
      }

      // Get LatLonBox bounds
      const latLonBox = getElement(overlay, 'LatLonBox');
      if (!latLonBox) {
        console.warn(`No LatLonBox found for overlay ${name}`);
        continue;
      }
      if (!imageUrl) {
        console.warn(`No image URL found for overlay ${name}`);
        continue;
      }

      const north = parseFloat(getElementTextContent(latLonBox, 'north') || '0');
      const south = parseFloat(getElementTextContent(latLonBox, 'south') || '0');
      const east = parseFloat(getElementTextContent(latLonBox, 'east') || '0');
      const west = parseFloat(getElementTextContent(latLonBox, 'west') || '0');
      const rotation = parseFloat(getElementTextContent(latLonBox, 'rotation') || '0');

      console.log(`Overlay ${name} bounds:`, { north, south, east, west });
      // Get color/opacity if available
      const colorElement = getElement(overlay, 'color');
      let opacity = 1;
      if (colorElement) {
        const colorValue = colorElement.textContent;
        if (colorValue && colorValue.length === 8) {
          // KML color format is AABBGGRR, alpha is first two characters
          const alpha = parseInt(colorValue.substring(0, 2), 16);
          opacity = alpha / 255;
        }
      }

      groundOverlays.push({
        id: `ground-overlay-${i}`,
        name,
        description,
        imageUrl,
        bounds: { north, south, east, west },
        rotation,
        opacity
      });

      console.log(`Successfully added overlay ${name}`);
    } catch (error) {
      console.warn(`Failed to parse ground overlay ${i}:`, error);
    }
  }

  console.log(`Total ground overlays parsed: ${groundOverlays.length}`);
  return groundOverlays;
}

/**
 * Helper function to get element text content
 */
function getElementTextContent(parent: any, tagName: string, attribute?: string): string | undefined {
  const elements = parent.getElementsByTagName(tagName);
  if (elements.length > 0) {
    const element = elements[0];
    if (attribute) {
      return element.getAttribute(attribute);
    }
    return element.textContent;
  }
  return undefined;
}

/**
 * Helper function to get element by tag name
 */
function getElement(parent: any, tagName: string): any | undefined {
  const elements = parent.getElementsByTagName(tagName);
  if (elements.length > 0) {
    return elements[0];
  }
  return undefined;
}

/**
 * Processes KMZ files by extracting and parsing the contained KML and images
 */
export async function processKmzFile(file: File): Promise<ProcessedGeoFile[]> {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    const results: ProcessedGeoFile[] = [];

    // Extract all images first
    const images = await extractImagesFromKmz(zipContent);

    // Look for KML files in the KMZ archive
    for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
      if (filename.toLowerCase().endsWith('.kml') && !zipEntry.dir) {
        try {
          const kmlContent = await zipEntry.async('text');
          const parser = new DOMParser();
          const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');

          // Check for parsing errors
          const parserError = getElement(kmlDoc, 'parsererror');
          if (parserError) {
            console.warn(`Error parsing KML file ${filename}:`, parserError.textContent);
            continue;
          }

          // Parse ground overlays before converting to GeoJSON
          const groundOverlays = parseGroundOverlays(kmlDoc, images);

          const geoJson = kml(kmlDoc);

          if (geoJson && geoJson.features && geoJson.features.length > 0) {
            results.push({
              name: `${file.name}/${filename}`,
              data: geoJson,
              type: 'kmz',
              images,
              groundOverlays
            });
          } else if (groundOverlays.length > 0) {
            // Even if no regular features, include if there are ground overlays
            results.push({
              name: `${file.name}/${filename}`,
              data: { type: 'FeatureCollection', features: [] },
              type: 'kmz',
              images,
              groundOverlays
            });
          }
        } catch (error) {
          console.error(`Error processing KML file ${filename} from KMZ:`, error);
        }
      }
    }

    if (results.length === 0) {
      throw new Error('No valid KML files found in KMZ archive');
    }

    return results;
  } catch (error) {
    console.error('Error processing KMZ file:', error);
    throw new Error(`Failed to process KMZ file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Processes various geo file formats (KML, KMZ, GeoJSON)
 */
export async function processGeoFile(file: File): Promise<ProcessedGeoFile[]> {
  if (!file) {
    throw new Error("No file provided.");
  }
  if (!file.name) {
    throw new Error("File has no name property.");
  }
  const fileName = file.name.toLowerCase();

  try {
    if (fileName.endsWith('.kmz')) {
      return await processKmzFile(file);
    } else if (fileName.endsWith('.kml')) {
      const fileContent = await file.text();
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(fileContent, 'text/xml');

      // Check for parsing errors
      const parserError = getElement(kmlDoc, 'parsererror');
      if (parserError) {
        throw new Error(`Invalid KML file: ${parserError.textContent}`);
      }

      // Extract image URLs from KML content
      const imageUrls: ProcessedImage[] = [];
      const iconElements = kmlDoc.getElementsByTagName('Icon');
      for (let i = 0; i < iconElements.length; i++) {
        const icon = iconElements[i];
        const href = getElementTextContent(icon, 'href');
        if (href) {
          imageUrls.push({
            name: href,
            url: href,
            blob: new Blob() // Placeholder, not used for KML
          });
        }
      }

      // Parse ground overlays with extracted image URLs
      const groundOverlays = parseGroundOverlays(kmlDoc, imageUrls);

      const geoJson = kml(kmlDoc);

      if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
        if (groundOverlays.length === 0) {
          throw new Error('KML file contains no valid features or ground overlays');
        }
      }

      return [{
        name: file.name,
        data: geoJson || { type: 'FeatureCollection', features: [] },
        type: 'kml',
        groundOverlays
      }];
    } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
      const fileContent = await file.text();
      const geoJson = JSON.parse(fileContent);

      // Validate GeoJSON structure
      if (!geoJson || typeof geoJson !== 'object') {
        throw new Error('Invalid GeoJSON format');
      }

      if (!geoJson.features && geoJson.type !== 'Feature' && geoJson.type !== 'FeatureCollection') {
        throw new Error('File does not contain valid GeoJSON features');
      }

      return [{
        name: file.name,
        data: geoJson,
        type: 'geojson'
      }];
    } else {
      throw new Error('Unsupported file format. Please use KML, KMZ, or GeoJSON files.');
    }
  } catch (error) {
    console.error(`Error processing geo file ${file.name}:`, error);
    throw error;
  }
}

/**
 * Validates if a file is a supported geo format
 */
export function isValidGeoFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  const supportedExtensions = ['.kml', '.kmz', '.geojson', '.json'];
  return supportedExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Gets the appropriate MIME types for geo file input
 */
export function getGeoFileMimeTypes(): string {
  return '.kml,.kmz,.geojson,.json,application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz,application/geo+json';
}

/**
 * Cleanup function to revoke blob URLs when no longer needed
 */
export function cleanupImageUrls(images: ProcessedImage[]): void {
  images.forEach(image => {
    URL.revokeObjectURL(image.url);
  });
}
