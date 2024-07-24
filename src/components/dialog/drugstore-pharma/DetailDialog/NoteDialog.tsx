import { Autocomplete, Box, Button, Grid, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import MUIDialog from 'src/@core/components/dialog'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useQuery } from '@apollo/client'
import { GET_PATEINT, GET_PRESCRIPTION } from './graphql/query'
import moment from 'moment'
import styles from './index.module.scss'
import { IPrescription } from './graphql/variables'
import VisibilityIcon from '@mui/icons-material/Visibility'
type handle = {
  openButtonDialog: boolean
  setOpenButtonDialog: any
  data: any
}

export default function NoteDialog({ openButtonDialog, setOpenButtonDialog, data }: handle) {
  const { handleSubmit, control } = useForm()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [note, setNote] = useState('')

  return (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Thông tin khách hàng'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='notedClient'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                rows={10}
                multiline
                label='Ghi chú khách hàng'
                placeholder={'Nhập ghi chú khách hàng'}
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                defaultValue={note}
                InputProps={{
                  style: { padding: '0px, 12px, 0px, 12px' }
                }}
                onChange={e => setNote(e.target.value)}
              />
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => {
              data({
                note
              })
              setOpenButtonDialog(false)
            }}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
}
