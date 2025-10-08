import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExportPdfButton from './ExportPdfButton';
import { exportSuburbReport } from '@/api/exportApi';


vi.mock('@/api/exportApi', () => ({
  exportSuburbReport: vi.fn(),
}));


vi.mock('@/components/GlobalButton', () => ({
  default: ({ children, onClick, disabled, startIcon, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {startIcon}
      {children}
    </button>
  ),
}));

const mockExportSuburbReport = vi.mocked(exportSuburbReport);

// Mock data that matches the structure expected by ExportPdfButton
const mockFormattedData = {
  suburbBasicInfo: {
    name: 'Test Suburb',
    state: 'VIC',
    postcode: '3000',
  },
  livability: { score: 85 },
  incomeEmployment: { medianIncome: 75000 },
  safetyScores: [{ type: 'Crime', score: 8 }],
};

// Mock results array that matches useQueries structure
const mockResults = [
  { data: mockFormattedData.suburbBasicInfo }, // SuburbBasicInfo
  { data: null }, // demandAndDev
  { data: mockFormattedData.livability }, // livability
  { data: { medianPrice: 500000 } }, // housingMarket
  { data: mockFormattedData.incomeEmployment }, // incomeEmployment
  { data: mockFormattedData.safetyScores }, // safetyScores
];

describe('ExportPdfButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test basic rendering functionality
  it('renders export button with correct text', () => {
    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
      />
    );

    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });

  // Test loading state during export process
  it('shows loading state when exporting', async () => {
    // Mock a promise that never resolves to simulate loading state
    mockExportSuburbReport.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeInTheDocument();
    });
  });

  // Test that the correct payload is sent to the export API
  it('calls export API with correct payload', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    mockExportSuburbReport.mockResolvedValue({
      blob: mockBlob,
      filename: 'test-report.pdf',
    });

    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(mockExportSuburbReport).toHaveBeenCalledWith({
        suburbId: 1,
        suburbName: 'Test Suburb',
        state: 'VIC',
        postcode: '3000',
        housingMarket: { medianPrice: 500000 },
        livability: { score: 85 },
        incomeEmployment: { medianIncome: 75000 },
        safetyScores: [{ type: 'Crime', score: 8 }],
        generatedAtUtc: expect.any(String),
        summary: 'Comprehensive suburb report for Test Suburb, VIC 3000',
        metrics: {},
        charts: [],
        options: {
          includeCharts: true,
          includeSummary: true,
        },
      });
    });
  });

  // Test success callback is called when export completes successfully
  it('calls onSuccess callback when export succeeds', async () => {
    const onSuccess = vi.fn();
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    mockExportSuburbReport.mockResolvedValue({
      blob: mockBlob,
      filename: 'test-report.pdf',
    });

    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('test-report.pdf');
    });
  });

  // Test error callback is called when export fails
  it('calls onError callback when export fails', async () => {
    const onError = vi.fn();
    const error = new Error('Export failed');
    mockExportSuburbReport.mockRejectedValue(error);

    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByText('Export PDF'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  // Test disabled state functionality
  it('is disabled when disabled prop is true', () => {
    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={mockFormattedData}
        results={mockResults}
        disabled={true}
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Test edge case: component handles missing/null data gracefully
  it('handles missing data gracefully', () => {
    const emptyFormattedData = {
      suburbBasicInfo: null,
      livability: null,
      incomeEmployment: null,
      safetyScores: null,
    };

    const emptyResults = [
      { data: null },
      { data: null },
      { data: null },
      { data: null },
      { data: null },
      { data: null },
    ];

    render(
      <ExportPdfButton
        suburbId="1"
        formattedData={emptyFormattedData}
        results={emptyResults}
      />
    );

    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });
});
