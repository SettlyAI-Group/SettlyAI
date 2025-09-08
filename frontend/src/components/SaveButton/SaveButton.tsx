import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CircularProgress } from '@mui/material';
import { useFavourite } from '../../hooks/useFavourite';
import Tooltip from '@mui/material/Tooltip';
import GlobalButton from '../GlobalButton/GlobalButton';
type Props = {
  targetType: string;
  targetId: string | number;
};
const SaveButton = ({ targetType, targetId }: Props) => {
  const { isLoading, isSaved, isToggling, message, handlebuttonClick } = useFavourite(targetType, targetId);
  const isDisabled = isLoading || isToggling;
  return (
    <Tooltip title={message ? message : isSaved ? 'Unsave' : 'Save'}>
      <span>
        <GlobalButton
          width="180"
          height="40"
          variant="outlined"
          disabled={isDisabled}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isSaved ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )
          }
          onClick={handlebuttonClick}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Unsave report' : 'Save report'}
        >
          {isSaved ? 'Saved' : 'Save'}
        </GlobalButton>
      </span>
    </Tooltip>
  );
};
export default SaveButton;
