import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

//Creating default market img for Leaflet map
Leaflet.Icon.Default.mergeOptions({ iconRetinaUrl: icon2x, iconUrl: icon, shadowUrl: shadow });

const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const userClick = () => {
    useMapEvents({ click: e => setPosition(e.latlng) });
    return null;
  };

  const scrollMap = () => {
    const map = useMap();
    useEffect(() => {
      map.scrollWheelZoom.enable();
    }, [map]);
    return null;
  };

  return (
    <Box sx={{ display: 'flex', height: { xs: 360, md: 480 }, width: '100%', mt: 2, justifyContent: 'center' }}>
      <MapContainer style={{ height: '100%', width: '80%' }} center={[-33.8688, 151.2093]} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
      </MapContainer>
    </Box>
  );
};

export default Map;
