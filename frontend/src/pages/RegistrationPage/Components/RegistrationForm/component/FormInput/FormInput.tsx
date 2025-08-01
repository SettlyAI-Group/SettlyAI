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
  helperText: helperTextProp,
  ...props
}: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const value = field.value;
        const isEmpty = value === '' || value === undefined || value === null;
        const hasError = !!error && !isEmpty;

        let helperText: React.ReactNode;
        let helperColor = 'transparent';

        if (hasError) {
          helperText = error?.message ?? '';
          helperColor = 'error.main';
        }

        if (!hasError && isEmpty && helperTextProp) {
          helperText = helperTextProp;
          helperColor = 'text.secondary'; // 或改成 'green'
        }

        return (
          <TextField
            {...field}
            {...props}
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            error={hasError}
            helperText={helperText}
            slotProps={{
              formHelperText: {
                sx: {
                  color: helperColor,
                  minHeight: '1.5em',
                },
              },
            }}
          />
        );
      }}
    />
  );
};
