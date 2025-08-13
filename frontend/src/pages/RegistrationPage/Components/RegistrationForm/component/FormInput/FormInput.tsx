import { TextField, type TextFieldProps } from '@mui/material';
import {
  Controller,
  type Control,
  type RegisterOptions,
} from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions;
}

export const FormInput = ({
  name,
  control,
  rules,
  helperText,
  ...props
}: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error ? error.message : helperText}
        />
      )}
    />
  );
};
