import { useState } from "react";
import SuperForm from "./components/SuperForm";
import ProjectionWithCards from "./components/ProjectionWithCards";
import type { SuperEstimateResponseDto } from "../../api/superEstimateApi";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  justifyContent: 'center',
  margin: '0 auto',
  padding: theme.spacing(6),
}));

const Container = styled(Box)(({ theme }) => ({
  maxWidth: '896px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(7),
}));

const Title = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: 36,
  textAlign: 'center',
});

const Subtitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 16,
  color: '#565D6D',
  textAlign: 'center',
});

export default function SuperPage() {
  const [result, setResult] = useState<SuperEstimateResponseDto | null>(null);

  return (
    <>
      <NavBar />
        <PageWrapper>
          <Container>
            <Title>Plan Your Super & Explore Options</Title>
            <Subtitle>
              Estimate your super balance at retirement and explore different contribution or withdrawal scenarios.
            </Subtitle>

            <SuperForm onResult={setResult} />

            {result && <ProjectionWithCards result={result} />}
          </Container>
        </PageWrapper>
      <Footer />
    </>
  );
}
