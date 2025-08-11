import MetricCard from './components/MetricCard';
import {
  Box,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

interface IMetricCardData {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
}

interface IMetricCardsSectionProps {
  title: string;
  data: IMetricCardData[];
}

const CardsGroupDesktop = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 220px))',
  columnGap: theme.spacing(6),
  rowGap: theme.spacing(12),
}));

const CardsGroupMobile = styled(Swiper)(({ theme }) => ({
  position: 'relative',
  '& .swiper-button-next, & .swiper-button-prev': {
    width: theme.spacing(10),
    height: theme.spacing(10),
    background: theme.palette.background.paper,
    borderRadius: '50%',
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
    '&::after': {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
    },
    '&:hover': {
      background: theme.palette.background.default,
      boxShadow: theme.shadows[4],
    },
    '&.swiper-button-disabled': {
      background: theme.palette.action.disabledBackground,
      '&::after': {
        color: theme.palette.action.disabled,
      },
    },
  },
  '& .swiper-button-next': {
    right: theme.spacing(1.25),
  },
  '& .swiper-button-prev': {
    left: theme.spacing(1.25),
  },
}));

const MetricCardsSection = ({ title, data }: IMetricCardsSectionProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack direction="column" spacing={8} sx={{ overflow: 'hidden' }}>
      <Typography variant="h4">{title}</Typography>
      {!isSmallScreen ? (
        <CardsGroupDesktop>
          {data.map((card, index) => (
            <MetricCard key={index} {...card} />
          ))}
        </CardsGroupDesktop>
      ) : (
        <CardsGroupMobile
          modules={[Navigation]}
          spaceBetween={theme.spacing(5)}
          slidesPerView="auto"
          navigation
        >
          {data.map((card, index) => (
            <SwiperSlide style={{ width: '220px' }} key={index}>
              <MetricCard {...card} />
            </SwiperSlide>
          ))}
        </CardsGroupMobile>
      )}
    </Stack>
  );
};

export default MetricCardsSection;
