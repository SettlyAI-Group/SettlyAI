export interface ISuburbReport {
  id: string;
  suburbId: number;
  postcode: string;
  state: string;
  suburbName: string;
  incomeEmployment: {
    medianIncome: number;
    employmentRate: number;
    whiteCollarRatio: number;
    jobGrowthRate: number;
  };
  housingMarket: {
    medianPrice: number;
    priceGrowth3Yr: number;
    daysOnMarket: number;
    clearanceRate: number;
    medianRent: number;
    rentGrowth12M: number;
    vacancyRate: number;
    rentalYield: number;
  };
  populationSupply: {
    population: number;
    populationGrowthRate: number;
    rentersRatio: number;
    landSupply: string;
    buildingApprovals12M: number;
  };
  riskDevelopment: {
    devProjectsCount: number;
    crimeRate: number;
  };
  livability: ILivability;
  settlyAIScore: {
    affordabilityScore: number;
    growthPotentialScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ILivability {
  transportScore: number;
  supermarketQuantity: number;
  hospitalQuantity: number;
  primarySchoolRating: number;
  secondarySchoolRating: number;
  hospitalDensity: number;
}
