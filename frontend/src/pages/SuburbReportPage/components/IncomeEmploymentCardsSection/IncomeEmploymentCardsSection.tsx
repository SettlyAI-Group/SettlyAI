//import { useEffect, useState } from 'react';
import { Typography, Box, styled, useTheme } from '@mui/material';
import IncomeEmploymentCard from './components/IncomeEmploymentCard';
import type { IIncomeEmployment } from '@/interfaces/suburbReport';
import {
  convertNumberToString,
  mapValueToPercentageString,
} from '@/pages/SuburbReportPage/utils/numberConverters';

interface ICardData {
  title: string;
  valueDisplay: string;
  percent?: number;
  showProgress: boolean;
  color?: string;
}

const OuterBox = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const InterBox = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(6),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(6),
  justifyContent: 'center',
}));

interface IProps {
  title: string;
  data?: IIncomeEmployment;
}

const IncomeEmploymentCardsSection = ({ title, data }: IProps) => {
  const theme = useTheme();

  if (!data) return <Typography>Loading...</Typography>;

  const jobGrowthValue = mapValueToPercentageString(data.jobGrowthRate);
  const formattedJobGrowth =
    data.jobGrowthRate >= 0 ? `+${jobGrowthValue}` : `${jobGrowthValue}`;

  const formattedData: ICardData[] = [
    {
      title: 'Median Income',
      valueDisplay: `$${convertNumberToString(Math.round(data.medianIncome / 52))}/week`,
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
      valueDisplay: mapValueToPercentageString(data.employmentRate),
      percent: data.employmentRate * 100,
      showProgress: true,
    },
    {
      title: 'White Collar Ratio',
      valueDisplay: mapValueToPercentageString(data.whiteCollarRatio),
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
