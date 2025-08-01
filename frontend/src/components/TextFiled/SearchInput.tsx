import { InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles'; 
import SearchIcon from '@mui/icons-material/Search';


type SearchInputProps = {
  placeholder?: string;
};

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  width: '100%',
  maxWidth: '800px',

  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1),
  },
  '::placeholder': {
      fontSize: 14, 
      color: theme.palette.text.secondary,
    },
}));

const SearchInput = ({ placeholder}: SearchInputProps) => {
  
    return (
    <StyledSearchInput
      variant="outlined"
      fullWidth
      placeholder={placeholder}
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
