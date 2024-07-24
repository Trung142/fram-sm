import React from 'react'
import MenuItem from '@mui/material/MenuItem'

const FilterDropdown = ({ options, onClick }) => {
  return (
    <>
      {options.map(option => (
        <MenuItem key={option.value} onClick={onClick} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </>
  )
}

export default FilterDropdown
