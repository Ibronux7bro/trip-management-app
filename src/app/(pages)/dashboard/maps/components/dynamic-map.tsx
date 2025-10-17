import React, { useEffect, MutableRefObject } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface DynamicMapProps {
  center: [number, number];
  zoom: number;
  markerPosition: [number, number];
  popupContent: string;
  onMapReady?: () => void;
  mapRef?: MutableRefObject<L.Map | null>;
  path?: Array<{ lat: number; lng: number }>;
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  center,
  zoom,
  markerPosition,
  popupContent,
  onMapReady,
  mapRef,
  path,
}) => {
  useEffect(() => {
    // Fix for default marker icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Force map resize after a small delay
    const timer = setTimeout(() => {
      if (mapRef?.current) {
        mapRef.current.invalidateSize();
        mapRef.current.setView(center, zoom);
        if (onMapReady) onMapReady();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [center, zoom, onMapReady, mapRef]);

  const handleMapMount = (map: L.Map) => {
    if (mapRef) {
      mapRef.current = map;
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="!absolute inset-0"
      ref={handleMapMount}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Array.isArray(path) && path.length > 1 && (
        <Polyline positions={path.map((p) => [p.lat, p.lng])} color="#3b82f6" weight={4} />
      )}
      <Marker position={markerPosition}>
        <Popup>{popupContent}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default DynamicMap;
