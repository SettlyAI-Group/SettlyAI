//To store pure functions in order to do math calculation ect
/** 將數字格式化為整數貨幣字串 (e.g., $1,234) */
export const toCurrency = (value: number, currency: string = 'AUD') =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

/** 將數字格式化為一位小數的百分比字串 (e.g., 12.3%) */
export const toPercentage = (value: number) => `${value.toFixed(1)}%`;

/** 將數值無條件進位到小數點後兩位 (分) */
export const ceilToCents = (value: number) => Math.ceil(value * 100) / 100;

/**
 * 前端備用計算：標準年金 P&I 每月還款額。
 * 僅在 USE_BACKEND = false 時使用。
 * @param principal - 貸款總額
 * @param annualRatePercentage - 年利率 (百分比)
 * @param years - 貸款年期
 * @returns 每月還款金額
 */
export function calculateMonthlyAnnuityPayment(principal: number, annualRatePercentage: number, years: number): number {
  const numberOfPayments = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRatePercentage / 100 / 12;

  if (monthlyRate === 0) {
    return ceilToCents(principal / numberOfPayments);
  }

  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  return ceilToCents(payment);
}

/**
 * 前端備用計算：根據每月還款額計算總還款成本。
 * @param monthlyPayment - 每月還款額
 * @param years - 貸款年期
 * @returns 總還款成本
 */
export function calculateTotalCost(monthlyPayment: number, years: number): number {
  const numberOfPayments = Math.round(years * 12);
  return ceilToCents(monthlyPayment * numberOfPayments);
}

/** 範圍限制函式，確保數字在最小值和最大值之間 */
export const clamp = (number: number, min: number, max: number) => Math.min(Math.max(number, min), max);
