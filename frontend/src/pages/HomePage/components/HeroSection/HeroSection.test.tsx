// src/pages/Home/components/HeroSection.test.tsx
import '@testing-library/jest-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// --- 1) Mock router navigate BEFORE importing SUT ---
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- 2) Stub SearchBar BEFORE importing SUT (matches SUT import path) ---
const selectedSydney = {
  suburbId: 101,
  address: 'Sydney (CBD)',
  name: 'Sydney',
  state: 'NSW',
  postcode: '2000',
};

vi.mock('../../../../components/Search/SearchBar', () => ({
  default: ({ handleSelected, handleGetReport }: any) => (
    <div data-testid="stub-searchbar">
      <button onClick={() => handleSelected(selectedSydney)}>Select Sydney</button>
      <button onClick={handleGetReport}>Get my report</button>
    </div>
  ),
}));

// --- 3) Now import test utils + SUT ---
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from './HeroSection';

// harness
function renderHero() {
  const theme = createTheme();
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider theme={theme}>
        <HeroSection />
      </ThemeProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockReset();
});

describe('HeroSection', () => {
  it('shows Explore as a link to /explore when nothing is selected', async () => {
    renderHero();

    // Find the Explore CTA (MUI Button rendered as <a> via RouterLink)
    const exploreText = /Not sure where to begin\? Explore suburbs that match your lifestyle/i;
    const exploreCta = screen.getByText(exploreText);
    const linkEl = exploreCta.closest('a') as HTMLAnchorElement;

    expect(linkEl).toBeInTheDocument();
    // MemoryRouter renders href as "/explore"
    expect(linkEl).toHaveAttribute('href', '/explore');
  });

  it('updates Explore link when a suburb is selected via SearchBar', async () => {
    const user = userEvent.setup();
    renderHero();

    // Trigger the stubbed selection
    await user.click(screen.getByRole('button', { name: /select sydney/i }));

    const exploreText = /Not sure where to begin\? Explore suburbs that match your lifestyle/i;
    const exploreCta = screen.getByText(exploreText);
    const linkEl = exploreCta.closest('a') as HTMLAnchorElement;

    expect(linkEl).toBeInTheDocument();
    const href = linkEl.getAttribute('href') || '';

    // Should now be an encoded explore path (we keep the assertion resilient to exact slug rules)
    expect(href).toMatch(/explore/i);
    expect(href).not.toBe('/explore');
    expect(href).toMatch(/sydney/i); // slug or encoded text containing sydney is fine
  });

  it('navigates to a report path that contains the selected suburbId when clicking "Get my report"', async () => {
    const user = userEvent.setup();
    renderHero();

    // Select first, so HeroSection has a suburbId in state
    await user.click(screen.getByRole('button', { name: /select sydney/i }));

    // Click the delegated "Get my report" (wired through stub SearchBar)
    await user.click(screen.getByRole('button', { name: /get my report/i }));

    expect(mockNavigate).toHaveBeenCalled();

    // Be robust to either string or object navigate calls
    const [arg] = mockNavigate.mock.calls.at(-1)!;
    if (typeof arg === 'string') {
      expect(arg).toMatch(/suburb/i);
      expect(arg).toMatch(/101/); // selectedSydney.suburbId
    } else {
      const payload = JSON.stringify(arg);
      expect(payload).toMatch(/suburb/i);
      expect(payload).toMatch(/101/);
    }
  });
});
