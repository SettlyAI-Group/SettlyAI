import { Typography, Box, Container, styled } from "@mui/material";
import TestimonialCard from "./components/TestimonialCard";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonials: ITestimonial[];
}

const TestimonialsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(8),
  gridTemplateColumns: "1fr",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "1fr 1fr",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
}));

const TestimonialsSection = ({ testimonials }: Props) => {
  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          Stay Ahead with the Latest Policies & Grants
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" mb={6}>
          We help you understand what's available - from First Home Owner Grants to Super Saver Schemes.
           Always up to date, easy to understand
        </Typography>

        <TestimonialsGrid>
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </TestimonialsGrid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
