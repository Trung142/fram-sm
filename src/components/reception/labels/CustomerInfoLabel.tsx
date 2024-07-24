import { FormControl, FormLabel, TextField } from '@mui/material'
import { Control, Controller } from 'react-hook-form'

const CustomerInfoLabel: React.FC<{
  label: string
  placeholder: string
  type?: string
  required?: boolean
  control: Control<any, any>
  name: string
}> = ({ label, placeholder, required = false, type = 'text', control, name }) => {
  console.log(name)
  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <FormControl fullWidth>
          <FormLabel>
            {label}
            {required ? <strong style={{ color: 'red' }}>*</strong> : ''}
          </FormLabel>
          <TextField fullWidth label={label} placeholder={placeholder} />
        </FormControl>
      )}
    />
  )
}

export default CustomerInfoLabel
