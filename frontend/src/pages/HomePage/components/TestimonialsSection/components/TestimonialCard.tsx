import { Card, CardContent, Typography, Avatar, Box, styled } from "@mui/material";
import type { ITestimonial } from "@/interfaces/Testimonial";

interface Props {
  testimonial: ITestimonial;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  width: theme.spacing(87.5),
  height: theme.spacing(50),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const TestimonialCard = ({ testimonial }: Props) => {
  return (
    <StyledCard variant="outlined">
      <CardContent>
        <HeaderBox>
          <Avatar
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            sx={{ width: 56, height: 56, marginRight: 16 }}
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
