import type { LoanCalcResult } from '../types/calculatorTypes';
export const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
export const toCurrencyNoRound = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(value ?? 0);
export const toCurrencyCeil = (value: number) => {
  const n = Number(value ?? 0);
  const ceiled = Math.ceil(n + 1e-9); // protect against 3792.0000000001 style floats
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ceiled);
};
export const toPercent = (value: number, digits = 1) => `${(value ?? 0).toFixed(digits)}%`;

// ---------------- types ----------------
type MoneyLike = number | null | undefined;
type RatioLike = number | string | null | undefined;

interface AmortizationCamel {
  payment?: MoneyLike;
  paymentPerPeriod?: MoneyLike;
  paymentPerPeriodCents?: MoneyLike;
  totalInterest?: MoneyLike;
  totalInterestCents?: MoneyLike;
  totalCost?: MoneyLike;
  totalCostCents?: MoneyLike;
  paymentToIncomeRatioPercent?: RatioLike;
}

interface AmortizationPascal {
  Payment?: MoneyLike;
  PaymentPerPeriod?: MoneyLike;
  PaymentPerPeriodCents?: MoneyLike;
  TotalInterest?: MoneyLike;
  TotalInterestCents?: MoneyLike;
  TotalCost?: MoneyLike;
  TotalCostCents?: MoneyLike;
  PaymentToIncomeRatioPercent?: RatioLike;
}

interface PiecewiseCamel {
  firstSegmentPayment?: MoneyLike;
  firstSegmentPaymentCents?: MoneyLike;
  totalInterest?: MoneyLike;
  totalInterestCents?: MoneyLike;
  totalCost?: MoneyLike;
  totalCostCents?: MoneyLike;
  firstSegmentPaymentToIncomeRatioPercent?: RatioLike;
}

interface PiecewisePascal {
  FirstSegmentPayment?: MoneyLike;
  FirstSegmentPaymentCents?: MoneyLike;
  TotalInterest?: MoneyLike;
  TotalInterestCents?: MoneyLike;
  TotalCost?: MoneyLike;
  TotalCostCents?: MoneyLike;
  FirstSegmentPaymentToIncomeRatioPercent?: RatioLike;
}

type AmortizationAny = AmortizationCamel & AmortizationPascal;
type PiecewiseAny = PiecewiseCamel & PiecewisePascal;

interface LoanWrapperAny {
  // camel
  amortization?: AmortizationCamel | null;
  piecewise?: PiecewiseCamel | null;
  paymentToIncomeRatioPercent?: RatioLike;
  firstSegmentPaymentToIncomeRatioPercent?: RatioLike;

  // pascal
  Amortization?: AmortizationPascal | null;
  Piecewise?: PiecewisePascal | null;
  PaymentToIncomeRatioPercent?: RatioLike;
  FirstSegmentPaymentToIncomeRatioPercent?: RatioLike;
}

// ---------------- helpers ----------------
const percentToNum = (v: RatioLike): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace('%', '').trim());
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const centsOr = (cents?: MoneyLike, dec?: MoneyLike): number =>
  typeof cents === 'number' ? cents / 100 : typeof dec === 'number' ? dec : 0;

// ---------------- adapter ----------------
/**
 * 统一适配 LoanWrapperDtoResponse：
 * - /single：amortization.payment / paymentPerPeriod / totalInterest / totalCost / paymentToIncomeRatioPercent
 * - /piecewise：piecewise.firstSegmentPayment / totalInterest / totalCost / firstSegmentPaymentToIncomeRatioPercent
 * 同时兼容 camelCase 与 PascalCase、以及 *_Cents。
 */
export const adaptWrapperResponse = (wrapper: LoanWrapperAny): LoanCalcResult => {
  const a: AmortizationAny | null =
    (wrapper.amortization as AmortizationAny | undefined) ??
    (wrapper.Amortization as AmortizationAny | undefined) ??
    null;

  const p: PiecewiseAny | null =
    (wrapper.piecewise as PiecewiseAny | undefined) ?? (wrapper.Piecewise as PiecewiseAny | undefined) ?? null;

  // 优先处理分段（IO → P&I）
  if (p) {
    const paymentPerPeriod = centsOr(p.firstSegmentPaymentCents, p.firstSegmentPayment);

    const totalInterest = centsOr(p.totalInterestCents, p.totalInterest);

    const totalCost = centsOr(p.totalCostCents, p.totalCost);

    const incomeRatioPercent = percentToNum(
      p.firstSegmentPaymentToIncomeRatioPercent ??
        wrapper.firstSegmentPaymentToIncomeRatioPercent ??
        wrapper.FirstSegmentPaymentToIncomeRatioPercent
    );

    return {
      paymentPerPeriod,
      totalInterest,
      totalCost,
      incomeRatioPercent,
    };
  }

  // 单段
  if (a) {
    const paymentPerPeriod = centsOr(a.paymentPerPeriodCents, a.paymentPerPeriod ?? a.payment);

    const totalInterest = centsOr(a.totalInterestCents, a.totalInterest);

    const totalCost = centsOr(a.totalCostCents, a.totalCost);

    const incomeRatioPercent = percentToNum(
      a.paymentToIncomeRatioPercent ?? wrapper.paymentToIncomeRatioPercent ?? wrapper.PaymentToIncomeRatioPercent
    );

    return {
      paymentPerPeriod,
      totalInterest,
      totalCost,
      incomeRatioPercent,
    };
  }

  // 兜底（极少进入）
  return {
    paymentPerPeriod: 0,
    totalInterest: 0,
    totalCost: 0,
    incomeRatioPercent: 0,
  };
};
