import { useState, useEffect } from 'react';
export const useSafetyScores = (suburbId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSafetyScores = async () => {
      try {
        setLoading(true);
        const url = suburbId
          ? `/api/safety-scores/${suburbId}`
          : '/api/safety-scores/default';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch safety scores');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyScores();
  }, [suburbId]);

  return { data, loading, error };
};
