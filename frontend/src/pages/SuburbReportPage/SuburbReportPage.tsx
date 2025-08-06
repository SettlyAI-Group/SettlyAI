import { useState } from 'react';
import { Box, styled } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MetricCardsSection from './components/MetricCardsSection';
import SaveButton from '@/components/SaveButton/SaveButton';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  display: 'flex',
  justifyContent: 'center',
  margin: '0 auto',
  padding: theme.spacing(8),
}));

const metricCardsData = [
  {
    icon: <AccountBalanceIcon />,
    title: 'Financial Health',
    value: '$12,500',
    subtitle: 'Total Savings',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Monthly Income',
    value: '$3,200',
    subtitle: 'After Tax',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Credit Score',
    value: '752',
    subtitle: 'Excellent',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Loan Balance',
    value: '$8,900',
    subtitle: 'Remaining',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Investments',
    value: '$15,000',
    subtitle: 'Stocks & Funds',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Monthly Expenses',
    value: '$2,100',
    subtitle: 'Utilities & Rent',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Net Worth',
    value: '$28,400',
    subtitle: 'Assets - Liabilities',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Retirement Fund',
    value: '$7,800',
    subtitle: 'Superannuation',
  },
];

const SuburbReportPage = () => {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <PageContainer>
      <h1>Suburb Report</h1>
      <SaveButton
        isSaved={isSaved}
        onToggle={setIsSaved}
        targetType="suburb"
        targetId={3} // for testing
      />
      <MetricCardsSection
        title="Lifestyle Accessibility"
        data={metricCardsData}
      />
    </PageContainer>
  );
};

export default SuburbReportPage;
