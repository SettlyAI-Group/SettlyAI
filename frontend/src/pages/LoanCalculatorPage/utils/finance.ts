/**
 * Calculates the number of payment periods in a year for a given frequency.
 * @param freq The repayment frequency.
 * @returns The number of periods per year.
 */
export function periodsPerYear(freq: 'Monthly' | 'Fortnightly' | 'Weekly'): number {
  switch (freq) {
    case 'Monthly':
      return 12;
    case 'Fortnightly':
      return 26;
    case 'Weekly':
      return 52;
    default:
      return 12;
  }
}
/**
 * Rounds a number up to the nearest cent.
 * @param x The number to round.
 * @returns The number rounded up to two decimal places.
 */
export function ceilToCents(x: number): number {
  return Math.ceil(x * 100) / 100;
}
/**
 * Estimates the annuity payment per period for a loan. (Front-end estimation)
 * @param principal The loan principal amount.
 * @param annualRatePercent The annual interest rate in percent (e.g., 6.5).
 * @param years The loan term in years.
 * @param freq The repayment frequency.
 * @returns The calculated payment per period.
 */
export function annuityPaymentPerPeriod(
  principal: number,
  annualRatePercent: number,
  years: number,
  freq: 'Monthly' | 'Fortnightly' | 'Weekly'
): number {
  const ppy = periodsPerYear(freq);
  const n = Math.max(0, Math.round(years * ppy));
  if (n === 0) return 0;
  const r = annualRatePercent / 100 / ppy;
  if (r === 0) {
    return ceilToCents(principal / n);
  }
  const denom = 1 - Math.pow(1 + r, -n);
  if (denom === 0) return 0;
  return ceilToCents((principal * r) / denom);
}
