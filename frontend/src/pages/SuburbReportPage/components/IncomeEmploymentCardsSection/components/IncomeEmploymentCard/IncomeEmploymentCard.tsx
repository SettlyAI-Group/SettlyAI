import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  styled,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


interface IIncomeEmploymentCardProps {
  title: string;
  valueDisplay: string;
  percent?: number;
  showProgress: boolean;
  color?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: theme.spacing(36),
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

const StyledCardContent = styled(CardContent)(() => ({
  padding: 0,
    '&:last-child': {
    paddingBottom: 0,
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: theme.typography.subtitle2.fontSize,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: theme.typography.h4.fontSize,
}));

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: theme.spacing(2),
  borderRadius: 4,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const TitleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

interface ValueBoxProps {
  withProgress?: boolean;
}

const ValueBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'withProgress',
})<ValueBoxProps>(({ theme, withProgress }) => ({
  marginBottom: withProgress ? theme.spacing(4) : 0,
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
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
      <StyledCardContent>
        {/* Title & Icon */}
        <TitleBox>
          <TitleText color={theme.palette.text.secondary}>{title}</TitleText>
          <IconWrapper>
            <InfoOutlinedIcon fontSize="small" />
          </IconWrapper>
        </TitleBox>

        {/* Value */}
        <ValueBox withProgress={showProgress}>
          <ValueText color={color || theme.palette.primary.main}>
            {valueDisplay}
          </ValueText>
        </ValueBox>

        {/* Progress */}
        {showProgress && percent !== undefined && (
          <ProgressWrapper>
            <StyledProgress variant="determinate" value={percent} />
          </ProgressWrapper>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

export default IncomeEmploymentCard;
