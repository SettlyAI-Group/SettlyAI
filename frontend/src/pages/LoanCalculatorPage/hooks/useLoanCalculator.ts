/**
 * A custom hook to manage the state and logic of the loan calculator.
 * @param initial Initial form values.
 * @returns State and handlers for the calculator.
 */
import { useCallback, useState } from 'react';
import { calculateLoan } from '../api/calculatorApi';
import type { LoanFormValues, LoanCalcResult } from '../types/calculatorTypes';

export const useLoanCalculator = (initial: LoanFormValues) => {
  const [values, setValues] = useState<LoanFormValues>(initial);
  const [result, setResult] = useState<LoanCalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback(<K extends keyof LoanFormValues>(key: K, val: LoanFormValues[K]) => {
    setValues(v => ({ ...v, [key]: val }));
  }, []);

  const simulate = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // calculateLoan 应该返回 Promise<LoanCalcResult>
      const r: LoanCalcResult = await calculateLoan(values);
      setResult(r);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Unknown error');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [values]);

  return { values, onChange, simulate, result, loading, error, setResult };
};
