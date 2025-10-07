import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { fetchGeocodingApi, getSuburbFromDb } from '@/api/mapApi';
import { useAppDispatch } from '@/redux/hooks';
import { setSelectedSuburb, clearSelectedSuburb } from '@/redux/mapSuburbSlice';

const SectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '520px',
  justifyContent: 'center',
  alignItems: 'center',
  paddingInline: theme.spacing(8),
  paddingBlock: theme.spacing(4),

  [theme.breakpoints.up(480)]: {
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

const MapZoomHandler = () => {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.enable();
  }, [map]);
  return null;
};

const Map = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const dispatch = useAppDispatch();

  const UserGeoData = ({ onPick }: { onPick?: (lat: number, lng: number) => void }) => {
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

    let callIsCancelled = false;

    (async () => {
      try {
        const rawSuburbData = await fetchGeocodingApi(position.lat, position.lng);

        if (callIsCancelled) return;
        const suburbOverview = await getSuburbFromDb(rawSuburbData);

        if (callIsCancelled) return;
        if (suburbOverview) {
          dispatch(setSelectedSuburb(suburbOverview));
        } else {
          dispatch(clearSelectedSuburb());
        }
      } catch {
        dispatch(clearSelectedSuburb());
      }
    })();

    return () => {
      callIsCancelled = true;
    };
  }, [position, dispatch]);

  return (
    <SectionContainer>
      <LeafletMapContainer center={melbourneGeoData} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Ac OpenStreetMap contributors"
        />
        <MapZoomHandler />
        <UserGeoData />
        {position && <Marker position={position} icon={mapPin} />}
      </LeafletMapContainer>
    </SectionContainer>
  );
};

export default Map;
