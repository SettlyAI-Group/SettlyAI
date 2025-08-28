import { useLocation, useParams } from 'react-router-dom';
const ExplorePage = () => {
  const { state } = useLocation() as { state?: { suburbId?: number } };
  const { location } = useParams();
  const label = location ? decodeURIComponent(location) : 'Unknown';
  return (
    <div>
      <p>Selected Suggestion: {label}</p>
    </div>
  );
};

export default ExplorePage;
