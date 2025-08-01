import { InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

type SearchInputProps = {
  placeholder?: string;
};

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1),
  },
}));

const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <StyledSearchInput
      variant="outlined"
      fullWidth
      placeholder={placeholder?placeholder:'search'}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
