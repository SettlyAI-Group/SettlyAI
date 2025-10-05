/// <reference types="vite/client" />
import type { LoanFormValues } from '../types/calculatorTypes';
import { adaptWrapperResponse } from '../utils/format';
import type { LoanCalcResult } from '../types/calculatorTypes';

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '');

// 常见下拉 value 的显式映射（避免 label 格式差异）
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

const parseIoYears = (choice: LoanFormValues['repaymentChoice']): number => {
  if (!choice) return 0;
  const raw = String(choice).trim();

  // 1) 先用显式映射（最稳）
  if (raw in IO_LABEL_MAP) return IO_LABEL_MAP[raw];

  // 2) InterestOnly_N 这种规范值
  if (/^InterestOnly_\d+$/i.test(raw)) {
    const n = Number(raw.split('_')[1]);
    return Number.isFinite(n) ? n : 0;
  }

  // 3) 宽松正则: "interest only ... 1 year"
  const m = raw.toLowerCase().match(/interest\s*only.*?(\d+)\s*year/);
  return m ? Number(m[1]) : 0;
};

// 仅在有净收入时携带该字段，避免发送 null
const withOptionalIncome = <T extends Record<string, unknown>>(
  base: T,
  netAnnualIncome: LoanFormValues['netAnnualIncome']
) => {
  if (netAnnualIncome == null || netAnnualIncome === '') return base;
  return { ...base, NetAnnualIncome: Number(netAnnualIncome) };
};

/** 单段 P&I 请求体 */
const toAmortizationRequestDto = (v: LoanFormValues) => {
  const loanAmount = Number(v.loanAmount);
  const annualRatePercent = Number(v.annualInterestRatePercent); // 约定百分数，如 6.5
  const termYears = Number(v.termYears);

  const base = {
    LoanAmount: loanAmount,
    AnnualInterestRate: annualRatePercent, // 若后端要小数：annualRatePercent / 100
    LoanTermYears: termYears,
    Frequency: v.frequency, // 已启用 JsonStringEnumConverter 可发 "Monthly"
    RepaymentType: 'PrincipalAndInterest' as const,
    GenerateSchedule: false,
  };
  return withOptionalIncome(base, v.netAnnualIncome);
};

/** 分段（IO -> P&I）请求体 */
const toPiecewiseRequestDto = (v: LoanFormValues, ioYears: number) => {
  const loanAmount = Number(v.loanAmount);
  const annualRatePercent = Number(v.annualInterestRatePercent);
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
      AnnualInterestRate: annualRatePercent,
      LoanTermYears: ioYears,
    });
  }
  if (pniYears > 0) {
    segments.push({
      RepaymentType: 'PrincipalAndInterest',
      AnnualInterestRate: annualRatePercent,
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

/** 调用后端并适配结果 */
export const calculateLoan = async (values: LoanFormValues): Promise<LoanCalcResult> => {
  const ioYears = parseIoYears(values.repaymentChoice);
  const isPiecewise = ioYears > 0;

  const path = isPiecewise ? '/api/LoanCalculator/piecewise' : '/api/LoanCalculator/single';
  const url = API_BASE ? `${API_BASE}${path}` : path;

  const body = isPiecewise ? toPiecewiseRequestDto(values, ioYears) : toAmortizationRequestDto(values);

  // 临时日志，确认走到哪条路径（需要时保留）
  // console.log('[calc] repaymentChoice=', values.repaymentChoice);
  // console.log('[calc] ioYears=', ioYears, 'isPiecewise=', isPiecewise);
  // console.log('[calc] url=', url, 'body=', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  return adaptWrapperResponse(data);
};
