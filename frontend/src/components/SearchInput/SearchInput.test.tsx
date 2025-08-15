import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchInput from './SearchInput';
import theme from '@/styles/theme';

// Mock the theme for testing
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('SearchInput', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders with default placeholder', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Enter your search term';
    renderWithTheme(<SearchInput placeholder={customPlaceholder} onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test search' } });
    
    expect(input).toHaveValue('test search');
  });

  it('calls onSearch with input value when search button is clicked', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'suburb search' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('suburb search');
  });

  it('calls onSearch with empty string when no input is entered', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('maintains input value after search', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'persistent search' } });
    fireEvent.click(searchButton);
    
    expect(input).toHaveValue('persistent search');
    expect(mockOnSearch).toHaveBeenCalledWith('persistent search');
  });

  it('handles multiple search calls', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'first search' } });
    fireEvent.click(searchButton);
    
    fireEvent.change(input, { target: { value: 'second search' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledTimes(2);
    expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'first search');
    expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'second search');
  });

  it('renders search icon', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    // The search icon should be present in the input field
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderWithTheme(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    expect(input).toHaveClass('MuiInputBase-input');
    expect(searchButton).toHaveClass('MuiButton-root');
  });
}); 