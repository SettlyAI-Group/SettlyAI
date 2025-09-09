import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, type Control, type RegisterOptions } from 'react-hook-form';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions;
  trigger?: (name: any) => Promise<boolean>; // eslint-disable-line @typescript-eslint/no-explicit-any
  hideError?: boolean;
}

export const FormInput = ({ name, control, rules, helperText, trigger, hideError, ...props }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...props}
          {...field}
          onChange={async e => {
            field.onChange(e);
            if (error && trigger) {
              await trigger(name);
            }
          }}
          onBlur={e => {
            field.onBlur();
          }}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          error={!hideError && !!error}
          helperText={!hideError && error ? error.message : helperText}
          slotProps={{
            formHelperText: {
              component: 'div'
            }
          }}
        />
      )}
    />
  );
};
