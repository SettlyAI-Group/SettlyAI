import { useLocation, useParams } from 'react-router-dom';
import Map from '@/components/Map';
const ExplorePage = () => {
  const { state } = useLocation() as { state?: { suburbId?: number } };
  const { location } = useParams();
  const label = location ? decodeURIComponent(location) : 'Unknown';
  return (
    <div>
      {/* <p>Selected Suggestion: {label}</p> */}
      <Map />
    </div>
  );
};

export default ExplorePage;
