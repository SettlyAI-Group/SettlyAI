export interface PropertyDetailDto {
  id: number;
  suburbId: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  internalArea: number;
  landSize: number;
  yearBuilt: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
  summary: string;
  imageUrl: string;
}

export interface TransformedPropertyData {
  id: number;
  suburbId: number;
  address: string;
  formattedPrice: string;
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  formattedInternalArea: string;
  formattedLandSize: string;
  yearBuilt: string;
  features: string[];
  summary: string;
  imageUrl: string;
  hasImage: boolean;
  hasFeatures: boolean;
  hasSummary: boolean;
  propertyType: string;
}
