import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

type SearchInputProps = {
  placeholder?: string;
  onSearch: (searchText: string) => void;
  width?: string | number;
};

const SearchSection = styled(Box)<{ $width?: string | number }>(({ theme, $width }) => ({
  color: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(6.5),
  width: $width || '85%',
  alignItems: 'center',
  textTransform: 'capitalize',
  justifyContent: 'center',
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(6),
    width: '100%',
  },
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: 54,
  borderRadius: 8,
  fontSize: 14,
  '& .MuiInputBase-input': {
    padding: theme.spacing(4, 2),
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.searchButton,
  width: 130,
  height: 42,
  color: 'white',
  display: 'flex',
  borderRadius: '6px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  textTransform: 'capitalize',
}));

const SearchInput = ({ placeholder, onSearch, width }: SearchInputProps) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <SearchSection $width={width}>
      <StyledSearchInput
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleInputChange}
        placeholder={placeholder ? placeholder : 'search'}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
      <SearchButton onClick={handleSearch}>Search</SearchButton>
    </SearchSection>
  );
};

export default SearchInput;
