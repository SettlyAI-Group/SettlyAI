import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export type FormInputProps = Omit<TextFieldProps, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

const FormInput = ({ value, onChange, ...rest }: FormInputProps) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      margin="normal"
      variant="outlined"
      {...rest}
    />
  );
};

export default FormInput;
