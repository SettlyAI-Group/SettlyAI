import { Card, CardContent, Typography, Avatar, Box, styled } from "@mui/material";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonial: ITestimonial;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  width: "100%",
  maxWidth: theme.spacing(87.5),
  minHeight: theme.spacing(50),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(3),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(5),
  marginBottom: theme.spacing(2),
}));

const TestimonialCard = ({ testimonial }: Props) => {
  return (
    <StyledCard variant="outlined">
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <HeaderBox>
          <Avatar
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            sx={theme => ({
              width: theme.spacing(16),
              height: theme.spacing(16),
            })}
          />
          <Typography variant="body2">{testimonial.name}</Typography>
        </HeaderBox>
        <Typography variant="body2" color="text.secondary">
          “{testimonial.quote}”
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default TestimonialCard;
