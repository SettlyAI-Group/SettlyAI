import { useState } from 'react';
import { TextField, Box, Typography, InputAdornment } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import type { SuggestionList, SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import GetReportButton from './components/GetReportButton';
import { useQuery } from '@tanstack/react-query';
import { searchSuggestion } from '@/api/searchSuggestApi';

const formatSuggestList = (option: SuggestionList) => {
  if (!option) return '';
  const right = [option.state, option.postcode].filter(Boolean).join(' ');
  return [option.address, option.name, right].filter(Boolean).join(', ');
};

type Props = {
  selected: Option | null;
  onSelectedChange: (value: Option | null) => void;
  onGetReport?: () => void;
};

type Option = SuggestionOutputDto;
const StyledAutocomplete = styled(Autocomplete<Option, false, false, true>)(({ theme }) => ({
  flexGrow: 1,
  minWidth: 0,
  width: '100%',
  [theme.breakpoints.between('md', 'lg')]: { width: '45%' },
  [theme.breakpoints.up('lg')]: { width: 650 },
}));

const SearchBar = ({ selected, onSelectedChange, onGetReport }: Props) => {
  const [query, setQuery] = useState('');
  // const [selected, setSelected] = useState<Option | string | null>(null);
  const [focused, setFocused] = useState(false);

  const trimmedQuery = query.trim();
  const { data: options = [], isFetching } = useQuery<SuggestionOutputDto[]>({
    queryKey: ['suggest', trimmedQuery],
    staleTime: 60_000,
    enabled: trimmedQuery.length >= 2,
    queryFn: ({ signal }) => searchSuggestion(trimmedQuery, { signal }),
  });

  return (
    <>
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
        onChange={(_, value) => onSelectedChange(typeof value === 'string' ? null : value)}
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
          paper: { sx: { mt: 1, borderRadius: 2 } },
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
      <GetReportButton onClick={onGetReport} />
    </>
  );
};

export default SearchBar;
