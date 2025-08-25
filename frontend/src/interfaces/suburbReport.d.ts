export interface ISuburbBasicInfo {
  suburbId: number;
  postcode: string;
  state: string;
  name: string;
}

export interface ILivability {
  transportScore: number;
  supermarketQuantity: number;
  hospitalQuantity: number;
  primarySchoolRating: number;
  secondarySchoolRating: number;
  hospitalDensity: number;
}

export interface IIncomeEmployment {
    medianIncome: number;
    employmentRate: number;
    whiteCollarRatio: number;
    jobGrowthRate: number;
}
