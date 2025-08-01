import ActionButtonContainer from '@/pages/SuburbReportPage/components/ActionButtonContainer';
import BannerContainer from '@/components/Banner/BannerContainer';
import BodyContainer from '@/pages/SuburbReportPage/components/BodyContainer';
import CardContainer from '@/pages/SuburbReportPage/components/CardConatiner';
import type { AppDispatch, RootState } from '@/store';
import { fetchSuburbReport, setSuburbId } from '@/store/slices/suburbSlice';
import { Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/Layout/Layout';

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
    <Layout>
      <BannerContainer>
        {/* todo: replace with real banner content */}
        <Typography variant="h3" fontWeight={700}>
          Welcome to {report.suburbName},{report.state},{report.postcode}
        </Typography>
      </BannerContainer>
      <BodyContainer minHeight={1000}>
        {/* todo: replace with real card content */}
        <CardContainer
          minHeight={300}
          title={TITLES.incomeEmployment}
        ></CardContainer>
        <CardContainer
          minHeight={300}
          title={TITLES.propertyMarketInsights}
        ></CardContainer>
        <CardContainer
          minHeight={300}
          title={TITLES.demandDevelopment}
        ></CardContainer>
        <CardContainer minHeight={300} title={TITLES.lifeStyle}></CardContainer>
        <CardContainer
          minHeight={300}
          title={TITLES.safetyScore}
        ></CardContainer>
        <ActionButtonContainer>
          {/* todo:  replace with real action buttons */}
          <Button>save this suburb</Button>
          <Button>Export PDF</Button>
        </ActionButtonContainer>
      </BodyContainer>
    </Layout>
  );
};

export default SuburbReportPage;
