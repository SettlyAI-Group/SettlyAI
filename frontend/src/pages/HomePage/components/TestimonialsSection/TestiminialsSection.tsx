import { Typography, Box, Container, styled, Grid } from "@mui/material";
import TestimonialCard from "./components/TestimonialCard";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonials?: ITestimonial[];
}

const StyledSection = styled(Box)(({ theme }) => ({
  paddingTop: `clamp(${theme.spacing(16)}, 10vw, ${theme.spacing(20)})`,
  paddingBottom: `clamp(${theme.spacing(16)}, 10vw, ${theme.spacing(20)})`,
  paddingLeft: `clamp(${theme.spacing(16)}, 10vw, ${theme.spacing(41)})`,
  paddingRight: `clamp(${theme.spacing(16)}, 10vw, ${theme.spacing(41)})`,
}));

const HeadingWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(5),
  marginBottom: theme.spacing(15),
}));

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

const TestimonialsSection = ({ testimonials }: Props) => {
  return (
    <StyledSection component="section">
      <Container>
        <HeadingWrapper>
          <Heading variant="h3" align="center" gutterBottom>
            Understand the Support Available to You
          </Heading>

          <SubHeading variant="subtitle1" align="center" color="text.secondary">
            We help you understand what's available - from First Home Owner Grants to
            Super Saver Schemes. Always up to date, easy to understand
          </SubHeading>
        </HeadingWrapper>

        <Grid container spacing={8} justifyContent="center">
          {testimonials?.length ? (
            testimonials.map((t) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
                <TestimonialCard testimonial={t} />
              </Grid>
            ))
          ) : (
            <Typography>No testimonials available</Typography>
          )}
        </Grid>
      </Container>
    </StyledSection>
  );
};

export default TestimonialsSection;
