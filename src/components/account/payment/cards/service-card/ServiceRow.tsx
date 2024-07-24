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
  exploreObjectData: any
  serviceId: number
  service: Service
  handleRemove: () => void
  handleUpdateService: (service: Service) => void
}> = ({ departmentDataTypePK, groupId, serviceId, service, handleRemove, exploreObjectData, handleUpdateService }) => {
  let price = 0
  if (exploreObjectData[0]?.id === 'EO0000001') {
    price = service.bhytPrice || 0
  } else if (exploreObjectData[0]?.id === 'EO0000002') {
    price = service.price || 0
  } else {
    price = 0
  }
  const quantity = service.quantity || 0
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
      <TableCell style={{ width: '15%' }}>{(price || 0) * quantity}</TableCell>
      <TableCell style={{ width: '15%' }}>{quantity}</TableCell>
      <TableCell style={{ width: '10%' }}>
        <IconButton aria-label='delete' onClick={handleRemove}>
          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default ServiceRow
