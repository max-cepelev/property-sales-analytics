import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

interface Props<T> {
  options: T[];
  current: T | null;
  onChange: (option: T | null) => void;
  name: string;
  getOptionLabel: (option: T) => string;
  loading?: boolean;
  width?: string | number;
  size?: 'small' | 'medium';
  noOptionsText?: string;
  fullWidth?: boolean;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export default function AutocompleteSelector<T>({
  options,
  current,
  onChange,
  name,
  getOptionLabel,
  size = 'small',
  loading,
  width,
  noOptionsText = 'Список пуст',
  fullWidth,
  error,
  required,
  helperText,
  disabled,
}: Props<T>) {
  const handleChange = (_: React.SyntheticEvent<Element, Event>, value: T | null) => {
    onChange(value);
  };

  return (
    <Autocomplete
      loading={loading}
      size={size}
      options={options}
      value={current}
      getOptionLabel={getOptionLabel}
      onChange={handleChange}
      disabled={disabled}
      noOptionsText={noOptionsText}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label={name}
          fullWidth={fullWidth}
          helperText={helperText}
          error={error}
          required={required}
          sx={{ width, minWidth: '200px' }}
        />
      )}
    />
  );
}
