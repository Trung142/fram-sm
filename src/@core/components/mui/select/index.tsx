
import { FormControl, Input, InputLabel, MenuItem, Select, TextField, makeStyles } from '@mui/material';
import React, { useEffect } from 'react';

export type SelectData = {
  id: string;
  label: string;
};
type SelectProps = React.ComponentProps<typeof Select>;
interface MuiSelectProps extends SelectProps {
  data: SelectData[];
  isAllowEmpty?: boolean;
  shrink?: boolean;
}


const MuiSelect = (props: MuiSelectProps) => {
  const { classes, className, value, id, label, placeholder, shrink, onChange, data, readOnly, disabled, required, isAllowEmpty, fullWidth, ...rest } = props;

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel shrink={shrink} id={`${id}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-select-label`}
        id={id}
        label={label}
        required={required ?? false}
        readOnly={readOnly ?? false}
        disabled={disabled ?? false}
        placeholder={placeholder}
        value={value ?? ''}
        variant="outlined"
        notched={shrink ?? false}
        onChange={onChange}
        displayEmpty
        MenuProps={{ style: { maxHeight: 300 } }}
        renderValue={(selected: any) => {
          if (!selected) {
            return <label style={{ color: '#aaa' }}>{placeholder}</label>;
          }

          return data.find((item) => item.id === selected)?.label ?? '';
        }}
        {...rest}
      >
        {
          isAllowEmpty === true &&
          (
            <MenuItem value="">
              <em>Không chọn</em>
            </MenuItem>
          )
        }
        {
          data.map((item, index) => (
            <MenuItem key={index} value={item.id}>{item.label}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default MuiSelect;
