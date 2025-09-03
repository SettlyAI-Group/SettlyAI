import '@testing-library/jest-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// 1) HOISTED mock BEFORE importing the component that uses it
vi.mock('@/api/searchSuggestApi', () => ({
  searchSuggestion: vi.fn(),
}));

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SearchBarModule from './SearchBar'; // import as namespace so we can spy on the hook
const SearchBar = (SearchBarModule as any).default as typeof import('./SearchBar').default;
import { searchSuggestion } from '@/api/searchSuggestApi';

// 2) Kill the debounce in tests (return value immediately)
beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(SearchBarModule, 'useDebouncedValue').mockImplementation((v: unknown) => v as any);
});

// ---- fixtures ----
const optionA = {
  suburbId: 101,
  address: 'Sydney (CBD)',
  name: 'Sydney',
  state: 'NSW',
  postcode: '2000',
};
const optionB = {
  suburbId: 202,
  address: 'Syddenham',
  name: 'Sydenham',
  state: 'NSW',
  postcode: '2044',
};

// test harness
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const theme = createTheme();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
}

describe('SearchBar', () => {
  it('opens suggestions only when input length ≥ 3 and renders mocked options', async () => {
    (searchSuggestion as unknown as vi.Mock).mockResolvedValue([optionA, optionB]);

    const onSelected = vi.fn();
    const onReport = vi.fn();

    renderWithProviders(<SearchBar selected={null} handleSelected={onSelected} handleGetReport={onReport} />);

    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'sy'); // < 3 chars
    expect(screen.queryByRole('listbox')).toBeNull();

    await userEvent.type(input, 'd'); // now 3 chars
    const listbox = await screen.findByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options.length).toBe(2);

    expect(within(listbox).getByRole('option', { name: /Sydney \(CBD\), Sydney, NSW 2000/i })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /Syddenham, Sydenham, NSW 2044/i })).toBeInTheDocument();
  });

  it('selecting an option calls handleSelected with the full DTO', async () => {
    (searchSuggestion as unknown as vi.Mock).mockResolvedValue([optionA, optionB]);

    const onSelected = vi.fn();
    const onReport = vi.fn();

    renderWithProviders(<SearchBar selected={null} handleSelected={onSelected} handleGetReport={onReport} />);

    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'syd');

    const listbox = await screen.findByRole('listbox');
    await userEvent.click(within(listbox).getByRole('option', { name: /Sydney \(CBD\), Sydney, NSW 2000/i }));

    expect(onSelected).toHaveBeenCalledTimes(1);
    expect(onSelected).toHaveBeenCalledWith(expect.objectContaining(optionA));
  });

  it('clicking "Get my report" calls handleGetReport', async () => {
    (searchSuggestion as unknown as vi.Mock).mockResolvedValue([]);

    const onSelected = vi.fn();
    const onReport = vi.fn();

    renderWithProviders(<SearchBar selected={null} handleSelected={onSelected} handleGetReport={onReport} />);

    const button = screen.getByRole('button', { name: /get my report/i });
    await userEvent.click(button);
    expect(onReport).toHaveBeenCalledTimes(1);
  });
});
