import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import type { IMetricCardData } from '../MetricCardsSection';
import type { IDemandAndDev } from '@/interfaces/DemandAndDev';
import { mapValueToPercentageString } from '@/pages/SuburbReportPage/utils/numberConverters';
import type { ILivability } from '@/interfaces/suburbReport';
import type { IMetricCardProps } from '../components/MetricCard/MetricCard';
import { convertAsFractionOfTen, convertNumberToString, convertWithGreaterThan } from '../../../utils/numberConverters';

interface DemandCardConfig {
  key: keyof IDemandAndDev;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const LivabilityConfig: IMetricCardProps[] = [
  {
    icon: <LocalGroceryStoreIcon />,
    title: 'Supermarket',
    value: '',
  },
  {
    icon: <LocalHospitalIcon />,
    title: 'Hospital',
    value: '',
  },
  {
    icon: <DirectionsCarIcon />,
    title: 'Transport Score',
    value: '',
  },
  {
    icon: <SchoolIcon />,
    title: 'Primary School',
    value: '',
  },
  {
    icon: <SchoolIcon />,
    title: 'Secondary School',
    value: '',
  },
  {
    icon: <DensityMediumIcon />,
    title: 'Hospital Density',
    value: '',
    subtitle: 'per 10,000 people',
  },
];

const DemandAndDevCardsConfig: DemandCardConfig[] = [
  {
    key: 'rentersRatio',
    icon: <PeopleAltOutlinedIcon fontSize="large" />,
    title: 'Renters Ratio',
  },
  {
    key: 'demandSupplyRatio',
    icon: <DomainOutlinedIcon fontSize="large" />,
    title: 'Demand Supply Ratio',
  },
  {
    key: 'buildingApprovals12M',
    icon: <HandymanOutlinedIcon fontSize="large" />,
    title: 'Building Approvals',
    subtitle: '(12 months)',
  },
  {
    key: 'devProjectsCount',
    icon: <DomainOutlinedIcon fontSize="large" />,
    title: 'Development Projects',
    subtitle: '(current)',
  },
];

export function mapDevCardData(apiData: IDemandAndDev): IMetricCardData[] {
  return DemandAndDevCardsConfig.map(cfg => {
    const value = apiData[cfg.key];
    if (cfg.key === 'rentersRatio' || cfg.key === 'demandSupplyRatio') {
      return {
        icon: cfg.icon,
        title: cfg.title,
        value: mapValueToPercentageString(value),
      };
    }
    return {
      icon: cfg.icon,
      title: cfg.title,
      value: value.toLocaleString(),
      subtitle: cfg.subtitle,
    };
  });
}

export const mapLivability = (data: ILivability): IMetricCardProps[] => {
  const ConvertedValues = [
    convertWithGreaterThan(data.supermarketQuantity),
    convertWithGreaterThan(data.hospitalQuantity),
    convertAsFractionOfTen(data.transportScore),
    convertAsFractionOfTen(data.primarySchoolRating),
    convertAsFractionOfTen(data.secondarySchoolRating),
    convertNumberToString(data.hospitalDensity),
  ];

  return LivabilityConfig.map((cfg, index) => ({
    icon: cfg.icon,
    title: cfg.title,
    value: ConvertedValues[index],
    subtitle: cfg.subtitle,
  }));
};
