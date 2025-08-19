import { readSelectedSuggestion } from '@/utils/storage';

const ExplorePage = () => {
  const savedData = readSelectedSuggestion();
  const label = savedData?.label;
  const selectedSuggestion = savedData?.option;
  return (
    <div>
      <p>Selected Suggestion: {label}</p>
    </div>
  );
};

export default ExplorePage;
