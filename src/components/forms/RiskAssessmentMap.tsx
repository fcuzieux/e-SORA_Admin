import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, ImageOverlay } from 'react-leaflet';
import { processGeoFile, ProcessedGeoFile, GroundOverlay, cleanupImageUrls } from '../../lib/kmzProcessor';
import { MapTypeSelector } from '../MapTypeSelector';
import 'leaflet/dist/leaflet.css';

interface RiskAssessmentMapProps {
  geoFiles: File[];
}

interface LayerData {
  id: string;
  name: string;
  data: any;
  color: string;
  type: 'kml' | 'kmz' | 'geojson';
  groundOverlays?: GroundOverlay[];
}

export function RiskAssessmentMap({ geoFiles }: RiskAssessmentMapProps) {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [mapBounds, setMapBounds] = useState<[number, number][]>([[46.227638, 2.213749]]);
  const [zoom, setZoom] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<any[]>([]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const colors = [
    '#3388ff', '#ff4444', '#33cc33', '#ff9900', '#9933cc',
    '#00ccff', '#ff66b2', '#99cc00', '#ff8533', '#6666ff'
  ];

  const onEachFeature = useCallback((feature: any, layer: any) => {
    if (feature.properties?.description) {
      layer.bindPopup(feature.properties.description);
    } else if (feature.properties?.name) {
      layer.bindPopup(feature.properties.name);
    }
  }, []);

  const extractBounds = useCallback((geoJson: any): [number, number][] => {
    const bounds: [number, number][] = [];
    
    if (!geoJson || !geoJson.features) return bounds;

    geoJson.features.forEach((feature: any) => {
      if (feature.geometry && feature.geometry.coordinates) {
        const coords = feature.geometry.coordinates;
        
        switch (feature.geometry.type) {
          case 'Point':
            if (Array.isArray(coords) && coords.length >= 2) {
              bounds.push([coords[1], coords[0]]);
            }
            break;
          case 'LineString':
            if (Array.isArray(coords)) {
              coords.forEach((coord: number[]) => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  bounds.push([coord[1], coord[0]]);
                }
              });
            }
            break;
          case 'Polygon':
            if (Array.isArray(coords) && coords[0]) {
              coords[0].forEach((coord: number[]) => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  bounds.push([coord[1], coord[0]]);
                }
              });
            }
            break;
          case 'MultiPolygon':
            if (Array.isArray(coords)) {
              coords.forEach((polygon: number[][][]) => {
                if (Array.isArray(polygon) && polygon[0]) {
                  polygon[0].forEach((coord: number[]) => {
                    if (Array.isArray(coord) && coord.length >= 2) {
                      bounds.push([coord[1], coord[0]]);
                    }
                  });
                }
              });
            }
            break;
        }
      }
    });

    return bounds;
  }, []);

  const extractGroundOverlayBounds = useCallback((groundOverlays: GroundOverlay[]): [number, number][] => {
    const bounds: [number, number][] = [];
    
    groundOverlays.forEach(overlay => {
      bounds.push([overlay.bounds.north, overlay.bounds.east]);
      bounds.push([overlay.bounds.south, overlay.bounds.west]);
      bounds.push([overlay.bounds.north, overlay.bounds.west]);
      bounds.push([overlay.bounds.south, overlay.bounds.east]);
    });

    return bounds;
  }, []);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Cleanup blob URLs when component unmounts
      processedImages.forEach(images => {
        if (images && images.length > 0) {
          cleanupImageUrls(images);
        }
      });
    };
  }, [processedImages]);

  useEffect(() => {
    const loadFiles = async () => {
      if (geoFiles.length === 0) {
        setLayers([]);
        setMapBounds([[46.227638, 2.213749]]);
        setZoom(5);
        setError(null);
        // Cleanup previous images
        processedImages.forEach(images => {
          if (images && images.length > 0) {
            cleanupImageUrls(images);
          }
        });
        setProcessedImages([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const newLayers: LayerData[] = [];
        const newProcessedImages: any[] = [];
        let allBounds: [number, number][] = [];
        let colorIndex = 0;

        for (const file of geoFiles) {
          try {
            const processedFiles = await processGeoFile(file);
            
            processedFiles.forEach((processedFile: ProcessedGeoFile) => {
              const fileBounds = extractBounds(processedFile.data);
              allBounds = [...allBounds, ...fileBounds];

              // Add bounds from ground overlays
              if (processedFile.groundOverlays && processedFile.groundOverlays.length > 0) {
                const overlayBounds = extractGroundOverlayBounds(processedFile.groundOverlays);
                allBounds = [...allBounds, ...overlayBounds];
              }

              newLayers.push({
                id: `layer-${colorIndex}`,
                name: processedFile.name,
                data: processedFile.data,
                color: colors[colorIndex % colors.length],
                type: processedFile.type,
                groundOverlays: processedFile.groundOverlays
              });

              // Store images for cleanup
              if (processedFile.images) {
                newProcessedImages.push(processedFile.images);
              }
              
              colorIndex++;
            });
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
            setError(prev => prev ? `${prev}\n${file.name}: ${fileError}` : `${file.name}: ${fileError}`);
          }
        }

        if (allBounds.length > 0) {
          setMapBounds(allBounds);
          setZoom(12);
        }

        setLayers(newLayers);
        setProcessedImages(newProcessedImages);
      } catch (error) {
        console.error('Error loading geo files:', error);
        setError('Erreur lors du chargement des fichiers géographiques');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [geoFiles, extractBounds, extractGroundOverlayBounds]);

  const center = mapBounds.length > 1
    ? ([
        mapBounds.reduce((sum, coord) => sum + coord[0], 0) / mapBounds.length,
        mapBounds.reduce((sum, coord) => sum + coord[1], 0) / mapBounds.length,
      ] as [number, number])
    : ([46.227638, 2.213749] as [number, number]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-sm text-red-700">
            <strong>Erreurs de traitement :</strong>
            <pre className="mt-1 whitespace-pre-wrap">{error}</pre>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-700 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Traitement des fichiers géographiques...
          </div>
        </div>
      )}

      <div className="space-y-2">
        <MapTypeSelector mapType={mapType} onChange={setMapType} />
        <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url={mapType === 'standard'
                ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
              attribution={mapType === 'standard'
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                : '&copy; <a href="https://www.arcgis.com/home/item.html?id=10df227921484f18b483e4ef61416222">Esri</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            />
            <LayersControl position="topright">
              {layers.map((layer) => (
                <React.Fragment key={layer.id}>
                  {/* Regular GeoJSON features */}
                  {layer.data.features && layer.data.features.length > 0 && (
                    <LayersControl.Overlay
                      name={`${layer.name} (${layer.type.toUpperCase()})`}
                      checked
                    >
                      <GeoJSON
                        data={layer.data}
                        style={() => ({
                          color: layer.color,
                          weight: 3,
                          opacity: 1,
                          fillColor: layer.color,
                          fillOpacity: 0.2
                        })}
                        onEachFeature={onEachFeature}
                      />
                    </LayersControl.Overlay>
                  )}

                  {/* Ground Overlays */}
                  {layer.groundOverlays && layer.groundOverlays.map((overlay, index) => (
                    <LayersControl.Overlay
                      key={`${layer.id}-overlay-${index}`}
                      name={`${overlay.name} (Ground Overlay)`}
                      checked
                    >
                      <ImageOverlay
                        url={overlay.imageUrl}
                        bounds={[
                          [overlay.bounds.south, overlay.bounds.west],
                          [overlay.bounds.north, overlay.bounds.east]
                        ]}
                        opacity={overlay.opacity || 1}
                      />
                    </LayersControl.Overlay>
                  ))}
                </React.Fragment>
              ))}
            </LayersControl>
          </MapContainer>
        </div>
      </div>

      {layers.length > 0 && (
        <div className="text-sm text-gray-600">
          <strong>Fichiers chargés :</strong>
          <ul className="mt-1 space-y-1">
            {layers.map((layer) => (
              <li key={layer.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: layer.color }}
                ></div>
                <span>{layer.name} ({layer.type.toUpperCase()})</span>
                {layer.groundOverlays && layer.groundOverlays.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {layer.groundOverlays.length} overlay{layer.groundOverlays.length > 1 ? 's' : ''}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
