import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

// --- Mock API used by Map.tsx ------------------------------------
vi.mock('@/api/mapApi', () => ({
  fetchGeocodingApi: vi.fn(async () => ({
    suburb: 'Richmond',
    state: 'VIC',
    postcode: '3121',
  })),
  getSuburbFromDb: vi.fn(async (p: IApiSuburbData) => ({ ...p })),
}));

// --- Mock react-leaflet and synthesize exactly one click ----------
let mockFired = false;
vi.mock('react-leaflet', async () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    Marker: ({ position }: { position: [number, number] }) => (
      <div data-testid="marker">{JSON.stringify(position)}</div>
    ),
    useMap: () => ({ scrollWheelZoom: { enable: vi.fn() } }),
    useMapEvents: (handlers: { click: (event: { latlng: { lat: number; lng: number } }) => void }) => {
      if (!mockFired) {
        mockFired = true;
        // Use requestAnimationFrame to ensure the component is fully mounted
        requestAnimationFrame(() => {
          handlers.click({ latlng: { lat: -37.8136, lng: 144.9631 } });
        });
      }
      return null;
    },
  };
});

// --- Imports after mocks ------------------------------------------
import { store } from '@/redux/store';
import Map from '../Map';
import { fetchGeocodingApi, getSuburbFromDb } from '@/api/mapApi';
import type { IApiSuburbData } from '@/interfaces/map';

describe('Map Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFired = false; // Reset the mock fired flag
  });

  describe('Successful geocoding flow', () => {
    it('dispatches selected suburb and renders a marker', async () => {
      render(
        <Provider store={store}>
          <Map />
        </Provider>
      );

      // marker appears after the synthetic click
      await waitFor(() => expect(screen.getByTestId('marker')).toBeInTheDocument());

      // async chain ran at least once
      await waitFor(() => expect(fetchGeocodingApi).toHaveBeenCalled());
      await waitFor(() => expect(getSuburbFromDb).toHaveBeenCalled());

      // Redux now contains the mocked payload
      await waitFor(() =>
        expect(store.getState().mapSuburb).toEqual({
          suburb: 'Richmond',
          state: 'VIC',
          postcode: '3121',
        })
      );
    });
  });

  describe('Error handling', () => {
    it('handles API errors gracefully', async () => {
      vi.mocked(fetchGeocodingApi).mockRejectedValue(new Error('API Error'));

      render(
        <Provider store={store}>
          <Map />
        </Provider>
      );

      // Wait for the component to process the error
      await waitFor(() => expect(fetchGeocodingApi).toHaveBeenCalled());

      // Component should still render without crashing
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });
  });
});
