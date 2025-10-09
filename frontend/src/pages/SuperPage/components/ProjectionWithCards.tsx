import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import type { SuperEstimateResponseDto } from "../../../api/superEstimateApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  result: SuperEstimateResponseDto;
}

const Wrapper = styled("div")(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: theme.spacing(6),
  width: "100%",
  maxWidth: theme.spacing(224),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(6),
  margin: "0 auto",
}));

const SectionTitle = styled("h3")({
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 20,
  textAlign: "left",
  margin: 0,
});

const CardsWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  flexWrap: "wrap",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const Card = styled("div")<{
  borderColor: string;
  bgColor: string;
  textColor: string;
}>(({ borderColor, bgColor, textColor, theme }) => ({
  flex: 1,
  minWidth: 0,
  border: `1px solid ${borderColor}`,
  borderRadius: 12,
  backgroundColor: bgColor,
  color: textColor,
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const CardLabel = styled("div")({
  fontWeight: 500,
  textAlign: "center",
});

const CardAmount = styled("div")(({ theme }) => ({
  fontWeight: 700,
  fontSize: 20,
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const InfoContainer = styled("div")(({ theme }) => ({
  borderTop: "1px solid #E5E7EB",
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const InfoSection = styled("div")(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: 0,
  padding: 0,
  width: "100%",
  maxWidth: theme.spacing(224),
  minHeight: theme.spacing(47),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: theme.spacing(4),
  boxSizing: "border-box",
}));

const InfoText = styled("p")({
  fontFamily: "Inter, sans-serif",
  fontSize: 16,
  fontWeight: 400,
  color: "#565D6D",
  margin: 0,
});

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  maxWidth: theme.spacing(48.75),
  height: theme.spacing(10),
  borderRadius: 3,
  backgroundColor: "#4C4CDC",
  color: "#FFFFFF",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#3B3BB8",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  maxWidth: theme.spacing(61),
  height: theme.spacing(10),
  borderRadius: 3,
  backgroundColor: "#FFFFFF",
  color: "#000000",
  border: "1px solid #DEE1E6",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
}));

const DisclaimerText = styled("p")({
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 400,
  color: "#565D6D",
  margin: 0,
});

export default function ProjectionWithCards({ result }: Props) {
  const labels = result.withoutFhss.map((p) => p.age);

  const datasets: any[] = [
    {
      label: "Without FHSS",
      data: result.withoutFhss.map((p) => p.balance),
      borderColor: "rgba(136, 132, 216, 1)",
      backgroundColor: "rgba(136, 132, 216, 0.2)",
      tension: 0.4,
    },
  ];

  if (result.withFhss) {
    datasets.push({
      label: "With FHSS",
      data: result.withFhss.map((p) => p.balance),
      borderColor: "rgba(130, 202, 157, 1)",
      backgroundColor: "rgba(130, 202, 157, 0.2)",
      tension: 0.4,
    });
  }

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `$${Math.round(value / 1000)}k`;
          },
        },
      },
      x: { title: { display: true, text: "Age" } },
    },
  };

  const withoutFinal = result.withoutFhss[result.withoutFhss.length - 1].balance;
  const withFinal = result.withFhss
    ? result.withFhss[result.withFhss.length - 1].balance
    : null;

  return (
    <Wrapper>
      <SectionTitle>Visualise Your Super at Retirement</SectionTitle>
      <Line data={data} options={options} />
      <CardsWrapper>
        <Card borderColor="#DEE1E6" bgColor="#FFFFFF" textColor="#000000">
          <CardAmount>${Math.round(withoutFinal).toLocaleString()}</CardAmount>
          <CardLabel>Without FHSS</CardLabel>
        </Card>
        {withFinal !== null && (
          <>
            <Card borderColor="#BFDBFE" bgColor="#EFF6FF" textColor="#4C4CDC">
              <CardAmount>${Math.round(withFinal).toLocaleString()}</CardAmount>
              <CardLabel>With FHSS</CardLabel>
            </Card>
            <Card borderColor="#FED7AA" bgColor="#FFF7ED" textColor="#EA580C">
              <CardAmount>
                ${Math.round(result.netDifference ?? 0).toLocaleString()}
              </CardAmount>
              <CardLabel>Net Difference</CardLabel>
            </Card>
          </>
        )}
      </CardsWrapper>

      <InfoContainer>
        <InfoSection>
          <InfoText>
            Withdrawing part of your super now may reduce your retirement balance,
            but owning a home earlier can improve long-term financial stability.
          </InfoText>
          <ButtonGroup>
            <PrimaryButton
              onClick={() =>
                window.open(
                  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/early-access-to-super/first-home-super-saver-scheme",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Learn about FHSS (ATO)
            </PrimaryButton>

            <SecondaryButton>
              Discuss with a financial adviser
            </SecondaryButton>
          </ButtonGroup>
          <DisclaimerText>
            This tool provides general information only and does not constitute financial advice.
          </DisclaimerText>
        </InfoSection>
      </InfoContainer>
    </Wrapper>
  );
}
