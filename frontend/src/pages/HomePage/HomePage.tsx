import { useNavigate } from 'react-router-dom';
import TestimonialsSection from "./components/TestimonialsSection";
import type { ITestimonial } from "@/interfaces/Testimonial";
import { getTestimonials } from "@/api/testimonialApi";
import { useQuery } from "@tanstack/react-query";
import { Typography, Button } from '@mui/material';
import { Box, styled } from '@mui/material';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const HomePage = () => {
  const navigate = useNavigate();

  type Suburb = {
    suburbName: string;
    state: string;
    suburbId: number;
  };
  //todo: change to fetch suburb id by suburb name and state
  //check database to match for testing
  const melbourne = { suburbName: 'Melbourn', state: 'VIC', suburbId: 1 };
  const sydney = { suburbName: 'Sydney', state: 'NSW', suburbId: 2 };

  const checkSuburb = (suburb: Suburb) => {
    const { suburbId } = suburb;

    localStorage.setItem('suburbId', suburbId.toString());

    navigate(`/suburb/${suburbId}`);
  };


  const {
    data: testimonials,
    isLoading,
    error,
    refetch,
  } = useQuery<ITestimonial[]>({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  if (isLoading) {
    return (
      <Typography variant="h4">Loading testimonials...</Typography>
    );
  }

  if (error) {
    return (
      <div>
        <Typography variant="h6" color="error">
          Error loading testimonials
        </Typography>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }


  return (
    <Container>
      <HeroSection />
      <FeatureSection />
      <TestimonialsSection testimonials={testimonials} />
      {/* <h1>Home</h1>
      <button onClick={() => checkSuburb(sydney)}>Go to Sydney</button>
      <button onClick={() => checkSuburb(melbourne)}>Go to Melbourne</button> */}
    </Container>

  );
};

export default HomePage;
