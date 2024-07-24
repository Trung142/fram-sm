import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import MuiDialogContent from './components/diaglogContent'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { VisuallyHiddenInput } from './components/custom-mui-component'


type Props = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

const ImportServiceGroupExcel = (props: Props) => {
  const theme = useTheme()
  return (
    <MuiDialogContent
      onClose={() => {
        console.log(1)
      }}
      onSubmit={() => {
        console.log('Submit')
      }}
      dialogActionsStyles={{ justifyContent: 'flex-end' }}
      dialogActionsConfirm={
        <>
          <Icon icon='bx:check' />
          Lưu
        </>
      }
      dialogActionsCancel={
        <>
          <Icon icon='bx:x' />
          Đóng
        </>
      }
    >
      <div>
        <>
          <Stack
            sx={{ borderBottom: `1px solid ${theme.palette.primary.main}` }}
            direction='row'
            alignItems='center'
            spacing={2}
          >
            <Typography variant='h6' component='h3' gutterBottom>
              Xử lý dữ liệu
            </Typography>
            <Stack direction='row' spacing={2}>
              (<Icon icon='bx:upload' />
              <Link href='#'>Tải file mẫu tại đây</Link>)
            </Stack>
          </Stack>

          <Button
            sx={{ marginTop: 8 }}
            component='label'
            variant='outlined'
            size='large'
            startIcon={<Icon icon='bx:upload' />}
          >
            Chọn file
            <VisuallyHiddenInput type='file' />
          </Button>
          <Typography variant='body2' sx={{ marginTop: 4 }}>
            <span style={{ color: 'red' }}>(*)</span> Để upload dữ liệu được chính xác nhất, vui lòng điền thông tin
            theo mẫu file.
          </Typography>
        </>
      </div>
    </MuiDialogContent>
  )
}

export default ImportServiceGroupExcel
