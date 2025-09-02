import ActionButtonWrapper from '@/pages/SuburbReportPage/components/ActionButtonGroup/ActionButtonWrapper';
import { Box, Button, styled, Typography } from '@mui/material';
import MetricCardsSection from './components/MetricCardsSection';
import { useQueries } from '@tanstack/react-query';
import { getSuburbBasicInfo, getSuburbLivability } from '@/api/suburbApi';
import { Navigate, useParams } from 'react-router-dom';
import { getDemandAndDev, getHousingMarket } from '@/api/suburbApi';
import { mapDevCardData, mapLivability } from './components/MetricCardsSection/utils/dataMapper';
import Banner from './components/Banner';
import { mapPropertyCards } from '@/pages/SuburbReportPage/components/PropertyMarketInsightsSection';
import PropertyMarketInsightsSection from '@/pages/SuburbReportPage/components/PropertyMarketInsightsSection';
import type { IHousingMarket } from '@/interfaces/housingmarket';

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
const TITLES = {
  incomeEmployment: 'Income & Employment',
  propertyMarketInsights: 'Property Market Insights',
  demandDevelopment: 'Demand & Development',
  lifeStyle: 'LifeStyle & Accessibility',
  safetyScore: 'Safety & Score',
};
const SuburbReportPage = () => {
  const { suburbId } = useParams<{ suburbId: string }>();
  if (!suburbId || Number.isNaN(suburbId)) {
    return <Navigate to="/" replace />;
  }
  const results = useQueries({
    queries: [
      {
        queryKey: ['SuburbBasicInfo', suburbId],
        queryFn: () => getSuburbBasicInfo(suburbId),
      },
      {
        queryKey: ['demandAndDev', suburbId],
        queryFn: () => getDemandAndDev(parseInt(suburbId)),
      },
      {
        queryKey: ['livability', suburbId],
        queryFn: () => getSuburbLivability(suburbId),
      },
      {
        queryKey: ['housingMarket', suburbId],
        queryFn: () => getHousingMarket(Number(suburbId)),
      },
    ],
  });

  const allLoading = results.some(result => result.isLoading);
  const anyError = results.find(result => result.error);

  if (anyError) {
    return (
      /* todo: update error UI */
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          height: '100vh',
          paddingTop: '30%',
        }}
      >
        <div style={{ color: 'red' }}>Error: {anyError.error?.message}</div>
        <div>❌</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  const formattedData = {
    suburbBasicInfo: results[0].data ? results[0].data : undefined,
    demand: results[1].data ? mapDevCardData(results[1].data) : undefined,
    livability: results[2].data ? mapLivability(results[2].data) : undefined,
  };
  const propertyMetrics = results[3]?.data ? mapPropertyCards(results[3].data as IHousingMarket) : [];
  return (
    <PageContainer>
      <Banner
        suburb={formattedData.suburbBasicInfo?.name}
        postcode={formattedData.suburbBasicInfo?.postcode}
        state={formattedData.suburbBasicInfo?.state}
      />
      <ContentContainer>
        {allLoading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '50px',
              height: '100vh',
              paddingTop: '30%',
            }}
          >
            <Typography variant="h4">Loading all data...</Typography>
          </div>
        ) : (
          <>
            <PropertyMarketInsightsSection title={TITLES.propertyMarketInsights} items={propertyMetrics} />
            <MetricCardsSection title={TITLES.demandDevelopment} data={formattedData.demand} />
            <MetricCardsSection title={TITLES.lifeStyle} data={formattedData.livability} />
            {/* todo:  replace with real action buttons , feel free to modify*/}
            <ActionButtonWrapper>
              <Button>save this suburb</Button>
              <Button>Export PDF</Button>
            </ActionButtonWrapper>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};
export default SuburbReportPage;
