import { Card, CardContent, Typography, Avatar, Box, styled } from "@mui/material";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonial: ITestimonial;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  maxWidth: theme.spacing(87.5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
  paddingBottom: theme.spacing(2),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(5),
  marginBottom: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
}));

const Quote = styled(Typography)(() => ({
  fontStyle: "italic",
  fontSize: "14px",
}));

const TestimonialCard = ({ testimonial }: Props) => {
  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <HeaderBox>
          <StyledAvatar src={testimonial.avatarUrl} alt={testimonial.name} />
          <Typography variant="body2">{testimonial.name}</Typography>
        </HeaderBox>
        <Quote variant="body2" color="text.secondary">
          “{testimonial.quote}”
        </Quote>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TestimonialCard;
