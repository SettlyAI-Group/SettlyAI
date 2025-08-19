import '@testing-library/jest-dom';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import HeroSection from './HeroSection';

const SUGGESTION_STORAGE_KEY = 'settly:selectedSuggestion';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const DEFAULT_STATE = {
  explore: { query: '' },
  searchSuggest: { suggestions: [], loading: false, error: null },
};

function renderWithProviders(ui: JSX.Element, preloaded: Partial<typeof DEFAULT_STATE> = {}) {
  const initialState = {
    ...DEFAULT_STATE,
    explore: { ...DEFAULT_STATE.explore, ...(preloaded.explore ?? {}) },
    searchSuggest: { ...DEFAULT_STATE.searchSuggest, ...(preloaded.searchSuggest ?? {}) },
    ...preloaded,
  };

  const reducer = (state = initialState, action: any) => {
    if (action?.type === 'explore/setQuery') {
      return { ...state, explore: { ...(state.explore ?? {}), query: action.payload } };
    }
    return state;
  };

  const store = configureStore({
    reducer,
    middleware: getDefault =>
      getDefault({
        thunk: true,
        serializableCheck: false,
        immutableCheck: false,
      }),
  });

  const theme = createTheme();

  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={ui} />
              <Route path="/chat" element={<div data-testid="chat-page" />} />
              <Route path="/explore/:location" element={<div data-testid="explore-page" />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
    store,
  };
}

describe('HeroSection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debounces input and only dispatches the latest thunk after 300ms', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<HeroSection />);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 's');
    await user.type(input, 'y');
    await user.type(input, 'd');

    expect(dispatchSpy.mock.calls.some(c => typeof c[0] === 'function')).toBe(false);

    await sleep(320);

    const thunkCalls = dispatchSpy.mock.calls.filter(c => typeof c[0] === 'function');
    expect(thunkCalls.length).toBe(1);
  });

  it('routes CTAs: Chat and Explore', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      SUGGESTION_STORAGE_KEY,
      JSON.stringify({
        id: '1',
        address: '123 Fake St',
        name: 'Testville',
        state: 'NSW',
        postcode: '2000',
        label: '123 Fake St, Testville, NSW 2000',
      })
    );

    renderWithProviders(<HeroSection />, { explore: { query: 'syd' } });
    const chatBtn = screen.getByRole('button', { name: /chat/i });
    await user.click(chatBtn);
    expect(screen.getByTestId('chat-page')).toBeInTheDocument();

    renderWithProviders(<HeroSection />, { explore: { query: 'syd' } });
    const exploreBtn = screen.getByRole('button', { name: /explore/i });
    await user.click(exploreBtn);
    expect(screen.getByTestId('explore-page')).toBeInTheDocument();
  });
});
