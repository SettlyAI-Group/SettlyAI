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

const INITIAL_VIEW = { center: melbourneGeoData as [number, number], zoom: 11 };

const ResetViewControl = () => {
  const map = useMap();

  useEffect(() => {
    const Ctl = Leaflet.Control.extend({
      onAdd() {
        const wrap = Leaflet.DomUtil.create('div', 'leaflet-bar');
        const btn = Leaflet.DomUtil.create('a', '', wrap);
        btn.innerHTML = '⟲';
        btn.title = 'Reset view';
        btn.href = '#';
        Leaflet.DomEvent.on(btn, 'click', e => {
          Leaflet.DomEvent.preventDefault(e);
          Leaflet.DomEvent.stop(e);
          map.setView(INITIAL_VIEW.center, INITIAL_VIEW.zoom);
        });
        return wrap;
      },
    });
    const ctl = new Ctl({ position: 'topleft' });
    map.addControl(ctl);
    return () => {
      map.removeControl(ctl);
    };
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

        //Stop the process when user click a new position before rawSuburbData is return
        if (callIsCancelled) return;
        const suburbData = await getSuburbFromDb(rawSuburbData);

        //Stop the process when user click a new position before backend is return
        if (callIsCancelled) return;
        if (suburbData) {
          const { suburb, state, postcode } = suburbData;
          dispatch(setSelectedSuburb({ suburb, state, postcode }));
        } else {
          dispatch(clearSelectedSuburb());
        }
      } catch (err) {
        console.error(`Error: ${err}`);
        dispatch(clearSelectedSuburb());
      }
    })();

    return () => {
      //Act as a clean up function in case user click a new position
      callIsCancelled = true;
    };
  }, [position, dispatch]);

  return (
    <SectionContainer>
      <LeafletMapContainer center={melbourneGeoData} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <UserGeoData />
        <ResetViewControl />
        {position && <Marker position={position} icon={mapPin} />}
      </LeafletMapContainer>
    </SectionContainer>
  );
};

export default Map;
