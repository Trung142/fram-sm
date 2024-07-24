import React, { useState, useEffect } from 'react'
import { TableRow, TableCell, Typography, TextField, IconButton, Autocomplete } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { Service } from '../../graphql/types'

/*
	EO0000001:  BHXH
	EO0000002: Dịch vụ
	EO0000003: Miễn Phí
*/
const ServiceRow: React.FC<{
  departmentDataTypePK: any[]
  groupId: number
  exploreObjectsId: any
  serviceId: number
  service: Service
  handleRemove: () => void
  handleUpdateService: (service: Service) => void
}> = ({ departmentDataTypePK, groupId, serviceId, service, handleRemove, exploreObjectsId, handleUpdateService }) => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    let calculatedPrice = 0
    if (exploreObjectsId === 'EO0000001') {
      calculatedPrice = service.bhytPrice || 0
    } else if (exploreObjectsId === 'EO0000002') {
      calculatedPrice = service.price || 0
    } else {
      calculatedPrice = 0
    }
    setPrice(calculatedPrice)
  }, [exploreObjectsId, service.bhytPrice, service.price])

  return (
    <TableRow key={service.id}>
      <TableCell style={{ width: '10%' }}>{`${groupId + 1}.${serviceId + 1}`}</TableCell>
      <TableCell style={{ width: '10%' }}>{service.name}</TableCell>
      <TableCell style={{ width: '40%' }}>
        <Autocomplete
          autoHighlight
          openOnFocus
          sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          options={departmentDataTypePK}
          getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
          onChange={(_, newValue) => {
            handleUpdateService({
              ...service,
              departmentId: newValue?.id
            })
            return newValue
          }}
          renderOption={(props, option) => (
            <Typography key={option.id} {...props} variant='body1'>
              {option.name}
            </Typography>
          )}
          renderInput={params => (
            <TextField
              {...params}
              required
              label='Chọn phòng ban'
              sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
          )}
        />
      </TableCell>
      <TableCell style={{ width: '15%' }}>{(price || 0) * (service.quantity || 1)}</TableCell>
      <TableCell style={{ width: '15%' }}>{service.quantity || 0}</TableCell>
      <TableCell style={{ width: '10%' }}>
        <IconButton aria-label='delete' onClick={handleRemove}>
          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default ServiceRow
