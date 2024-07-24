import React from 'react'
import { Avatar, Stack} from '@mui/material'
import { maxHeight } from '@mui/system'

function History() {
  return (
    <>
      <Stack direction='row' spacing={2} style={{maxHeight: '60vh'}}>
        <Avatar alt='Remy Sharp' src='/images/avatars/1.png' />

        <ul>
          <li>tạo form</li>
          <li>xoá vật tư</li>
          <li>chuyển đổi</li>
          <li>Thay đổi giá</li>
          <li>giảm tồn kho</li>
          <li>tăng giá bán</li>
        </ul>
      </Stack>
    </>
  )
}

export default History
