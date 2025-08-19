import { useState } from 'react';
import { Autocomplete, TextField, Box, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setQuery } from '@/store/slices/exploreSlice';

import type { SuggestionList } from '@/interfaces/searchSuggestion';

const formatSuggestList = (option: SuggestionList) => {
  if (!option) return '';
  const right = [option.state, option.postcode].filter(Boolean).join(' ');
  return [option.address, option.name, right].filter(Boolean).join(', ');
};

const SuggestAutocomplete = () => {
  const dispatch = useAppDispatch();
  const { query } = useAppSelector(selector => selector.explore);
  const { suggestions, loading } = useAppSelector(selector => selector.searchSuggest);
  const [focused, setFocused] = useState(false);
  const SUGGESTION_STORAGE_KEY = 'settly:selectedSuggestion';

  return (
    <Autocomplete
      sx={theme => ({
        flexGrow: 1,
        minWidth: 0,
        width: '100%',
        [theme.breakpoints.between(900, 1150)]: { width: '45%' },
        [theme.breakpoints.up(1150)]: { width: 650 },
      })}
      disablePortal
      freeSolo
      options={suggestions as SuggestionList[]}
      getOptionLabel={option => (typeof option === 'string' ? option : formatSuggestList(option))}
      isOptionEqualToValue={(option, value) =>
        option.name === value.name && option.postcode === value.postcode && option.state === value.state
      }
      filterOptions={data => data}
      loading={loading}
      open={focused && query.length >= 3 && suggestions.length > 0}
      inputValue={query}
      onInputChange={(_, value) => dispatch(setQuery(value))}
      onChange={(_, option, reason) => {
        if (reason !== 'selectOption' || !option || typeof option === 'string') return;
        const label = formatSuggestList(option);
        localStorage.setItem(SUGGESTION_STORAGE_KEY, JSON.stringify({ label, option }));
      }}
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
  );
};

export default SuggestAutocomplete;
