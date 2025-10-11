import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropertyDetailsSection from './PropertyDetailsSection';
import type { TransformedPropertyData } from '@/interfaces/property';

// Mock data for testing - matches the API schema exactly
export const mockPropertyData: TransformedPropertyData[] = [
  {
    id: 1,
    suburbId: 1,
    address: "123 Smith Street, Fitzroy, VIC 3065",
    formattedPrice: "$1,250,000",
    bedrooms: "3",
    bathrooms: "2", 
    carSpaces: "1",
    formattedInternalArea: "145m²",
    formattedLandSize: "300m²",
    yearBuilt: "1995",
    features: ["Air Conditioning", "Dishwasher", "Garage", "Balcony", "Garden", "Heating"],
    summary: "This property is near schools and parks. The suburb has grown 12% YOY.",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    hasImage: true,
    hasFeatures: true,
    hasSummary: true,
    propertyType: "House"
  },
  {
    id: 2,
    suburbId: 2,
    address: "456 Collins Street, Melbourne, VIC 3000",
    formattedPrice: "$850,000",
    bedrooms: "2",
    bathrooms: "1",
    carSpaces: "Data being updated",
    formattedInternalArea: "85m²", 
    formattedLandSize: "Data being updated",
    yearBuilt: "2010",
    features: ["Air Conditioning", "Dishwasher", "Balcony"],
    summary: "Modern apartment in the heart of Melbourne CBD with excellent transport links.",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    hasImage: true,
    hasFeatures: true,
    hasSummary: true,
    propertyType: "Apartment"
  },
  // Property with missing data for testing fallbacks
  {
    id: 3,
    suburbId: 3,
    address: "789 Missing Data Street, Test Suburb, VIC 3001",
    formattedPrice: "Data being updated",
    bedrooms: "Data being updated",
    bathrooms: "Data being updated",
    carSpaces: "Data being updated", 
    formattedInternalArea: "Data being updated",
    formattedLandSize: "Data being updated",
    yearBuilt: "Data being updated",
    features: ["Data being updated"],
    summary: "Data being updated",
    imageUrl: "",
    hasImage: false,
    hasFeatures: false,
    hasSummary: false,
    propertyType: "Property"
  }
];

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('PropertyDetailsSection', () => {
  it('renders property details correctly', () => {
    const testProperty = mockPropertyData[0];
    
    render(
      <TestWrapper>
        <PropertyDetailsSection property={testProperty} />
      </TestWrapper>
    );

    expect(screen.getByText('Property Details')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('AI Summary')).toBeInTheDocument();
    expect(screen.getByText('Government Assistance for First-Home Buyers')).toBeInTheDocument();
  });

  it('displays property information correctly', () => {
    const testProperty = mockPropertyData[0];
    
    render(
      <TestWrapper>
        <PropertyDetailsSection property={testProperty} />
      </TestWrapper>
    );

    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    const testProperty = mockPropertyData[2]; // Property with missing data
    
    render(
      <TestWrapper>
        <PropertyDetailsSection property={testProperty} />
      </TestWrapper>
    );

    expect(screen.getAllByText('Data being updated')).toHaveLength(6);
  });
});