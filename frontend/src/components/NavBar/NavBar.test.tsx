// src/components/NavBar/NavBar.test.tsx
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import NavBar from './NavBar';

beforeAll(() => {
  window.matchMedia ||= () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
});

function renderNavBar() {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter initialEntries={['/']}>
        <NavBar />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('NavBar (static links, no mapping)', () => {
  it('renders expected links with correct hrefs', () => {
    renderNavBar();

    // brand
    expect(screen.getByRole('link', { name: /settly ai/i })).toHaveAttribute('href', '/');

    // center links
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /features/i })).toHaveAttribute('href', '/features');
    expect(screen.getByRole('link', { name: /ask robot/i })).toHaveAttribute('href', '/chat');
    expect(screen.getByRole('link', { name: /favourites/i })).toHaveAttribute('href', '/favourites');

    // right actions
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /join|registration/i })).toHaveAttribute('href', '/registration');
  });
});
