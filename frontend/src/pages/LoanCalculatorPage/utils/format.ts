import type { LoanCalcResult } from '../types/calculatorTypes';

export const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value);

export const toCurrencyNoRound = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(value);

export const toPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

/**
 * 统一适配 LoanWrapperDtoResponse：
 * - /single: wrapper.Amortization
 * - /piecewise: wrapper.Piecewise
 * 金额字段兼容 *_Cents 或 decimal
 */
export const adaptWrapperResponse = (wrapper: any): LoanCalcResult => {
  const payload = wrapper?.Amortization ?? wrapper?.Piecewise ?? wrapper ?? {};

  const centsOr = (c?: number, d?: number) => (typeof c === 'number' ? c / 100 : typeof d === 'number' ? d : 0);

  const paymentPerPeriod = centsOr(payload?.PaymentPerPeriodCents, payload?.PaymentPerPeriod);
  const totalInterest = centsOr(payload?.TotalInterestCents, payload?.TotalInterest);
  const totalCost = centsOr(payload?.TotalCostCents, payload?.TotalCost);

  let ratio =
    wrapper?.PaymentToIncomeRatioPercent ??
    wrapper?.FirstSegmentPaymentToIncomeRatioPercent ??
    payload?.PaymentToIncomeRatioPercent ??
    payload?.FirstSegmentPaymentToIncomeRatioPercent ??
    0;

  if (typeof ratio === 'string') ratio = parseFloat(ratio.replace('%', '')) || 0;

  return {
    paymentPerPeriod,
    totalInterest,
    totalCost,
    incomeRatioPercent: Number(ratio),
  };
};
