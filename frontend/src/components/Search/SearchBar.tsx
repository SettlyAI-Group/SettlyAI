import { useState } from 'react';
import * as React from 'react';
import { TextField, Box, Typography, InputAdornment, Container } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import type { SuggestionList, SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import { useQuery } from '@tanstack/react-query';
import { searchSuggestion } from '@/api/searchSuggestApi';
import GlobalButton from '../GlobalButton';

//Handle the format of data return from Backend Search Suggest Api being shown on the suggestion list to user
const formatSuggestList = (option: SuggestionList) => {
  if (!option) return '';
  const right = [option.state, option.postcode].filter(Boolean).join(' ');
  return [option.address, option.name, right].filter(Boolean).join(', ');
};

//Handle the delayed time period for fetching data when user stop typing in textfield
export const useDebouncedValue = <T,>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

//Set up the type of data return from Backend Search Suggest Api
type Option = SuggestionOutputDto;

//Styling for the Autocomplete & ReportButton Wrap
const StyledAutocomplete = styled(Autocomplete<Option, false, false, true>)(({ theme }) => ({
  width: '100%',
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginLeft: 'auto',
  marginright: 'auto',
  position: 'relative',
  minwidth: { md: 650 },
}));

const ReportButton = styled(GlobalButton)(({ theme }) => ({
  position: 'absolute',
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  height: 56,
  fontSize: theme.typography.subtitle1.fontSize,
  borderRadius: 14,
  [theme.breakpoints.down('md')]: {
    position: 'static',
    transform: 'none',
    width: '100%',
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(6),
  },
}));

type ISearchBarProps = {
  selected: Option | null;
  handleSelected: (value: Option | null) => void;
  handleGetReport?: () => void;
};

const SearchBar = ({ selected, handleSelected, handleGetReport }: ISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 500);

  const trimmedQuery = debouncedQuery.trim();
  const { data: options = [], isFetching } = useQuery<SuggestionOutputDto[]>({
    queryKey: ['suggest', trimmedQuery],
    staleTime: 30_000,
    enabled: trimmedQuery.length >= 3,
    queryFn: ({ signal }) => searchSuggestion(trimmedQuery, { signal }),
  });

  return (
    <SearchBarContainer>
      <StyledAutocomplete
        disablePortal
        freeSolo
        value={selected}
        options={options}
        getOptionLabel={option => (typeof option === 'string' ? option : formatSuggestList(option))}
        isOptionEqualToValue={(option, value) =>
          value != null &&
          typeof value !== 'string' &&
          option.name === value.name &&
          option.postcode === value.postcode &&
          option.state === value.state
        }
        filterOptions={data => data}
        loading={isFetching}
        open={focused && query.length >= 3 && options.length > 0}
        inputValue={query}
        onInputChange={(_, value) => setQuery(value)}
        onChange={(_, value) => handleSelected(typeof value === 'string' ? null : value)}
        onOpen={() => setFocused(true)}
        onClose={() => setFocused(false)}
        slotProps={{
          popper: {
            placement: 'bottom-start',
            modifiers: [
              { name: 'flip', enabled: false },
              { name: 'preventOverflow', options: { altAxis: false } },
            ],
          },
          paper: { sx: { mt: 1, borderRadius: 4 } },
          listbox: {
            sx: {
              py: 0.5,
              maxHeight: 224,
              overflowY: 'auto',
              '& .MuiAutocomplete-option': {
                alignItems: 'center',
                minHeight: 56,
                py: 0.5,
              },
            },
          },
        }}
        noOptionsText=""
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {formatSuggestList(option)}
                </Typography>
                {!!option.address && (
                  <Typography variant="caption" noWrap sx={{ opacity: 0.7 }}>
                    {option.address}
                  </Typography>
                )}
              </Box>
            </li>
          );
        }}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            placeholder="Search suburb or postcode"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={theme => ({
              '& .MuiOutlinedInput-root': {
                borderRadius: theme.shape.borderRadius,
                '& fieldset': { borderRadius: 'inherit' },
              },
            })}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <ReportButton onClick={handleGetReport} variant="contained">
        Get my report
      </ReportButton>
    </SearchBarContainer>
  );
};

export default SearchBar;
