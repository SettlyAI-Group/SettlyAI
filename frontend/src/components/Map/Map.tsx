import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import type { IApiSuburbData } from '@/interfaces/map';
import { fetchGeocodingApi, getSuburbFromDb } from '@/api/mapApi';

const SectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '400px',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up(480)]: {
    height: '600px',
  },
}));

const mapPin = Leaflet.divIcon({
  html: renderToStaticMarkup(<PersonPinCircleIcon />),
  className: 'mui-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoData, setGeoData] = useState<IApiSuburbData | null>(null);
  // const userClick = () => {
  //   useMapEvents({ click: e => setPosition(e.latlng) });
  //   return null;
  // };

  const zoomMap = () => {
    const map = useMap();
    useEffect(() => {
      map.scrollWheelZoom.enable();
    }, [map]);
    return null;
  };

  const UserClickMapData = ({ onPick }: { onPick?: (lat: number, lng: number) => void }) => {
    useMapEvents({
      click: e => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        onPick?.(lat, lng);
      },
    });
    return null;
  };

  useEffect(() => {
    if (!position) return;
    (async () => {
      try {
        const geoApiData = await fetchGeocodingApi(position.lat, position.lng);
        setGeoData(geoApiData);
        console.log(`Geocode data: `, geoApiData);
        const backendData = await getSuburbFromDb(geoApiData);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    })();
    return;
  }, [position]);

  return (
    <SectionContainer>
      <MapContainer style={{ height: '80%', width: '60%' }} center={[-37.8136, 144.9631]} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <UserClickMapData />
        {position && <Marker position={position} icon={mapPin} />}
      </MapContainer>
    </SectionContainer>
  );
};

export default Map;
