import { useQuery, useMutation } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accordion,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tab,
  TextField,
  TextareaAutosize,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'

import { getLocalstorage } from 'src/utils/localStorageSide'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import PrintIcon from '@mui/icons-material/Print'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NoteIcon from '@mui/icons-material/Note'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import AddIcon from '@mui/icons-material/Add'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditorContent from 'src/components/draftjs-wywis/Editor'
import { GET_RES_EXAM_SERVICE_DT, GET_SERVICE_EXAMPLE_VALUE } from '../../components/graphql/query'
import { UPDATE_RES_EXAM_SERVICE_DT } from '../../components/graphql/mutation'
import { useRouter } from 'next/router'
import AllCamera from '../../components/all_camera'
const editor = {
  backgroundColor: 'rgb(255,255,255)',
  height: '400px',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '5px'
}
const toolbar = {
  marginTop: '5px',
  backgroundColor: '#e0e0e0'
}

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#E0E0E0',
  width: '120px',
  minWidth: '120px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #d0d0d0'
}))
const TabListWrapper = styled(TabList)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: 10,
    height: 20
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    color: '#32475CDE',
    border: '1px solid #32475C38',
    borderRadius: '10px 10px 0 0',
    backgroundColor: '#eeeeee',
    minWidth: 200,
    '&:hover': {
      color: '#4aab56',
      backgroundColor: 'transparent'
    },
    '&.Mui-selected': {
      color: '#4aab56',
      backgroundColor: 'transparent',
      borderBottom: '0'
    }
  }
}))
type Props = {
  id: string
}
const EcgProc = (props: Props) => {
  const { data: queryData } = useQuery(GET_RES_EXAM_SERVICE_DT, {
    variables: {
      input: {
        id: { eq: props.id }
      }
    }
  })
  const { data: queryDataExample } = useQuery(GET_SERVICE_EXAMPLE_VALUE, {
    variables: {
      input: {
        serviceId: { eq: queryData?.getResExamServiceDt?.items[0].serviceId },
        deleteYn: { eq: false }
      }
    }
  })
  const data = useMemo(() => queryData?.getResExamServiceDt?.items[0], [queryData?.getResExamServiceDt?.items])
  const example = queryDataExample?.getServiceExampleValue?.items
  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState({
    implementerDoctorId: '',
    note: '',
    date: new Date(),
    serviceExampleValueId: '',
    diagnostic: '',
    resultValue: '',
    commen: ''
  })
  const handleChangeAdd = (key: string, value: any) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }
  const handleChangeChecked = (check: boolean, key: number) => {
    const newList: any[] = imageSrc
    newList[key].checked = check
    setImageSrc(newList)
  }
  const handleSaveImage = () => {
    setImageList(imageSrc.filter(image => image.checked === true))
  }
  const handleDeleteImage = (src: any) => {
    const newList = imageSrc.map(image => {
      if (image === src) {
        return {
          ...image,
          checked: false
        }
      } else return image
    })
    setImageSrc(newList)
    handleSaveImage() 
  }
  const [value, setValue] = useState('image')
  const [camera, connectCamera] = useState<boolean>(false)
  const [pictureCount, setPictureCount] = useState(0)
  const [imageSrc, setImageSrc] = useState<any[]>([])
  const [imageList, setImageList] = useState<any[]>([])
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const [onChangeExampleValue, setChangeExampleValue] = useState(false)
  const [file, setFile] = useState<any[]>([])
  const [image, setImage] = useState<any[]>([])
  const hiddenFileInput = useRef<any>(null)
  const hiddenImageInput = useRef<any>(null)
  const handleUploadFile = (event: React.SyntheticEvent) => {
    hiddenFileInput.current.click()
  }
  const handleUploadImage = (event: React.SyntheticEvent) => {
    hiddenImageInput.current.click()
  }
  const handleChangeImage = (event: any) => {
    const fileUploaded = event.target.files[0]
    setImage(pre => [...pre, fileUploaded])
  }
  const handleChangeFile = (event: any) => {
    const fileUploaded = event.target.files[0]
    setFile(pre => [...pre, fileUploaded])
    console.log(file)
  }
  useEffect(() => {
    if (example) {
      setChangeExampleValue(!onChangeExampleValue)
      const e = example.find((x: any) => x.id === addData.serviceExampleValueId) ?? {}
      setAddData(pre => ({
        ...pre,
        diagnostic: e.valueExample,
        resultValue: e.description
      }))
    }
  }, [addData.serviceExampleValueId])
  const route = useRouter()
  const [updateResExamServiceDt] = useMutation(UPDATE_RES_EXAM_SERVICE_DT)
  const handleChangeStatus = () => {
    updateResExamServiceDt({
      variables: {
        input: JSON.stringify({
          id: props.id,
          status: '1000_100'
        })
      }
    })
  }
  return (
    <Grid container direction={'column'} gap={5}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography textTransform={'uppercase'} variant='h4'>
          Điện tim
        </Typography>
        <Stack direction={'row'} gap={5}>
          <Button color='secondary' variant='contained' startIcon={<ArrowBackIcon />} onClick={() => {
           handleChangeStatus()
            route.push('/subclinical/ecg/')}}>
            Quay lại
          </Button>
          <Button color='warning' variant='contained' startIcon={<PrintIcon />}>
            In kết quả
          </Button>
          <Button color='primary' variant='contained' startIcon={<NoteIcon />}>
            Lưu nháp
          </Button>
          <Button variant='contained' sx={{ backgroundColor: '#3bb549' }} startIcon={<SaveIcon />}>
            Hoàn thành
          </Button>
        </Stack>
      </Stack>
      <Grid container>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textTransform={'uppercase'}>Họ tên</Typography>
              </CustomBox>
              <TextField
                multiline
                rows={2}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Link href='#'>{props.id}</Link>
                    </InputAdornment>
                  )
                }}
                sx={{ whiteSpace: 'normal' }}
                fullWidth
                value={`${data?.resExam?.patName} - [${data?.resExam?.pat?.birthday}] - ${
                  data?.resExam?.gender ? 'Nam' : 'Nữ'
                }`}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textTransform={'uppercase'}>Bác sĩ</Typography>
              </CustomBox>
              <TextField
                multiline
                rows={2}
                fullWidth
                value={`${data?.resExam?.doctor?.lastName} ${data?.resExam?.doctor?.fristName}`}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textTransform={'uppercase'}>Ghi chú</Typography>
              </CustomBox>
              <TextField multiline rows={2} fullWidth value={data?.note} />
            </Stack>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textTransform={'uppercase'}>Dịch vụ</Typography>
              </CustomBox>
              <TextField multiline rows={2} sx={{ whiteSpace: 'normal' }} fullWidth value={data?.service?.name} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textAlign={'center'} textTransform={'uppercase'}>
                  Người thực hiện
                </Typography>
              </CustomBox>
              <TextField multiline rows={2} fullWidth value={`${user.lastName} ${user.firstName}`} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack sx={{ height: '100%' }} direction={'row'}>
              <CustomBox>
                <Typography textAlign={'center'} textTransform={'uppercase'}>
                  Thời gian thực hiện
                </Typography>
              </CustomBox>
              <TextField
                type='datetime-local'
                onChange={e => handleChangeAdd('date', e.target.value)}
                fullWidth
                value={addData.date}
                inputProps={{
                  style: { height: '45px' }
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction={'row'} justifyContent={'space-between'}>
        <Grid item xs={12} md={4.8}>
          <Autocomplete
            options={example}
            value={example ? example.find((x: any) => x.id === addData.serviceExampleValueId) ?? '' : null}
            renderInput={params => <TextField {...params} label='Mẫu kết quả' />}
            onChange={(event: any, newValue: any) => {
              handleChangeAdd('serviceExampleValueId', newValue?.id)
            }}
          />
          <Typography variant='body1' fontWeight={'bold'} mt={5}>
            Mô tả:
          </Typography>
          <EditorContent
            rawContent={addData.diagnostic}
            onAction={handleChangeAdd}
            editorStyle={editor}
            toolbarStyle={toolbar}
            changeKey='diagnostic'
            onChangeExampleValue={onChangeExampleValue}
          />
          <Stack direction={'row'} gap={5} width={'100%'} height={'100px'} justifyContent={'space-between'} mt={5}>
            <Stack width='100%'>
              <Typography fontWeight={'bold'}>Kết luận</Typography>
              <TextareaAutosize
                value={addData.resultValue ?? ''}
                onChange={e => handleChangeAdd('resultValue', e.target.value)}
                style={{
                  width: '100%',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  color: 'currentcolor',
                  fontSize: '1rem',
                  height: '100%',
                  border: 'none'
                }}
              />
            </Stack>
            <Stack width='100%'>
              <Typography fontWeight={'bold'}>Đề nghị của bác sĩ chuyên khoa</Typography>
              <TextareaAutosize

                style={{
                  width: '100%',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  color: 'currentcolor',
                  fontSize: '1rem',
                  height: '100%',
                  border: 'none'
                }}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Accordion sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#ffff' }} />}
              aria-controls='panel1-content'
              id='panel1-header'
              sx={{ width: '20%', backgroundColor: '#0292b1', color: '#ffff' }}
            >
              Kết nối máy
            </AccordionSummary>
            <AccordionDetails sx={{ border: '1px solid #0292b1' }}>
              <Grid container direction={'row'} justifyContent={'space-between'} pt={5}>
                <Grid item direction={'column'} gap={10} xs={12} md={7}>
                  {camera ? (
                    <AllCamera pictureCount={pictureCount} imageSrc={[imageSrc, setImageSrc]} />
                  ) : (
                    <img
                      src={'/images/no-image.png'}
                      alt='image'
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'initial'
                      }}
                    />
                  )}
                  <Stack direction={'row'} gap={5}>
                    <Button color='primary' variant='contained' onClick={() => connectCamera(!camera)}>
                      {!camera ? 'Kết nối máy' : 'Ngắt kết nối máy'}
                    </Button>
                    <Button
                      color='success'
                      variant='contained'
                      disabled={!camera}
                      onClick={() => setPictureCount(pictureCount + 1)}
                    >
                      Chụp ảnh
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4.8}>
                  <Box sx={{ border: '1px solid #e0e0e0' }}>
                    <Box sx={{ backgroundColor: '#e0e0e0', p: 2 }}>
                      <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography variant='body1'>Danh sách hình ảnh</Typography>
                        <Button color='primary' variant='contained' size='small' onClick={() => handleSaveImage()}>
                          Lưu ảnh
                        </Button>
                      </Stack>
                    </Box>
                    <Stack
                      direction={'column'}
                      overflow={'scroll'}
                      sx={{ overflowX: 'hidden' }}
                      gap={5}
                      maxHeight={250}
                      minHeight={250}
                      p={2}
                    >
                      {imageSrc.map((src, key) => (
                        <Stack direction={'row'} key={key}>
                          <Checkbox
                            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                            onChange={e => handleChangeChecked(e.target.checked, key)}
                          />
                          <img
                            src={src.src}
                            alt='image'
                            style={{
                              width: '250px',
                              height: '150px',
                              objectFit: 'initial'
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <TabContext value={value}>
            <TabListWrapper onChange={handleChange}>
              <Tab
                label={
                  <Stack direction={'row'}>
                    <NoteAddIcon />
                    <Typography
                      variant='body1'
                      sx={
                        value === 'image'
                          ? { color: '#4aab56', '&:hover': { color: '#4aab56' } }
                          : { '&:hover': { color: '#4aab56' } }
                      }
                    >
                      Danh sách hình ảnh
                    </Typography>
                  </Stack>
                }
                value='image'
              />
              <Tab
                label={
                  <Stack direction={'row'}>
                    <FileOpenIcon />
                    <Typography
                      variant='body1'
                      sx={
                        value === 'file'
                          ? { color: '#4aab56', '&:hover': { color: '#4aab56' } }
                          : { '&:hover': { color: '#4aab56' } }
                      }
                    >
                      Tệp đính kèm
                    </Typography>
                  </Stack>
                }
                value='file'
              />
            </TabListWrapper>
            <TabPanel
              sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid #e0e0e0', borderTop: 0 }}
              value='image'
            >
              <Box display={'flex'} flexDirection={'column'} gap={5}>
                <Stack direction={'row'} gap={5} alignItems={'center'}>
                  <Typography variant='h6' fontWeight={'bold'}>
                    Hình ảnh
                  </Typography>
                  <Button
                    sx={{ border: '1px solid #3bb549', backgroundColor: '#e9ffeb', color: '#3bb549' }}
                    size='small'
                    onClick={handleUploadImage}
                  >
                    Tải file
                  </Button>
                  <input
                    id='file'
                    type='file'
                    ref={hiddenImageInput}
                    style={{ display: 'none' }}
                    onChange={handleChangeImage}
                    accept="image/*"
                  />
                </Stack>
                <Stack direction={'row'} gap={5}>
                  {imageList.map((src, key) => (
                    <Stack key={key}>
                      <Stack direction={'row'}>
                        <IconButton>
                          <RemoveRedEyeOutlinedIcon />
                        </IconButton>
                        <IconButton>
                          <DownloadForOfflineIcon sx={{ color: '#2f80ed' }} />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon
                            sx={{ color: '#eb5757' }}
                            onClick={() => {
                              handleDeleteImage(src)
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <img
                        src={src.src}
                        alt='image'
                        style={{
                          width: '250px',
                          height: '150px',
                          objectFit: 'initial'
                        }}
                      />
                    </Stack>
                  ))}
                  <Button sx={{ border: '1px solid #e0e0e0', width: '200px', height: '200px', color: '#5e6e7d' }} onClick={handleUploadImage}>
                    <AddIcon />
                    Chọn ảnh
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel
              sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid #e0e0e0', borderTop: 0 }}
              value='file'
            >
              <Box>
                <Stack direction={'row'} gap={5} alignItems={'center'}>
                  <Typography variant='h6' fontWeight={'bold'}>
                    Tệp đính kèm
                  </Typography>
                  <Button
                    sx={{ border: '1px solid #3bb549', backgroundColor: '#e9ffeb', color: '#3bb549' }}
                    size='small'
                    onClick={handleUploadFile}
                  >
                    Tải file
                  </Button>
                  <input
                    id='file'
                    type='file'
                    ref={hiddenFileInput}
                    style={{ display: 'none' }}
                    onChange={handleChangeFile}
                    accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple
                  />
                </Stack>
                {file.map((file, key) => (
                  <Typography key={key}>{file.name}</Typography>
                ))}
              </Box>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EcgProc



