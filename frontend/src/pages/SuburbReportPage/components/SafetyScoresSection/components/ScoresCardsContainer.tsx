import { Box, Card, CardContent, Typography, LinearProgress, IconButton, styled } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import theme from '@/styles/theme';

export interface IScoresCardsDto {
  title: string;
  value: number;
  maxValue: number;
  showLevelText: boolean;
  levelText?: string;
  showProgress: boolean;
  percent: number;
  color: 'success' | 'error' | 'warning' | 'primary';
}

interface IScoresCardsContainerProps {
  cardProps: IScoresCardsDto[];
}

const CardsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const ScoreCardWrapper = styled(Card)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(35),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create(['box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const StyledCardContent = styled(CardContent)({
  padding: 0,
  '&:last-child': {
    paddingBottom: 0,
  },
});

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
});

const CardTitle = styled(Typography)(({ theme }) => ({
  ffontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

const InfoButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5),
}));

const ScoreValue = styled(Typography)<{ $color: 'primary' | 'success' }>(({ theme, $color }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.h4.fontSize,
  marginBottom: theme.spacing(1),
  color: theme.palette[$color].main,
}));

const StatusArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const LevelTextDisplay = styled(Typography)<{ $color: 'success' | 'error' | 'warning' | 'primary' }>(
  ({ theme, $color }) => ({
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette[$color].main,
  })
);

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5.5),
}));

const StyledLinearProgress = styled(LinearProgress)<{ $color: 'success' | 'error' | 'warning' | 'primary' }>(
  ({ theme, $color }) => ({
    height: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette[$color].main,
    },
  })
);

const ScoreCardComponent = ({ data }: { data: IScoresCardsDto }) => {
  const { title, value, maxValue, showLevelText, levelText, showProgress, percent, color } = data;

  return (
    <ScoreCardWrapper>
      <StyledCardContent>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <InfoButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </InfoButton>
        </CardHeader>

        <ScoreValue $color={title === 'Affordability Score' ? 'primary' : 'success'}>
          {value.toFixed(1)} / {maxValue.toLocaleString()}
        </ScoreValue>

        <StatusArea>
          {/* Display based on backend determination */}
          {showLevelText && levelText && <LevelTextDisplay $color={color}>{levelText}</LevelTextDisplay>}

          {/* Directly use the percentage calculated by the backend*/}
          {showProgress && (
            <ProgressContainer>
              <StyledLinearProgress variant="determinate" value={percent} $color={color} />
            </ProgressContainer>
          )}
        </StatusArea>
      </StyledCardContent>
    </ScoreCardWrapper>
  );
};

const ScoresCardsContainer = ({ cardProps }: IScoresCardsContainerProps) => {
  return (
    <CardsWrapper>
      {cardProps.map((cardData, id) => (
        <ScoreCardComponent key={`${cardData.title}-${id}`} data={cardData} />
      ))}
    </CardsWrapper>
  );
};

export default ScoresCardsContainer;
