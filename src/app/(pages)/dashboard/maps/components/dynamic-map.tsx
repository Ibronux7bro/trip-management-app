import React, { useEffect, MutableRefObject, useState, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// مكون مساعد للتحكم في حجم الخريطة تلقائياً
const MapResizer: React.FC<{ mapRef?: MutableRefObject<L.Map | null> }> = ({ mapRef }) => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // تهيئة الحجم الأولي
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);

  return null;
};

const DynamicMap: React.FC<DynamicMapProps> = ({
  center,
  zoom,
  markerPosition,
  popupContent,
  onMapReady,
  mapRef,
  path,
}) => {
  const [isMounted, setIsMounted] = useState(false);

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

    setIsMounted(true);
  }, []);

  const handleMapMount = useCallback((map: L.Map | null) => {
    if (!map) return;
    
    if (mapRef) {
      mapRef.current = map;
    }
    
    // تأخير بسيط لضمان تحميل الخريطة بشكل صحيح
    setTimeout(() => {
      if (map) {
        try {
          map.invalidateSize();
          if (onMapReady) onMapReady();
        } catch (error) {
          console.error('Error invalidating map size:', error);
        }
      }
    }, 300);
  }, [mapRef, onMapReady]);

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base animate-pulse">جاري تحميل الخريطة...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
        className="absolute inset-0 rounded-lg"
        ref={handleMapMount}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapResizer mapRef={mapRef} />
        {Array.isArray(path) && path.length > 1 && (
          <Polyline 
            positions={path.map((p) => [p.lat, p.lng])} 
            color="#3b82f6" 
            weight={4} 
            opacity={0.7}
          />
        )}
        <Marker position={markerPosition}>
          <Popup>{popupContent}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DynamicMap;