import { useTheme } from '@mui/material';
import type { IIncomeEmployment } from '@/interfaces/suburbReport';
import {
  convertNumberToString,
  mapValueToPercentageString,
} from '@/pages/SuburbReportPage/utils/numberConverters';

export interface IIncomeEmploymentCard {
  title: string;
  valueDisplay: string;
  percent?: number;
  showProgress: boolean;
  color?: string;
}

export const mapIncomeEmployment = (
  data: IIncomeEmployment | undefined
): IIncomeEmploymentCard[] | undefined => {

  const theme = useTheme();
  
  if (!data) return undefined;

  const jobGrowthValue = mapValueToPercentageString(data.jobGrowthRate);
  const formattedJobGrowth =
    data.jobGrowthRate >= 0 ? `+${jobGrowthValue}` : `${jobGrowthValue}`;

  return [
    {
      title: 'Median Income',
      valueDisplay: `$${convertNumberToString(
        Math.round(data.medianIncome / 52)
      )}/week`,
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
};
