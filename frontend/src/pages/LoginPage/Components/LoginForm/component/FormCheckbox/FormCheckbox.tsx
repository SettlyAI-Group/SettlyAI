import { Checkbox, FormControlLabel, type CheckboxProps } from "@mui/material";

export type FormCheckboxProps = Omit<CheckboxProps, "checked" | "onChange"> & {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const FormCheckbox  = ({
  label,
  checked,
  onChange,
  ...rest
} : FormCheckboxProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          {...rest}
        />
      }
      label={label}
    />
  );
};

export default FormCheckbox;