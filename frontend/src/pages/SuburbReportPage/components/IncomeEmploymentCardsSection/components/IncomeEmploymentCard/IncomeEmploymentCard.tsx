import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  styled,
} from '@mui/material';
import infoIcon from '@/assets/info.png';

interface IIncomeEmploymentCardProps {
  title: string;
  valueDisplay: string;
  percent?: number;
  showProgress: boolean;
  color?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: theme.spacing(114),
  height: theme.spacing(36),
  padding: theme.spacing(6),
  borderRadius: 8,
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: theme.typography.subtitle2.fontSize,
  lineHeight: '24px',
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: theme.typography.h4.fontSize,
  lineHeight: '32px',
}));

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  width: theme.spacing(102),
  height: theme.spacing(2),
  borderRadius: 4,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const IncomeEmploymentCard = ({
  title,
  valueDisplay,
  percent,
  showProgress,
  color,
}: IIncomeEmploymentCardProps) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <CardContent sx={{ p: 0 }}>
        {/* Title & Icon */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <TitleText color={theme.palette.text.secondary}>{title}</TitleText>
          <IconWrapper>
            <Box
              component="img"
              src={infoIcon}
              alt="info icon"
              sx={{ width: theme.spacing(6), height: theme.spacing(6) }}
            />
          </IconWrapper>
        </Box>

        {/* Value */}
        <Box mb={showProgress ? 1.5 : 0}>
          <ValueText color={color || theme.palette.primary.main}>
            {valueDisplay}
          </ValueText>
        </Box>

        {/* Progress */}
        {showProgress && (
          <Box mt={1}>
            <StyledProgress variant="determinate" value={percent} />
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default IncomeEmploymentCard;
