/// <reference types="vite/client" />
import type { LoanFormValues } from '../types/calculatorTypes';
import { adaptWrapperResponse } from '../utils/format';
import type { LoanCalcResult } from '../types/calculatorTypes';

type WrapperResponse = Parameters<typeof adaptWrapperResponse>[0];

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '');

// Explicit map for common IO dropdown values to years
const IO_LABEL_MAP: Record<string, number> = {
  InterestOnly_1: 1,
  InterestOnly_2: 2,
  InterestOnly_3: 3,
  InterestOnly_5: 5,
  'Interest Only - 1 Year': 1,
  'Interest Only — 1 Year': 1,
  'Interest Only - 2 Years': 2,
  'Interest Only — 2 Years': 2,
  'Interest Only - 3 Years': 3,
  'Interest Only — 3 Years': 3,
  'Interest Only - 5 Years': 5,
  'Interest Only — 5 Years': 5,
};
/**
 * Parses the number of interest-only years from various string formats.
 * It uses a cascading strategy:
 * 1. Checks a predefined map of common values (e.g., 'InterestOnly_1').
 * 2. Tries to parse the format "InterestOnly_N".
 * 3. Falls back to a loose regex to find a number followed by "year".
 * @param choice The repayment choice string from the form.
 * @returns The number of IO years, or 0 if none is found.
 */
const parseIoYears = (choice: LoanFormValues['repaymentChoice']): number => {
  if (!choice) return 0;
  const raw = String(choice).trim();

  // 1) Use explicit mapping first
  if (raw in IO_LABEL_MAP) return IO_LABEL_MAP[raw];

  // 2) Parse "InterestOnly_N"
  if (/^InterestOnly_\d+$/i.test(raw)) {
    const n = Number(raw.split('_')[1]);
    return Number.isFinite(n) ? n : 0;
  }

  // 3) Loose regex, e.g. "interest only ... 1 year"
  const m = raw.toLowerCase().match(/interest\s*only.*?(\d+)\s*year/);
  return m ? Number(m[1]) : 0;
};

// Helper: attach NetAnnualIncome only when provided
const withOptionalIncome = <T extends Record<string, unknown>>(
  base: T,
  netAnnualIncome: LoanFormValues['netAnnualIncome']
) => {
  if (netAnnualIncome == null || netAnnualIncome === '') return base;
  return { ...base, NetAnnualIncome: Number(netAnnualIncome) };
};

/**
 * Build single-segment (P&I) request body.
 * `effectiveAnnualRatePercent` supports overriding the UI rate (used by stress slider).
 */
const toAmortizationRequestDto = (v: LoanFormValues, effectiveAnnualRatePercent: number) => {
  const loanAmount = Number(v.loanAmount);
  const termYears = Number(v.termYears);

  const base = {
    LoanAmount: loanAmount,
    AnnualInterestRate: effectiveAnnualRatePercent, // backend expects percent, e.g. 6.5
    LoanTermYears: termYears,
    Frequency: v.frequency, // relies on JsonStringEnumConverter
    RepaymentType: 'PrincipalAndInterest' as const,
    GenerateSchedule: false,
  };
  return withOptionalIncome(base, v.netAnnualIncome);
};

/**
 * Build piecewise (IO -> P&I) request body.
 * `effectiveAnnualRatePercent` supports overriding the UI rate (used by stress slider).
 */
const toPiecewiseRequestDto = (v: LoanFormValues, ioYears: number, effectiveAnnualRatePercent: number) => {
  const loanAmount = Number(v.loanAmount);
  const termYears = Number(v.termYears);
  const pniYears = Math.max(0, termYears - ioYears);

  const segments: Array<{
    RepaymentType: 'InterestOnly' | 'PrincipalAndInterest';
    AnnualInterestRate: number;
    LoanTermYears: number;
  }> = [];

  if (ioYears > 0) {
    segments.push({
      RepaymentType: 'InterestOnly',
      AnnualInterestRate: effectiveAnnualRatePercent,
      LoanTermYears: ioYears,
    });
  }
  if (pniYears > 0) {
    segments.push({
      RepaymentType: 'PrincipalAndInterest',
      AnnualInterestRate: effectiveAnnualRatePercent,
      LoanTermYears: pniYears,
    });
  }

  const base = {
    InitialLoanAmount: loanAmount,
    Frequency: v.frequency,
    Segments: segments,
    GenerateSchedule: false,
  };
  return withOptionalIncome(base, v.netAnnualIncome);
};

type CalcOptions = {
  /** Optional stress override (percent, e.g. 8.5). If provided, it replaces the form rate. */
  interestRateOverride?: number;
};

/**
 * Call backend and adapt the wrapper response.
 * Supports an optional stress interest rate override.
 */
export const calculateLoan = async (values: LoanFormValues, opts?: CalcOptions): Promise<LoanCalcResult> => {
  const ioYears = parseIoYears(values.repaymentChoice);
  const isPiecewise = ioYears > 0;

  const path = isPiecewise ? '/api/LoanCalculator/piecewise' : '/api/LoanCalculator/single';
  const url = API_BASE ? `${API_BASE}${path}` : path;

  // Use override when provided; fallback to form value
  const effectiveAnnualRatePercent = Number(opts?.interestRateOverride ?? values.annualInterestRatePercent);

  const body = isPiecewise
    ? toPiecewiseRequestDto(values, ioYears, effectiveAnnualRatePercent)
    : toAmortizationRequestDto(values, effectiveAnnualRatePercent);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as WrapperResponse;
  return adaptWrapperResponse(data);
};
