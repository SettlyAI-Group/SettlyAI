/// <reference types="vite/client" />
import type { LoanFormValues } from '../types/calculatorTypes';
import { adaptWrapperResponse } from '../utils/format';
import type { LoanCalcResult } from '../types/calculatorTypes';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

/** Parse "InterestOnly_N" to the IO-year count. */
const parseIoYears = (choice: LoanFormValues['repaymentChoice']): number => {
  if (!choice.startsWith('InterestOnly_')) return 0;
  const n = Number(choice.split('_')[1]);
  return Number.isFinite(n) ? n : 0;
};

/** Map LoanFormValues -> AmortizationRequestDto (/single). */
const toAmortizationRequestDto = (v: LoanFormValues) => {
  // Force numeric types to avoid '' from form inputs
  const loanAmount = Number(v.loanAmount);
  const annualRate = Number(v.annualInterestRatePercent);
  const termYears = Number(v.termYears);
  const netIncome = v.netAnnualIncome == null ? null : Number(v.netAnnualIncome);

  return {
    LoanAmount: loanAmount,
    AnnualInterestRate: annualRate, // percent format, e.g., 6.5
    LoanTermYears: termYears,
    Frequency: v.frequency, // "Monthly" | "Fortnightly" | "Weekly"
    RepaymentType: 'PrincipalAndInterest',
    GenerateSchedule: false,
    NetAnnualIncome: netIncome,
  };
};

/** Map LoanFormValues -> PiecewiseRequestDto (/piecewise). */
const toPiecewiseRequestDto = (v: LoanFormValues) => {
  const loanAmount = Number(v.loanAmount);
  const annualRate = Number(v.annualInterestRatePercent);
  const termYears = Number(v.termYears);
  const netIncome = v.netAnnualIncome == null ? null : Number(v.netAnnualIncome);

  const ioYears = parseIoYears(v.repaymentChoice);
  const pniYears = Math.max(0, termYears - ioYears);

  return {
    InitialLoanAmount: loanAmount,
    Frequency: v.frequency,
    Segments: [
      {
        RepaymentType: 'InterestOnly',
        AnnualInterestRate: annualRate,
        LoanTermYears: ioYears,
      },
      ...(pniYears > 0
        ? [
            {
              RepaymentType: 'PrincipalAndInterest',
              AnnualInterestRate: annualRate,
              LoanTermYears: pniYears,
            },
          ]
        : []),
    ],
    GenerateSchedule: false,
    NetAnnualIncome: netIncome,
  };
};

/** Call backend and adapt to LoanCalcResult. */
export const calculateLoan = async (values: LoanFormValues): Promise<LoanCalcResult> => {
  const isIO = values.repaymentChoice.startsWith('InterestOnly_');

  const url = isIO ? `${API_BASE}/api/LoanCalculator/piecewise` : `${API_BASE}/api/LoanCalculator/single`;

  const body = isIO ? toPiecewiseRequestDto(values) : toAmortizationRequestDto(values);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data: unknown = await res.json(); // LoanWrapperDtoResponse
  return adaptWrapperResponse(data);
};
