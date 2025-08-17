import ActionButtonWrapper from '@/pages/SuburbReportPage/components/ActionButtonGroup/ActionButtonWrapper';
import BannerWrapper from '@/pages/SuburbReportPage/components/Banner/BannerWrapper';
import { Box, Button, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetricCardsSection from './components/MetricCardsSection';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
<<<<<<< HEAD
import { getDemandAndDev } from '@/api/suburbApi';
import {mapDevCardData} from '@/pages/SuburbReportPage/components/MetricCardsSection/utils/MakeCards'
import type { IMetricCardData } from './components/MetricCardsSection/MetricCardsSection';
||||||| parent of bbe4021 (setup react query)
=======
import { useQuery } from '@tanstack/react-query';
import { getSuburbLivability } from '@/api/suburbApi';
<<<<<<< HEAD
>>>>>>> bbe4021 (setup react query)
||||||| parent of f480937 (updating datamapper)
=======
import { Navigate, useParams } from 'react-router-dom';
>>>>>>> f480937 (updating datamapper)

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: theme.spacing(8),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: '936px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(8),
  width: '100%',
  paddingTop: theme.spacing(8),
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

  const [demandAndDevCards, setDemandAndDevCards] = useState<IMetricCardData[]>([]);

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

<<<<<<< HEAD
<<<<<<< HEAD
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
    if (id) {
      const fetchDemandAndDevData = async() => {
        const data = await getDemandAndDev(id);
        setDemandAndDevCards(mapDevCardData(data));
      }
      fetchDemandAndDevData();
    }

  }, [suburbId, dispatch]);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!report) return <p>No report found.</p>;

||||||| parent of bbe4021 (setup react query)
=======
||||||| parent of f480937 (updating datamapper)
=======
  const { suburbId } = useParams<{ suburbId: string }>();

  if (!suburbId || Number.isNaN(suburbId)) {
    return <Navigate to="/" replace />;
  }

>>>>>>> f480937 (updating datamapper)
  const query = useQuery({
    queryKey: [''],
    queryFn: () => getSuburbLivability(suburbId),
  });
  console.log(query.data);

>>>>>>> bbe4021 (setup react query)
  return (
    <PageContainer>
      {/* todo: replace with real banner content */}
      <BannerWrapper>
        <Typography variant="h3" fontWeight={700}>
          Welcome to xxx
        </Typography>
      </BannerWrapper>
      {/* todo: replace with real card content */}
<<<<<<< HEAD
      <MetricCardsSection
        title = {TITLES.demandDevelopment}
        data={demandAndDevCards}
      />
      <MetricCardsSection
        title="Lifestyle Accessibility"
        data={metricCardsData}
      />
      {/* todo:  replace with real action buttons , feel free to modify*/}
      <ActionButtonWrapper>
        <Button>save this suburb</Button>
        <Button>Export PDF</Button>
      </ActionButtonWrapper>
||||||| parent of f480937 (updating datamapper)
      <ContextContainer>
        <MetricCardsSection
          title="Lifestyle Accessibility"
          data={metricCardsData}
        />
        {/* todo:  replace with real action buttons , feel free to modify*/}
        <ActionButtonWrapper>
          <Button>save this suburb</Button>
          <Button>Export PDF</Button>
        </ActionButtonWrapper>
      </ContextContainer>
=======
      <ContentContainer>
        <MetricCardsSection
          title="Lifestyle Accessibility"
          data={metricCardsData}
        />
        {/* todo:  replace with real action buttons , feel free to modify*/}
        <ActionButtonWrapper>
          <Button>save this suburb</Button>
          <Button>Export PDF</Button>
        </ActionButtonWrapper>
      </ContentContainer>
>>>>>>> f480937 (updating datamapper)
    </PageContainer>
  );
};

export default SuburbReportPage;
