import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
} from '@mui/material';
import IncomeEmploymentCard from './components/IncomeEmploymentCard';
import type { IIncomeEmploymentCard } from './utils/incomeEmploymentDataMapper';

interface IIncomeEmploymentCardsProps {
  title: string;
  data?: IIncomeEmploymentCard[];
}

const SectionWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
}));

const DesktopGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(6),
}));

const MobileStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
}));

const IncomeEmploymentCardsSection = ({
  title,
  data,
}: IIncomeEmploymentCardsProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SectionWrapper>
      <SectionTitle>{title}</SectionTitle>

      {!isSmallScreen ? (
        <DesktopGrid>
          {data?.map((card, idx) => (
            <IncomeEmploymentCard key={idx} {...card} />
          ))}
        </DesktopGrid>
      ) : (
        <MobileStack>
          {data?.map((card, idx) => (
            <IncomeEmploymentCard key={idx} {...card} />
          ))}
        </MobileStack>
      )}
    </SectionWrapper>
  );
};

export default IncomeEmploymentCardsSection;
