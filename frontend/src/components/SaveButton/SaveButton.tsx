import React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { toggleFavourite } from '../../utils/api/favourite';

type Props = {
  isSaved: boolean;
  onToggle: (newState: boolean) => void;
  targetType: string;
  targetId: number;
};
const SaveButton: React.FC<Props> = ({
  isSaved,
  onToggle,
  targetType,
  targetId,
}) => {
  const handleClick = async () => {
    try {
      const res = await toggleFavourite(targetType, targetId);
      onToggle(res.isSaved);
    } catch (error) {
      console.error('Toggle favourite faild', error);
    }
  };
  return (
    <Button
      variant="outlined"
      startIcon={
        isSaved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />
      }
      onClick={handleClick}
    >
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
};
export default SaveButton;
