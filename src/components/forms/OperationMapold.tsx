import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import { kml } from '@tmcw/togeojson';
import { MapTypeSelector } from '../MapTypeSelector';
import 'leaflet/dist/leaflet.css';

interface OperationMapProps {
  geoFiles: File[];
}

interface LayerData {
  id: string;
  name: string;
  data: any;
  color: string;
}

export function OperationMap({ geoFiles }: OperationMapProps) {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [mapBounds, setMapBounds] = useState<[number, number][]>([[46.227638, 2.213749]]);
  const [zoom, setZoom] = useState(5);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const colors = [
    '#3388ff', '#ff4444', '#33cc33', '#ff9900', '#9933cc',
    '#00ccff', '#ff66b2', '#99cc00', '#ff8533', '#6666ff'
  ];

  const onEachFeature = useCallback((feature: any, layer: any) => {
    if (feature.properties?.description) {
      layer.bindPopup(feature.properties.description);
    }
  }, []);

  useEffect(() => {
    const loadFiles = async () => {
      const newLayers: LayerData[] = [];
      let allBounds: [number, number][] = [];

      for (let i = 0; i < geoFiles.length; i++) {
        try {
          const file = geoFiles[i];
          const fileContent = await file.text();
          let geoJson;

          if (file.name.endsWith('.kml')) {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(fileContent, 'text/xml');
            geoJson = kml(kmlDoc);
          } else {
            geoJson = JSON.parse(fileContent);
          }

          if (geoJson && geoJson.features) {
            geoJson.features.forEach((feature: any) => {
              if (feature.geometry && feature.geometry.coordinates) {
                const coords = feature.geometry.coordinates;
                if (Array.isArray(coords)) {
                  if (feature.geometry.type === 'Point') {
                    allBounds.push([coords[1], coords[0]]);
                  } else if (feature.geometry.type === 'LineString') {
                    coords.forEach((coord: number[]) => {
                      allBounds.push([coord[1], coord[0]]);
                    });
                  } else if (feature.geometry.type === 'Polygon') {
                    coords[0].forEach((coord: number[]) => {
                      allBounds.push([coord[1], coord[0]]);
                    });
                  }
                }
              }
            });

            newLayers.push({
              id: `layer-${i}`,
              name: file.name,
              data: geoJson,
              color: colors[i % colors.length]
            });
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du fichier ${geoFiles[i].name}:`, error);
        }
      }

      if (allBounds.length > 0) {
        setMapBounds(allBounds);
        setZoom(12);
      }

      setLayers(newLayers);
    };

    loadFiles();
  }, [geoFiles]);

  const center = mapBounds.length > 1
    ? ([
        mapBounds.reduce((sum, coord) => sum + coord[0], 0) / mapBounds.length,
        mapBounds.reduce((sum, coord) => sum + coord[1], 0) / mapBounds.length,
      ] as [number, number])
    : ([46.227638, 2.213749] as [number, number]);

  return (
    <div className="space-y-2 mt-4">
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
              <LayersControl.Overlay
                key={layer.id}
                name={layer.name}
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
            ))}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}
