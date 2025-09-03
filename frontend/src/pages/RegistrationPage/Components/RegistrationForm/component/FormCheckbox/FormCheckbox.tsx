import * as React from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  type FormControlProps,
  type FormControlLabelProps,
  type CheckboxProps,
} from '@mui/material';
import { Controller, type Control } from 'react-hook-form';

export interface FormCheckboxProps {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  label: React.ReactNode;
  FormControlProps?: FormControlProps;
  FormControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
  CheckboxProps?: CheckboxProps;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  control,
  label,
  FormControlProps,
  FormControlLabelProps,
  CheckboxProps,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;

        return (
          <FormControl error={!!error} sx={{ mb: 2 }} {...FormControlProps}>
            <FormControlLabel
              {...FormControlLabelProps}
              control={
                <Checkbox
                  {...CheckboxProps}
                  checked={field.value}
                  onChange={(e, next) => {
                    field.onChange(next);
                    CheckboxProps?.onChange?.(e, next);
                  }}
                />
              }
              label={label}
            />
            {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
};
