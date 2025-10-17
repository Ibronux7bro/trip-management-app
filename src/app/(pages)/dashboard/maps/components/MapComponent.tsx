import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useRef, MutableRefObject } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { useTranslation } from '@/app/providers/translation-provider';

function LoadingMap() {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
        <p className="text-muted-foreground">{t('common.loading') || 'Loading map...'}</p>
      </div>
    </div>
  );
}

const DynamicMap = dynamic(() => import('./dynamic-map'), {
  ssr: false,
  loading: () => <LoadingMap />,
});

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  markerPosition: [number, number];
  popupContent: string;
  onMapReady?: () => void;
  mapRef?: MutableRefObject<LeafletMap | null>;
  path?: Array<{ lat: number; lng: number }>;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  markerPosition,
  popupContent,
  onMapReady,
  mapRef,
  path,
}) => {
  const internalMapRef = useRef<LeafletMap | null>(null);
  const actualMapRef = mapRef || internalMapRef;

  return (
    <DynamicMap
      center={center}
      zoom={zoom}
      markerPosition={markerPosition}
      popupContent={popupContent}
      onMapReady={onMapReady}
      mapRef={actualMapRef}
      path={path}
    />
  );
};

export default MapComponent;
