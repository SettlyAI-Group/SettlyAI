import { useLocation, useParams } from 'react-router-dom';
import Map from '@/components/Map';
import SummaryCardSection from './components/SummaryCardSection';
const ExplorePage = () => {
  const { state } = useLocation() as { state?: { suburbId?: number } };
  const { location } = useParams();
  const label = location ? decodeURIComponent(location) : 'Unknown';
  return (
    <div>
      {/* <p>Selected Suggestion: {label}</p> */}
      <Map />
      <SummaryCardSection />
    </div>
  );
};

export default ExplorePage;
