import { Button, DialogContent, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useCallback, useState } from 'react'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { useMutation } from '@apollo/client'
import { ADD_BATCH } from './graphql/mutation'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MUIDialog from 'src/@core/components/dialog'
export interface SimpleDialogProps {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  productId?: string
}

export default function AddBatch(props: SimpleDialogProps) {
  const { open } = props
  const user = getLocalstorage('userData')
  const [AddBatch] = useMutation(ADD_BATCH)
  const [batch, setBatch] = useState({
    id: '',
    startDate: new Date(),
    endDate: new Date()
  })
  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi thêm số lô mới')
  }, [])

  const onComplet = useCallback(() => {
    toast.success('Thêm số lô mới thành công')
  }, [])
  const handleSubmit = () => {
    const data = {
      batch1: batch.id,
      productId: props.productId,
      startDate: new Date(batch.startDate),
      endDate: new Date(batch.endDate),
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      modifyAt: new Date()
    }
    AddBatch({
      variables: {
        input: data
      },
      onCompleted: e => {
        toast.success('Thêm số lô mới thành công')
        open[1](false)
      },
      onError
    })
  }

  return (
    <MUIDialog open={open} maxWidth='sm' title='Thêm số lô mới'>
      <DialogContent sx={{ p: 5, height: 500 }}>
        <TextField
          defaultValue={batch.id}
          onChange={e => {
            setBatch({
              ...batch,
              id: e.target.value
            })
          }}
          required
          sx={{ width: '100%' }}
          id='outlined-basic'
          label='Mã lô'
          variant='outlined'
        />
        <TextField
          value={props.productId}
          required
          sx={{ width: '100%', marginTop: '20px' }}
          id='outlined-basic'
          label='Mã Sản phẩm'
          variant='outlined'
        />
        <DatePickerWrapper>
          <ReactDatePicker
            selected={batch.startDate}
            autoComplete='true'
            dateFormat={'dd/MM/yyyy'}
            customInput={
              <TextField
                required
                fullWidth
                sx={{ mt: 5 }}
                label='Ngày sản xuất'
                placeholder='dd/mm/yyyy'
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton>
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            }
            onChange={(date: Date) => {
              setBatch({
                ...batch,
                startDate: date
              })
            }}
          />
        </DatePickerWrapper>
        <DatePickerWrapper>
          <ReactDatePicker
            selected={batch.endDate}
            autoComplete='true'
            dateFormat={'dd/MM/yyyy'}
            customInput={
              <TextField
                required
                fullWidth
                sx={{ mt: 5 }}
                label='Ngày hết hạn'
                placeholder='dd/mm/yyyy'
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton>
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            }
            onChange={(date: Date) => {
              setBatch({
                ...batch,
                endDate: date
              })
            }}
          />
        </DatePickerWrapper>
        <Button
          sx={{ marginTop: 10, width: '100%' }}
          variant='contained'
          disableElevation
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Thêm
        </Button>
      </DialogContent>
    </MUIDialog>
  )
}
