import httpClient from './httpClient';
import type { PropertyDetailDto, TransformedPropertyData } from '@/interfaces/property';

// Centralized data transformation - eliminates all special cases
const transformPropertyData = (data: PropertyDetailDto): TransformedPropertyData => {
  const formatPrice = (price: number): string => {
    return price === 0 ? 'Data being updated' : 
      new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        maximumFractionDigits: 0,
      }).format(price).replace('A$', '$');
  };

  const formatArea = (area: number): string => {
    return area === 0 ? 'Data being updated' : `${area}m²`;
  };

  const formatYear = (year: number): string => {
    return year === 0 ? 'Data being updated' : year.toString();
  };

  // Derive property type from summary or other data
  const getPropertyType = (summary: string): string => {
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes('townhouse')) return 'Townhouse';
    if (lowerSummary.includes('apartment')) return 'Apartment';
    if (lowerSummary.includes('house')) return 'House';
    if (lowerSummary.includes('unit')) return 'Unit';
    if (lowerSummary.includes('villa')) return 'Villa';
    return 'Property';
  };

  return {
    id: data.id,
    suburbId: data.suburbId,
    address: data.address || 'Data being updated',
    formattedPrice: formatPrice(data.price),
    bedrooms: data.bedrooms === 0 ? 'Data being updated' : data.bedrooms.toString(),
    bathrooms: data.bathrooms === 0 ? 'Data being updated' : data.bathrooms.toString(),
    carSpaces: data.carSpaces === 0 ? 'Data being updated' : data.carSpaces.toString(),
    formattedInternalArea: formatArea(data.internalArea),
    formattedLandSize: formatArea(data.landSize),
    yearBuilt: formatYear(data.yearBuilt),
    features: data.features,
    summary: data.summary || 'Data being updated',
    imageUrl: data.imageUrl,
    hasImage: Boolean(data.imageUrl),
    hasFeatures: data.features.length > 0,
    hasSummary: Boolean(data.summary),
    propertyType: getPropertyType(data.summary || '')
  };
};

export const getPropertyDetail = async (propertyId: string): Promise<TransformedPropertyData> => {
  const response = await httpClient.get<PropertyDetailDto>(`/Property/${propertyId}`);
  return transformPropertyData(response.data);
};
