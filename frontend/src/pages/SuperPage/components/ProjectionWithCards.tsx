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

const Wrapper = styled("div")({
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 24,
  width: "100%",
  maxWidth: 896,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  margin: "0 auto",
});

const SectionTitle = styled("h3")({
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 20,
  textAlign: "left",
  margin: 0,
});

const CardsWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 16,
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
}>(({ borderColor, bgColor, textColor }) => ({
  flex: 1,
  minWidth: 0,
  border: `1px solid ${borderColor}`,
  borderRadius: 12,
  backgroundColor: bgColor,
  color: textColor,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const CardLabel = styled("div")({
  fontWeight: 500,
  textAlign: "center",
});

const CardAmount = styled("div")({
  fontWeight: 700,
  fontSize: 20,
  marginBottom: 8,
  textAlign: "center",
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
              <CardAmount>${Math.round(result.netDifference ?? 0).toLocaleString()}</CardAmount>
              <CardLabel>Net Difference</CardLabel>
            </Card>
          </>
        )}
      </CardsWrapper>
    </Wrapper>
  );
}
