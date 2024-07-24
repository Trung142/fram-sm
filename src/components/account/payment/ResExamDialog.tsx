import { ChangeEvent, ElementType, useState } from 'react'
// Other imports
import MUIDialog from 'src/@core/components/dialog'
import { Box, Button, ButtonProps, Grid, Stack, Tab, Typography, styled } from '@mui/material'
import { TabContext, TabList } from '@mui/lab'
import axios from 'axios'
import { Icon } from '@iconify/react'
import UserInfoContent from './dialogs/UserInfoContent'
import MedicalInfoContent from './dialogs/MedicalInfoContent'
import ServiceInfoContent from './dialogs/ServiceInfoContent'
import { useForm } from 'react-hook-form'

type DialogProps = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  resExamId: string
}

interface MultipleUploadResponse {
  list: ImageInfo[] | null
}

interface ImageInfo {
  url: string
  id: string
  fileName: string
  description: string | null
  path: string
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResExamDialog: React.FC<DialogProps> = ({ open, resExamId }) => {
  const [imgSrc, setImgSrc] = useState<string>('/images/no-image.png')
  const [inputValue, setInputValue] = useState<string>('')
  const [view, setView] = useState<'UserInfo' | 'MedicalInfo' | 'ServiceInfo'>('UserInfo')

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append(`Images[${i}].Description`, file.name)
        formData.append(`Images[${i}].Image`, file)
      }

      const MultipleImageUpload = async (form: FormData): Promise<MultipleUploadResponse> => {
        const url = `/storage/Image/MultiUpload`
        return axios({
          method: 'post',
          url: url,
          data: form,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      MultipleImageUpload(formData)
        .then((response: MultipleUploadResponse) => {
          //handle success
          //console.log(response);
          setImgSrc(response.list![0].path)

          //generate unique id
          //const id = GetID("PI");
        })
        .catch(() => {
          //handle error
          console.log('ERROR')
        })

      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }

  return (
    <MUIDialog open={open} maxWidth={false} title='Thông tin khách hàng'>
      <TabContext value='1'>
        <Grid container display='flex' flexDirection='row'>
          <Grid item display='flex' flexDirection='column' minWidth={260}>
            <div>
              {/* <img src='https://picsum.photos/200/300' alt='avatar'
            style={{
              width: 200,
              height: 200,
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          /> */}

              <Box
                sx={{
                  mx: 10,
                  mt: 10,
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                <ButtonStyled component='label' htmlFor='account-settings-upload-image' sx={{ padding: 0 }}>
                  <img
                    src={imgSrc}
                    alt='avatar'
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: 'cover'
                      // borderRadius: '50%',
                    }}
                  />
                  <input
                    hidden
                    type='file'
                    value={inputValue}
                    accept='image/png, image/jpeg'
                    onChange={handleInputImageChange}
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <Typography sx={{ mt: 2, color: 'text.disabled' }}>Bấm vào ảnh để thay đổi</Typography>
              </Box>
              <Box sx={{ display: 'flex', px: 10, pb: 10, alignItems: 'center' }}>
                <TabList orientation='vertical' centered={false} sx={{ width: '100%' }}>
                  <Tab
                    value='1'
                    label='Thông tin khách hàng'
                    sx={view === 'UserInfo' ? { backgroundColor: '#D9D9D9' } : {}}
                    onClick={() => setView('UserInfo')}
                  />
                  <Tab
                    value='2'
                    label='Thông tin khám'
                    sx={view === 'MedicalInfo' ? { backgroundColor: '#D9D9D9' } : {}}
                    onClick={() => setView('MedicalInfo')}
                  />
                  <Tab
                    value='3'
                    label='Dịch vụ - Đơn thuốc'
                    sx={view === 'ServiceInfo' ? { backgroundColor: '#D9D9D9' } : {}}
                    onClick={() => setView('ServiceInfo')}
                  />
                  <Tab value='4' label='Hóa đơn' sx={{ textAlign: 'start' }} />
                </TabList>
              </Box>
            </div>
          </Grid>
          <Grid item flex={1}>
            {view === 'UserInfo' && <UserInfoContent resExamId={resExamId} />}
            {view === 'MedicalInfo' && <MedicalInfoContent resExamId={resExamId} />}
            {view === 'ServiceInfo' && <ServiceInfoContent />}
          </Grid>
        </Grid>
        <Stack
          sx={{ padding: '20px', backgroundColor: '#D9D9D9' }}
          direction={'row'}
          spacing={12}
          justifyContent={'end'}
        >
          <Button
            variant='contained'
            sx={{ mr: 5, width: '200px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            type='submit'
            // onClick={() => setOpeNewModal(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '200px', backgroundColor: '#8592A3', color: '#fff' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => open[1](false)}
          >
            Đóng
          </Button>
        </Stack>
      </TabContext>
    </MUIDialog>
  )
}

export default ResExamDialog
