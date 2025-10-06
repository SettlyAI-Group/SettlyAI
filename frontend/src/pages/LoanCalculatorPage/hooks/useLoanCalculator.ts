/**
 * Manages base and stress calculations with clear UX states:
 * - When the form changes, summary becomes "stale" until Calculate is pressed.
 * - After Calculate, stress becomes "stale" until the user drags the slider.
 * - Apply toggle can lock the form to avoid confusion while previewing stress impact.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateLoan } from '../api/calculatorApi';
import type { LoanFormValues, LoanCalcResult } from '../types/calculatorTypes';

/** Read annual interest rate (%) safely, without using `any`. */
const readAnnualRatePercent = (obj: unknown): number => {
  const o = obj as { annualInterestRatePercent?: number | string } | null | undefined;
  const raw = o?.annualInterestRatePercent;
  const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
};

/** Strongly-typed debounce helper. */
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
  // --- Base form state ---
  const [values, setValues] = useState<LoanFormValues>(initial);

  // --- Base calculation state ---
  const [result, setResult] = useState<LoanCalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- UX state: is the form changed since last Calculate? ---
  const [isFormStale, setIsFormStale] = useState<boolean>(true); // true on first load

  // --- Stress test state (calculated only after first slider drag) ---
  const [stressRate, setStressRate] = useState<number>(readAnnualRatePercent(initial));
  const [stressResult, setStressResult] = useState<LoanCalcResult | null>(null);
  const [stressLoading, setStressLoading] = useState(false);
  const [stressError, setStressError] = useState<string | null>(null);

  // --- UX state: is the stress result stale relative to the latest base calc? ---
  const [isStressStale, setIsStressStale] = useState<boolean>(true);

  // --- Toggle: apply stress to summary (and optionally lock the form) ---
  const [applyStressToSummary, setApplyStressToSummary] = useState(false);

  /** Update a single field in the base form. */
  const onChange = useCallback(<K extends keyof LoanFormValues>(key: K, val: LoanFormValues[K]) => {
    setValues(v => ({ ...v, [key]: val }));
    setIsFormStale(true); // summary becomes stale
    setIsStressStale(true); // stress becomes stale as well
  }, []);

  /** Run base calculation with current form values. */
  const simulate = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const r = await calculateLoan(values);
      setResult(r);
      setIsFormStale(false); // summary is now fresh
      setIsStressStale(true); // stress should be recomputed by user via slider
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else if (typeof err === 'string') setError(err);
      else setError('Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [values]);

  /**
   * Run a stress calculation with a given override rate (percent).
   * Precision normalized to avoid 6.499999 vs 6.5 discrepancies.
   */
  const doStressCalc = useCallback(
    async (overrideRate: number): Promise<void> => {
      const normalizedRate = Number(overrideRate.toFixed(4));
      setStressLoading(true);
      setStressError(null);
      try {
        const r = await calculateLoan(values, { interestRateOverride: normalizedRate });
        setStressResult(r);
        setIsStressStale(false); // the user just refreshed stress
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

  /** Debounced wrapper for stress calculation (limits API calls while dragging). */
  const debouncedStress = useDebounceFn((rate: number) => {
    void doStressCalc(rate);
  }, 250);

  /**
   * Keep the slider value in sync ONLY when the base interest rate changes in the form.
   * Do not auto-trigger a stress calculation.
   */
  useEffect(() => {
    const baseRate = readAnnualRatePercent(values);
    setStressRate(baseRate);
    // isStressStale already handled in onChange/simulate
  }, [values.annualInterestRatePercent]);

  /** Decide which result to show in the summary panel. */
  const summaryResult = useMemo<LoanCalcResult | null>(() => {
    return applyStressToSummary ? (stressResult ?? result) : result;
  }, [applyStressToSummary, result, stressResult]);

  /** When Apply is ON and we are showing stress, the form should be locked. */
  const isFormLocked = useMemo<boolean>(() => {
    return applyStressToSummary && !!stressResult;
  }, [applyStressToSummary, stressResult]);

  /** Handle slider change: update local rate and run debounced stress calculation. */
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
    simulate,
    result,
    loading,
    error,
    setResult,

    // freshness flags
    isFormStale,
    isStressStale,

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
    isFormLocked,
  };
};
