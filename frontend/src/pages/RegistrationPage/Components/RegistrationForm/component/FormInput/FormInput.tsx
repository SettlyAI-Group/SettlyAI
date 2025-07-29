import { TextField, type TextFieldProps } from '@mui/material';

export const FormInput = (props: TextFieldProps) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      margin="normal"
      {...props}
    />
  );
};
