export type Frequency = 'Monthly' | 'Fortnightly' | 'Weekly';

export type RepaymentChoice =
  | 'PrincipalAndInterest'
  | 'InterestOnly_1'
  | 'InterestOnly_2'
  | 'InterestOnly_3'
  | 'InterestOnly_4'
  | 'InterestOnly_5';

/**
 * Represents the form values for the loan calculator.
 * Numeric fields can be empty strings during user input.
 */
export interface LoanFormValues {
  loanAmount: number | '';
  annualInterestRatePercent: number | '';
  termYears: number | '';
  frequency: Frequency;
  repaymentChoice: RepaymentChoice;
  netAnnualIncome: number | '' | null;
}

/**
 * Represents the result of a loan calculation from the API.
 */
export interface LoanCalcResult {
  paymentPerPeriod: number;
  totalInterest: number;
  totalCost: number;
  incomeRatioPercent: number;
}
