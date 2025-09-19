import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import type { IApiSuburbData } from '@/interfaces/map';
import { fetchGeocodingApi, getSuburbFromDb } from '@/api/mapApi';
import { useAppDispatch } from '@/redux/hooks';
import { setSelectedSuburb, clearSelectedSuburb } from '@/redux/mapSuburbSlice';

const SectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '400px',
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: theme.spacing(8),
  paddingBlock: theme.spacing(4),

  [theme.breakpoints.up(480)]: {
    height: '600px',
    paddingInline: theme.spacing(10),
    paddingBlock: theme.spacing(6),
  },
}));

const LeafletMapContainer = styled(MapContainer)(({ theme }) => ({
  height: '100%',
  width: '100%',
}));

const mapPin = Leaflet.divIcon({
  html: renderToStaticMarkup(<PersonPinCircleIcon style={{ color: '#7B61FF', fontSize: 36 }} />),
  className: 'mui-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const melbourneGeoData: [number, number] = [-37.8136, 144.9631];

const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoData, setGeoData] = useState<IApiSuburbData | null>(null);
  const dispatch = useAppDispatch();

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

        const backendData = await getSuburbFromDb(geoApiData);
        if (backendData) {
          const { suburb, state, postcode } = backendData;
          dispatch(setSelectedSuburb({ suburb, state, postcode }));
        } else {
          dispatch(clearSelectedSuburb());
        }
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    })();
    return;
  }, [position]);

  return (
    <SectionContainer>
      <LeafletMapContainer center={melbourneGeoData} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <UserClickMapData />
        {position && <Marker position={position} icon={mapPin} />}
      </LeafletMapContainer>
    </SectionContainer>
  );
};

export default Map;
