import ActionButtonWrapper from '@/pages/SuburbReportPage/components/ActionButtonGroup/ActionButtonWrapper';
import BannerWrapper from '@/pages/SuburbReportPage/components/Banner/BannerWrapper';
import type { AppDispatch, RootState } from '@/store';
import { fetchSuburbReport, setSuburbId } from '@/store/slices/suburbSlice';
import { Box, Button, styled, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetricCardsSection from './components/MetricCardsSection';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  padding: theme.spacing(8),
}));

const SuburbReportPage = () => {
  const TITLES = {
    incomeEmployment: 'Income & Employment',
    propertyMarketInsights: 'Property Market Insghts',
    demandDevelopment: 'Demand & Development',
    lifeStyle: 'LifeStyle & Accessibility',
    safetyScore: 'Safety & Score',
  };
  const dispatch = useDispatch<AppDispatch>();
  const { suburbId, report, loading, error } = useSelector(
    (state: RootState) => state.suburb
  );
  //todo: replace it with real data
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

  useEffect(() => {
    let id = suburbId;

    if (!id) {
      const fromStorage = localStorage.getItem('suburbId');
      if (fromStorage) {
        id = parseInt(fromStorage);
        dispatch(setSuburbId(id));
      }
    }

    if (id) {
      dispatch(fetchSuburbReport(id));
    }
  }, [suburbId, dispatch]);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!report) return <p>No report found.</p>;

  return (
    <PageContainer>
      {/* todo: replace with real banner content */}
      <BannerWrapper>
        <Typography variant="h3" fontWeight={700}>
          Welcome to {report.suburbName},{report.state},{report.postcode}
        </Typography>
      </BannerWrapper>
      {/* todo: replace with real card content */}

      <MetricCardsSection
        title="Lifestyle Accessibility"
        data={metricCardsData}
      />
      {/* todo:  replace with real action buttons , feel free to modify*/}
      <ActionButtonWrapper>
        <Button>save this suburb</Button>
        <Button>Export PDF</Button>
      </ActionButtonWrapper>
    </PageContainer>
  );
};

export default SuburbReportPage;
