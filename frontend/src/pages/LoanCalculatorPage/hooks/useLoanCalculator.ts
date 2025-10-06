/**
 * A custom hook that manages both base and stress calculations for the loan simulator.
 * - Base: uses the form interest rate.
 * - Stress: uses a slider override rate with debounced requests.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateLoan } from '../api/calculatorApi';
import type { LoanFormValues, LoanCalcResult } from '../types/calculatorTypes';

/** Safely read annual interest rate (%) from an arbitrary object without using `any`. */
const readAnnualRatePercent = (obj: unknown): number => {
  // Narrow to a shape that may have the property; still fully typed.
  const o = obj as { annualInterestRatePercent?: number | string } | null | undefined;
  const raw = o?.annualInterestRatePercent;
  const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const useDebounceFn = <Args extends unknown[]>(fn: (...args: Args) => void, ms: number) => {
  const t = useRef<number | null>(null);

  return useCallback(
    (...args: Args) => {
      if (t.current !== null) window.clearTimeout(t.current);
      t.current = window.setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
};

export const useLoanCalculator = (initial: LoanFormValues) => {
  // Form values (base)
  const [values, setValues] = useState<LoanFormValues>(initial);

  // Base calculation state
  const [result, setResult] = useState<LoanCalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stress calculation state
  const [stressRate, setStressRate] = useState<number>(readAnnualRatePercent(initial));
  const [stressResult, setStressResult] = useState<LoanCalcResult | null>(null);
  const [stressLoading, setStressLoading] = useState(false);
  const [applyStressToSummary, setApplyStressToSummary] = useState(false);
  const [stressError, setStressError] = useState<string | null>(null);

  // Change a single field on the form
  const onChange = useCallback(<K extends keyof LoanFormValues>(key: K, val: LoanFormValues[K]) => {
    setValues(v => ({ ...v, [key]: val }));
  }, []);

  // Trigger base calculation using current form values
  const simulate = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const r = await calculateLoan(values);
      setResult(r);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else if (typeof err === 'string') setError(err);
      else setError('Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [values]);

  // Debounced stress calculation using override rate
  const doStressCalc = useCallback(
    async (overrideRate: number): Promise<void> => {
      setStressLoading(true);
      setStressError(null);
      try {
        const r = await calculateLoan(values, { interestRateOverride: overrideRate });
        setStressResult(r);
      } catch (err: unknown) {
        if (err instanceof Error) setStressError(err.message);
        else if (typeof err === 'string') setStressError(err);
        else setStressError('Unknown error');
        setStressResult(null);
      } finally {
        setStressLoading(false);
      }
    },
    [values]
  );

  const debouncedStress = useDebounceFn((rate: number) => void doStressCalc(rate), 250);

  // Keep stress rate in sync with the base interest input whenever form changes
  useEffect(() => {
    setStressRate(readAnnualRatePercent(values));
  }, [values]);

  // Compute which result to show in the right-side summary
  const summaryResult = useMemo<LoanCalcResult | null>(() => {
    return applyStressToSummary ? (stressResult ?? result) : result;
  }, [applyStressToSummary, result, stressResult]);

  // Public handlers for slider
  const onStressRateChange = useCallback(
    (rate: number) => {
      setStressRate(rate);
      debouncedStress(rate);
    },
    [debouncedStress]
  );

  return {
    // form
    values,
    onChange,

    // base
    simulate,
    result,
    loading,
    error,
    setResult,

    // stress
    stressRate,
    setStressRate,
    onStressRateChange,
    stressResult,
    stressLoading,
    stressError,
    applyStressToSummary,
    setApplyStressToSummary,

    // derived
    summaryResult,
  };
};
