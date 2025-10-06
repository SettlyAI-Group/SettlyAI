import { Box, Typography, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Person } from "@mui/icons-material";

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(10),
  flexWrap: "wrap",
  paddingInline: theme.spacing(20),
  marginInline: theme.spacing(6),
}));


const SupportCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  flex: 1,
  minWidth: theme.spacing(75),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const avatarColors = (theme: any) => ({
  grey: {
    backgroundColor: alpha(theme.palette.text.primary, 0.05),
    color: theme.palette.text.secondary,
  },
  black: {
    backgroundColor: theme.palette.common.black, 
    color: theme.palette.common.white,
  },
  orange: {
    backgroundColor: theme.palette.warning.main, 
    color: theme.palette.common.white,
  },
});

const AvatarCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant: "grey" | "black" | "orange" }>(({ theme, variant }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
  ...avatarColors(theme)[variant], 
}));


const AvatarIcon = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    fontSize: "2rem",
    color: "inherit", 
  },
}));

const Name = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.primary,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));

const Quote = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontStyle: "italic",
  color: theme.palette.text.secondary,
}));

const SupportCards = () => {
  const supports = [
    {
      name: "Sarah Chen",
      subtitle: "Melspume",
      quote: "I finally understood home loan risks - Thanks to Settly!",
      variant: "grey" as const,
    },
    {
      name: "Michael Rodriguez",
      subtitle: "Sychey",
      quote: "Their suburb insights saved me months of research!",
      variant: "black" as const,
    },
    {
      name: "Emma Thompson",
      subtitle: "@itsbime",
      quote: "I loved how it explained financial terms in plain English.",
      variant: "orange" as const,
    },
  ];

  return (
      <FlexContainer>
        {supports.map((s, i) => (
          <SupportCard key={i}>
            <AvatarCircle variant={s.variant}>
              <AvatarIcon>
                <Person />
              </AvatarIcon>
            </AvatarCircle>
            <Name>{s.name}</Name>
            <Subtitle>{s.subtitle}</Subtitle>
            <Quote>"{s.quote}"</Quote>
          </SupportCard>
        ))}
      </FlexContainer>
  );
};

export default SupportCards;
