import { Icon } from '@iconify/react'
import { Box, Button, TextField } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import MUIDialog from 'src/@core/components/dialog'

type handle = {
  openButtonDialog: boolean
  setOpenButtonDialog: any
  totalPrice: number
  data: any
}
type ICk = {
  priceCK: number
  ck: number
  status: string
}
export default function CkDialog({ openButtonDialog, setOpenButtonDialog, totalPrice, data }: handle) {
  const [ck, setCk] = useState<ICk>()

  return (
    <MUIDialog open={[openButtonDialog, setOpenButtonDialog]} maxWidth='sm' title='Chiết khấu toàn bộ'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <TextField
            fullWidth
            type='number'
            label='Chiết khấu tiền mặt'
            placeholder={'Nhập ghi chú khách hàng'}
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            value={ck?.priceCK}
            onChange={e => {
              const discountCash = parseInt(e.target.value)
              const discountPercent = ((ck?.priceCK || 0) / totalPrice) * 1000
              setCk({
                priceCK: discountCash,
                ck: Math.round(discountPercent),
                status: 'popupCK'
              })
            }}
          />
          <TextField
            sx={{ mt: 10 }}
            fullWidth
            type='text'
            label='Chiết khấu phần trăm'
            placeholder={'%'}
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            value={(ck?.ck || 0) + '%'}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => {
              setOpenButtonDialog(false)
              data(ck)
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
