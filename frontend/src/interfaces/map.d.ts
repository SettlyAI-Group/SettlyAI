export interface IGeocodeApiResult {
  address?: Record<string, string>;
}

export interface IGeocodeData {
  suburb: string;
  state: string;
  postcode: string;
}

export interface ISuburbOverviewSuburb {
  id: number;
  name: string | null;
  stateCode: string;
  postcode: string | null;
}

export interface ISuburbSafety {
  crimeLevel: string | null;
  safetyLabel: string | null;
}

export interface ISuburbAffordability {
  score: number | null;
  label: string | null;
}

export interface ISuburbOverviewMetrics {
  medianPrice: number | null;
  medianPriceFormatted: string | null;
  priceGrowth3YrPct: number | null;
  safety: ISuburbSafety | null;
  affordability: ISuburbAffordability | null;
}

export interface ISuburbOverviewSummary {
  text: string | null;
  status: string;
  source: string;
}

export interface IApiSuburbData {
  /** Basic suburb metadata for the overview header. */
  suburb: ISuburbOverviewSuburb | null;
  /** Primary market and lifestyle metrics for the suburb. */
  metrics: ISuburbOverviewMetrics | null;
  /** Generated summary text describing the suburb's metrics. */
  summary: ISuburbOverviewSummary | null;
  /** Key highlight labels derived from the metrics. */
  highlights: string[];
}

export interface ILatLonData {
  lat: number;
  lon: number;
}

export interface IMapSuburbState {
  overview: IApiSuburbData | null;
}
