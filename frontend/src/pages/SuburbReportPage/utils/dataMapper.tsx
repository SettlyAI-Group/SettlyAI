import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import DensityMediumIcon from '@mui/icons-material/DensityMedium'; // 假设用这个
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // 备用

export const metricCardsData = [
  {
    icon: <LocalGroceryStoreIcon />,
    title: 'Supermarket',
    value: '',
    subtitle: null,
  },
  {
    icon: <LocalHospitalIcon />,
    title: 'Hospital',
    value: '',
    subtitle: null,
  },
  {
    icon: <DirectionsCarIcon />,
    title: 'Transport Score',
    value: '',
    subtitle: '/10',
  },
  {
    icon: <SchoolIcon />,
    title: 'Primary School',
    value: '',
    subtitle: '/10',
  },
  {
    icon: <SchoolIcon />,
    title: 'Secondary School',
    value: '',
    subtitle: '/10',
  },
  {
    icon: <DensityMediumIcon />,
    title: 'Hospital Density',
    value: '',
    subtitle: 'per 10,000 people',
  },
];



const matricCardMapper = [
  { key: 1, icon: 1, title: 1, value: '1', subtitle: '1' },
];
