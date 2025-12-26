// components/GoogleMapSelector.tsx
import React, { useCallback, useRef, useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';
import { googleMapKey } from '@/common/constants';
import { Button } from './button';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = { lat: -12.0464, lng: -77.0428, address: '' }; // Lima, Perú

interface Props {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  initalLocation?: [number, number];
}

const GoogleMapSelector: React.FC<Props> = ({ onLocationSelect, initalLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(() => {
    return initalLocation
      ? { lat: initalLocation[0], lng: initalLocation[1], address: '' }
      : defaultCenter;
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapKey,
    libraries: ['places'], // 👈 importante
  });

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng, address: '' });
      // onLocationSelect(lat, lng);
    },
    []
  );

  const onLoadMap = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (initalLocation) {
        map.setCenter({
          lat: initalLocation[0],
          lng: initalLocation[1],
        });
      }
    },
    [initalLocation]
  );

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry || !place.geometry.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMarkerPosition({ lat, lng, address: place.formatted_address || '' });
    mapRef.current?.panTo({ lat, lng });
    console.log('Ubicación seleccionada:', { lat, lng, place });
    // onLocationSelect(lat, lng);
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div>
      {/* Input para el Autocomplete */}
      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar ubicación"
          className="w-full mb-2 px-4 py-2 border rounded"
        />
      </Autocomplete>

      {/* Mapa de Google */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={13}
        onClick={onMapClick}
        onLoad={onLoadMap}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
      <div className='flex flex-row justify-start items-end mt-5'>
        <span className='text-start w-full'>Ubicación seleccionada: {markerPosition.lat}, {markerPosition.lng}</span>

        {onLocationSelect && <div className="flex justify-end w-full sm:w-1/4  mt-5">
          <Button type="submit" onClick={() => onLocationSelect(markerPosition.lat, markerPosition.lng,markerPosition.address)}>Aceptar</Button>
        </div>}
      </div>

    </div>
  );
};

export default GoogleMapSelector;
