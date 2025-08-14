import { useEffect, useState } from 'react';
import { exploreSuburbs } from '@/api/exploreApi';
import { useParams } from 'react-router-dom';

const ExplorePage = () => {
  const { location = '' } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const result = await exploreSuburbs(location);
        setData(result);
      } catch (err: any) {
        setError(err?.message || 'Error fetching data');
      }
    })();
  }, [location]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>;
};

export default ExplorePage;
