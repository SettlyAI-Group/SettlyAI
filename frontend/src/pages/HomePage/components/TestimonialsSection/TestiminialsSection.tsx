import { Typography, Box, Container, styled } from "@mui/material";
import TestimonialCard from "./components/TestimonialCard";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonials?: ITestimonial[];
}

const Heading = styled(Typography)(({ theme }) => ({
  maxWidth: theme.spacing(182.5),
  marginLeft: "auto",
  marginRight: "auto",
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  maxWidth: theme.spacing(192),
  marginLeft: "auto",
  marginRight: "auto",
}));

const TestimonialsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: theme.spacing(8),
}));

const TestimonialsSection = ({ testimonials }: Props) => {
  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container>
        <Heading variant="h3" align="center" gutterBottom>
          Understand the Support Available to You
        </Heading>

        <SubHeading variant="subtitle1" align="center" color="text.secondary" mb={6}>
          We help you understand what's available - from First Home Owner Grants to
          Super Saver Schemes. Always up to date, easy to understand
        </SubHeading>

        <TestimonialsGrid>
          {testimonials?.length ? (
            testimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)
          ) : (
            <Typography>No testimonials available</Typography>
          )}
        </TestimonialsGrid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
