import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import ExplorePage from './ExplorePage';
import { SUGGESTION_STORAGE_KEY } from '../../utils/storage';

function renderAt(path: string) {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/explore/:location" element={<ExplorePage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

it('renders the saved selection label from localStorage', () => {
  const payload = {
    label: '123 Fake St, Testville, NSW 2000',
    option: {
      name: 'Testville',
      address: '123 Fake St',
      state: 'NSW',
      postcode: '2000',
    },
  };
  localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify(payload));
  renderAt('/explore/:location');
  expect(screen.getByText(/123 Fake St, Testville, NSW 2000/i)).toBeInTheDocument();
});

it('does not crash and renders gracefully when no saved selection exists', () => {
  renderAt('/explore/:location');
  expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
});

it('ignores invalid JSON in storage (no crash)', () => {
  localStorage.setItem(SUGGESTION_STORAGE_KEY, '{not: "json"');

  renderAt('/explore/anywhere');

  expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
});
