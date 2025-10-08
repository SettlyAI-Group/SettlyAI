import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, styled, Button } from '@mui/material';
import { getPropertyDetail } from '@/api/propertyApi';
import type { TransformedPropertyData } from '@/interfaces/property';
import HeroSection from './components/HeroSection';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const ReportPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const id = Number(propertyId);

  if (!id) return <Navigate to="/" replace />;

  const { data, isLoading, error, refetch } = useQuery<TransformedPropertyData>({
    queryKey: ['propertyDetail', id],
    queryFn: () => getPropertyDetail(propertyId!),
  });

  if (isLoading) return <Typography variant="h5">Loading property...</Typography>;

  if (error)
    return (
      <Box>
        <Typography color="error">Failed to load property.</Typography>
        <Button onClick={() => refetch()}>Retry</Button>
      </Box>
    );

  if (!data) return <Typography>Property not found</Typography>;

  return (
    <Container>
      <HeroSection property={data} />
      {/* Future detail components here */}
    </Container>
  );
};

export default ReportPage;
