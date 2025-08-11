import { useEffect, useState } from 'react';
import { Typography, Box, styled, useTheme } from '@mui/material';
import IncomeEmploymentCard from './components/IncomeEmploymentCard';

interface IIncomeEmploymentData {
  medianIncome: number;
  employmentRate: number;
  whiteCollarRatio: number;
  jobGrowthRate: number;
}

interface ICardData {
  title: string;
  valueDisplay: string;
  percent?: number;
  showProgress: boolean;
  color?: string;
}

const OuterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const InterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(6),
  justifyContent: 'center',
}));

interface IProps {
  title: string;
  suburbId?: number;
}

const IncomeEmploymentCardsSection = ({ title, suburbId }: IProps) => {
  const theme = useTheme();
  const [data, setData] = useState<IIncomeEmploymentData | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const mockApiResponse = {
  //       suburb: {
  //         suburbId: 104,
  //         report: {
  //           id: '104_2050730',
  //           state: 'NSW',
  //           postcode: '2000',
  //           incomeEmployment: {
  //             medianIncome: 119522,
  //             employmentRate: 0.877564,
  //             whiteCollarRatio: 0.77990824,
  //             jobGrowthRate: 0.10071424,
  //           },
  //         },
  //       },
  //     };

  //     await new Promise((r) => setTimeout(r, 300));
  //     setData(mockApiResponse.suburb.report.incomeEmployment);
  //   };

  //   fetchData();
  // }, [suburbId]);

  useEffect(() => {
    if (!suburbId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/suburb/${suburbId}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();

        setData(json.incomeEmployment);
      } catch (err) {
        console.error('Failed to fetch suburb data:', err);
      }
    };

    fetchData();
  }, [suburbId]);

  if (!data) return <Typography>Loading...</Typography>;

  const jobGrowthValue = (data.jobGrowthRate * 100).toFixed(2);
  const formattedJobGrowth =
    data.jobGrowthRate >= 0 ? `+${jobGrowthValue}%` : `${jobGrowthValue}%`;

  const formattedData: ICardData[] = [
    {
      title: 'Median Income',
      valueDisplay: `$${Math.round(data.medianIncome / 52)}/week`,
      showProgress: false,
    },
    {
      title: 'Job Growth Rate (3yr)',
      valueDisplay: formattedJobGrowth,
      showProgress: false,
      color:
        data.jobGrowthRate >= 0
          ? theme.palette.success.main
          : theme.palette.error.main,
    },
    {
      title: 'Employment Rate',
      valueDisplay: `${(data.employmentRate * 100).toFixed(1)}%`,
      percent: data.employmentRate * 100,
      showProgress: true,
    },
    {
      title: 'White Collar Ratio',
      valueDisplay: `${(data.whiteCollarRatio * 100).toFixed(1)}%`,
      percent: data.whiteCollarRatio * 100,
      showProgress: true,
    },
  ];

  return (
    <OuterBox>
      <Typography variant="h4" mb={2}>
        {title}
      </Typography>
      <InterBox>
        {formattedData.map((card, idx) => (
          <IncomeEmploymentCard key={idx} {...card} />
        ))}
      </InterBox>
    </OuterBox>
  );
};

export default IncomeEmploymentCardsSection;
