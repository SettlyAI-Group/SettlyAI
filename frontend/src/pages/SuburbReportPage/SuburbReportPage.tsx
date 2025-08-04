import { useState } from 'react';
import SaveButton from '@/components/SaveButton/SaveButton';

const SuburbReportPage = () => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Suburb Report - Save Button Test</h1>
      <SaveButton
        isSaved={isSaved}
        onToggle={setIsSaved}
        targetType="suburb"
        targetId={3} // for testing
      />
    </div>
  );
};

export default SuburbReportPage;
