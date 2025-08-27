// src/components/Search/SuggestAutocomplete.test.tsx
import '@testing-library/jest-dom';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SuggestAutocomplete from './SearchBar';

function renderWithProviders(ui: React.ReactElement, preloadedState: any) {
  const reducer = (state = preloadedState, action: any) => {
    if (action?.type === 'explore/setQuery') {
      return { ...state, explore: { ...(state.explore ?? {}), query: action.payload } };
    }
    return state;
  };

  const store = configureStore({
    reducer,
  });

  const theme = createTheme();
  const utils = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>
  );
  return { ...utils, store };
}

const optionA = { id: '1', address: '123 Fake St', name: 'Testville', state: 'NSW', postcode: '2000' };
const optionB = { id: '2', address: '456 Real Rd', name: 'Sampletown', state: 'NSW', postcode: '2001' };

let setItemSpy: any;

beforeEach(() => {
  vi.useRealTimers();
  setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});
});

afterEach(() => {
  setItemSpy.mockRestore();
  vi.restoreAllMocks();
});

describe('SuggestAutocomplete', () => {
  it('opens on focus when query length >= 3 and shows server options', async () => {
    const preloaded = {
      explore: { query: 'syd' },
      searchSuggest: { suggestions: [optionA, optionB], loading: false, error: null },
    };

    renderWithProviders(<SuggestAutocomplete />, preloaded);

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: /123 Fake St, Testville, NSW 2000/i })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /456 Real Rd, Sampletown, NSW 2001/i })).toBeInTheDocument();
  });

  it('selecting an option writes to localStorage (persists selection)', async () => {
    const preloaded = {
      explore: { query: 'syd' },
      searchSuggest: { suggestions: [optionA, optionB], loading: false, error: null },
    };

    renderWithProviders(<SuggestAutocomplete />, preloaded);

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const listbox = await screen.findByRole('listbox');
    await userEvent.click(within(listbox).getByRole('option', { name: /123 Fake St, Testville, NSW 2000/i }));

    expect(setItemSpy).toHaveBeenCalledWith('settly:selectedSuggestion', expect.any(String));
  });

  it('typing dispatches explore/setQuery when length >= 3', async () => {
    const preloaded = {
      explore: { query: '' },
      searchSuggest: { suggestions: [], loading: false, error: null },
    };

    const { store } = renderWithProviders(<SuggestAutocomplete />, preloaded);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'syd');

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'explore/setQuery', payload: 'syd' }));
  });
});
