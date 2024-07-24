// ** React Imports
import { ChangeEvent, ElementType, useCallback, useContext, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import {
  Button,
  Autocomplete,
  ButtonProps,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiSelect from 'src/@core/components/mui/select'
import MUIDialog from 'src/@core/components/dialog'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'

// ** GraphQL
import { useMutation, useQuery } from '@apollo/client'
import { PatientInput } from './graphql/variables'
import { ADD_PATIENT, UPDATE_PATIENT } from './graphql/mutation'
import { GET_SEARCH_DATA } from './graphql/query'

// ** Custom Components Imports
import EthnicDialog from 'src/components/dialog/ethnic'
import JobDialog from 'src/components/dialog/job'
import PatientGroupDialog from 'src/components/dialog/patient-group'
import PatientTypeDialog from 'src/components/dialog/patient-type'
import OldPlaceTreatmentDialog from 'src/components/dialog/place-treatment'
import toast from 'react-hot-toast'
import moment from 'moment'
import axios from 'axios'
import { GetID } from 'src/hooks/usePrefix'
import { dialogType } from './index'

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  minHeight: 40,
  marginRight: theme.spacing(4),
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    alignItems: 'flex-start',
    minHeight: 40,
    width: '100%',
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main
    }
  }
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

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

type Props = {
  data?: any
  // type?: "add" | "update";
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

const initPatient: PatientInput = {
  id: '',
  name: '',
  phone: '',
  patCccd: '',
  patBhyt: '',
  birthday: '',
  age: 0,
  monthsOld: 0,
  gender: 1,
  status: false,
  address: '',
  patGroupId: '',
  patTypeId: '',
  presenterId: '',
  oldPlaceTreatmentId: '',
  startDate: '',
  endDate: '',
  personalMedHistory: '',
  familyMedHistory: '',
  personalAllergicHistory: '',
  otherDisease: '',
  note: '',
  email: '',
  taxId: '',
  ethnicId: '',
  nationId: '',
  cityId: '',
  districtId: '',
  wardId: '',
  jobId: '',
  workPlace: '',
  famlilyName: '',
  relationshipId: '',
  famlilyPhone: '',
  famlilyCccd: ''
}

const UpdatePatient = (props: Props) => {
  const { data, open, onSubmit } = props
  const { control } = useForm({ defaultValues: initPatient })

  // ** State
  const [input, setInput] = useState<PatientInput>({
    ...data,
    index: undefined,
    __typename: undefined
  })

  const [tab, setTab] = useState('1')
  const [dialogTitle, setDialogTitle] = useState('')
  const [show, setShow] = useMemo(() => open, [open])
  const [imgSrc, setImgSrc] = useState<string>(input.urlImage ?? '/images/no-image.png')
  const [inputValue, setInputValue] = useState<string>('')

  // Data tìm kiếm
  const { data: searchData, refetch: refetchSearchData } = useQuery(GET_SEARCH_DATA)

  const userdata: any[] = useMemo(() => {
    return searchData?.user?.items ?? []
  }, [searchData])

  // ** Sử dụng mutation để thêm mới và cập nhật
  const [addPatient, { data: addData, loading: addLoading, error: addError }] = useMutation(ADD_PATIENT)
  const [updatePatient, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_PATIENT)

  // ** Dialog
  const ethnicOpen = useState(false)
  const jobOpen = useState(false)
  const patGroupOpen = useState(false)
  const patTypeOpen = useState(false)
  const placeTreatmentOpen = useState(false)

  const calculateAge = ((birthday: any) => {
    const currentYear = new Date().getFullYear()
    const birthYear = new Date(birthday).getFullYear()
    const monthAge = new Date(birthday).getMonth()
    return {
      age: currentYear - birthYear,
      monthsOld: monthAge + 1
    }
  })
  console.log(searchData?.patGroup?.items ?? [])
  const handleChange = (key: string, newValue: any) => {
    if (key === "birthday") {
      setInput({
        ...input,
        [key]: newValue,
        age: calculateAge(newValue).age,
        monthsOld: calculateAge(newValue).monthsOld
      })
    } else {
      setInput({
        ...input,
        [key]: newValue
      })
    }
  }

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật khách hàng')
  }, [])

  const onCompleted = useCallback(() => {
    toast.success('Cập nhật khách hàng thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit])

  const submit = useCallback(() => {
    // Kiểm tra dữ liệu
    if (!input?.name) {
      toast.error('Vui lòng nhập tên khách hàng')
      return
    }
    if (!input?.phone) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }
    if (!input?.patTypeId) {
      toast.error('Vui lòng chọn loại khách hàng')
      return
    }
    if (!input?.patGroupId) {
      toast.error('Vui lòng chọn nhóm khách hàng')
      return
    }
    if (Number(input?.age) < 0) {
      toast.error('Vui lòng nhập lại tuổi')
      return
    }
    if (Number(input?.monthsOld) < 0) {
      toast.error('Vui lòng nhập lại tháng tuổi')
      return
    }
    if (Number(input?.age) < 0) {
      toast.error('Vui lòng nhập lại tuổi')
      return
    }

    if (dialogType.value === 'add') {
      addPatient({
        variables: {
          input: {
            ...input,
            clinicId: "CLI0001",
            parentClinicId: "CLI0001"
          }
        },
        onError,
        onCompleted
      })
    } else {
      updatePatient({
        variables: {
          input: JSON.stringify(input)
        },
        onError,
        onCompleted
      })
    }
  }, [addPatient, updatePatient, input, onError, onCompleted])

  const MultipleImageUpload = async (form: FormData): Promise<MultipleUploadResponse> => {
    const url = `/storage/Image/MultiUpload`
    return axios({
      method: 'post',
      url: url,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

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

      MultipleImageUpload(formData)
        .then((response: MultipleUploadResponse) => {
          //handle success
          //console.log(response);
          setImgSrc(response.list![0].path)

          //generate unique id
          //const id = GetID("PI");

          setInput({
            ...input,
            urlImage: response.list![0].path
          })
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
    <MuiDialogContent onSubmit={submit} onClose={handleClose}>
      <TabContext value={tab}>
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

              <Box sx={{ ml: -10, display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}>
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
            </div>
            <Box sx={{ display: 'flex', pr: 10, pt: 10 }}>
              <TabList
                orientation='vertical'
                onChange={(e, newValue) => setTab(newValue)}
                centered={false}
                sx={{ width: '100%' }}
              >
                <Tab value='1' label='Thông tin khách hàng' />
                {dialogType.value === 'update' && <Tab value='2' label='Lịch sử khám bệnh' />}
                {dialogType.value === 'update' && <Tab value='3' label='Lịch sử thuốc' />}
                {dialogType.value === 'update' && <Tab value='4' label='Công nợ' />}
                {dialogType.value === 'update' && <Tab value='5' label='Lịch sử giao dịch' />}
                {dialogType.value === 'update' && <Tab value='6' label='Lịch hẹn' />}
              </TabList>
            </Box>
          </Grid>
          <Grid item flex={1}>
            <TabPanel value='1'>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Typography>Thông tin khách hàng</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Mã khách hàng'
                      placeholder='Nhập mã khách hàng'
                      disabled
                      defaultValue={input?.id}
                      onBlur={e => {
                        handleChange('id', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Tên khách hàng'
                      placeholder='Nhập tên khách hàng'
                      required
                      defaultValue={input?.name}
                      error={input?.name === "" ? true : false}
                      helperText={input?.name === "" ? "Nhập Tên" : ""}
                      onBlur={e => handleChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Số điện thoại'
                      placeholder='Nhập số điện thoại'
                      required
                      defaultValue={input?.phone}
                      onBlur={e => handleChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='CCCD/CMND'
                      placeholder='Nhập CCCD/CMND'
                      defaultValue={input?.patCccd}
                      onBlur={e => {
                        handleChange('patCccd', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='BHYT'
                      placeholder='Nhập BHYT'
                      defaultValue={input?.patBhyt}
                      onBlur={e => {
                        handleChange('patBhyt', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type='date'
                      InputLabelProps={{ shrink: true, placeholder: 'Nhập ngày sinh' }}
                      label='Ngày sinh'
                      placeholder='Nhập ngày sinh'
                      defaultValue={moment.utc(input?.birthday).format('YYYY-MM-DD')}
                      onBlur={e => {
                        handleChange('birthday', moment.utc(e.target.value).toDate().toDateString())
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label='Tuổi'
                      placeholder='Nhập tuổi'
                      value={input.age || ''}
                      onBlur={e => {
                        handleChange('age', Number(e.target.value))
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label='Tháng tuổi'
                      placeholder='Nhập tháng tuổi'
                      value={input?.monthsOld || ''}
                      onBlur={e => {
                        handleChange('monthsOld', Number(e.target.value))
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Giới tính</Typography>
                    <RadioGroup
                      row
                      name='controlled'
                      value={input.gender}
                      onChange={(e, newvalue) => handleChange('gender', parseInt(newvalue))}
                    >
                      <FormControlLabel value={1} control={<Radio />} label='Nam' />
                      <FormControlLabel value={2} control={<Radio />} label='Nữ' />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Trạng thái</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked={input.status}
                          onChange={(e, checked) => {
                            handleChange('status', checked)
                          }}
                        />
                      }
                      label=''
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Địa chỉ'
                      placeholder='Nhập địa chỉ'
                      defaultValue={input?.address}
                      onBlur={e => {
                        handleChange('address', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={3} display='flex' gap={1} alignItems='center'>
                    <MuiSelect
                      fullWidth
                      label='Nhóm khách hàng'
                      required
                      notched={input?.patGroupId ? true : false}
                      data={searchData?.patGroup?.items ?? []}
                      value={input?.patGroupId}
                      onChange={e => {
                        handleChange('patGroupId', e.target.value)
                      }}
                    />
                    <div>
                      <IconButton
                        onClick={() => {
                          setDialogTitle('Thêm mới nhóm khách hàng')
                          patGroupOpen[1](true)
                        }}
                        color='primary'
                      >
                        <Icon icon='bi:plus' fontSize={24} />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={3} display='flex' gap={1} alignItems='center'>
                    <MuiSelect
                      fullWidth
                      label='Loại khách hàng'
                      required
                      notched={input?.patTypeId ? true : false}
                      data={searchData?.patType?.items ?? []}
                      value={input?.patTypeId}
                      onChange={e => {
                        handleChange('patTypeId', e.target.value)
                      }}
                    />
                    <div>
                      <IconButton
                        onClick={() => {
                          setDialogTitle('Thêm mới loại khách hàng')
                          patTypeOpen[1](true)
                        }}
                        color='primary'
                      >
                        <Icon icon='bi:plus' fontSize={24} />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name='presenterId'
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Autocomplete
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                          value={userdata.find(option => option.id === input?.presenterId) || null}
                          options={userdata}
                          onChange={(event, newValue) => {
                            onChange(handleChange('presenterId', newValue.id || null))
                          }}
                          
                          defaultValue={userdata}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Người giới thiệu'
                              placeholder='Chọn người giới thiệu'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4} display='flex' gap={1} alignItems='center'>
                    <MuiSelect
                      notched={input?.oldPlaceTreatmentId ? true : false}
                      fullWidth
                      label='Nơi khám ban đầu'
                      required
                      data={searchData?.oldPlaceTreatment?.items ?? []}
                      value={input?.oldPlaceTreatmentId}
                      onChange={e => {
                        handleChange('oldPlaceTreatmentId', e.target.value)
                      }}
                    />
                    <div>
                      <IconButton
                        onClick={() => {
                          setDialogTitle('Thêm mới nơi khám bệnh trước đây')
                          placeTreatmentOpen[1](true)
                        }}
                        color='primary'
                      >
                        <Icon icon='bi:plus' fontSize={24} />
                      </IconButton>
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Ghi chú'
                      placeholder='Nhập ghi chú'
                      defaultValue={input?.note}
                      onBlur={e => {
                        handleChange('note', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type='date'
                      InputLabelProps={{ shrink: true, required: true }}
                      label='Ngày bắt đầu'
                      placeholder='Nhập ngày bắt đầu'
                      defaultValue={moment.utc(input?.startDate).format('YYYY-MM-DD')}
                      onBlur={e => {
                        handleChange('startDate', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      type='date'
                      InputLabelProps={{ shrink: true, required: true }}
                      label='Ngày hết hạn'
                      placeholder='Nhập ngày hết hạn'
                      defaultValue={moment.utc(input?.endDate).format('YYYY-MM-DD')}
                      onBlur={e => {
                        handleChange('endDate', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label='Tiểu sử bệnh bản thân'
                      placeholder='Nhập tiểu sử bệnh bản thân'
                      defaultValue={input?.personalMedHistory}
                      onBlur={e => {
                        handleChange('personalMedHistory', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label='Tiểu sử bệnh gia đình'
                      placeholder='Nhập tiểu sử bệnh gia đình'
                      defaultValue={input?.familyMedHistory}
                      onBlur={e => {
                        handleChange('familyMedHistory', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label='Tiểu sự bệnh dị ứng'
                      placeholder='Nhập tiểu sự bệnh dị ứng'
                      defaultValue={input?.personalAllergicHistory}
                      onBlur={e => {
                        handleChange('personalAllergicHistory', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label='Vấn đề khác'
                      placeholder='Nhập vấn đề khác'
                      defaultValue={input?.otherDisease}
                      onBlur={e => {
                        handleChange('otherDisease', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Email'
                      placeholder='Nhập email'
                      defaultValue={input?.email}
                      onBlur={e => {
                        handleChange('email', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Mã số thuế'
                      placeholder='Nhập mã số thuế'
                      defaultValue={input?.taxId}
                      onBlur={e => {
                        handleChange('taxId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4} display='flex' gap={1} alignItems='center'>
                    <MuiSelect
                      notched={input?.ethnicId ? true : false}
                      data={searchData?.ethnic?.items ?? []}
                      label='Dân tộc'
                      fullWidth
                      value={input?.ethnicId}
                      onChange={e => {
                        handleChange('ethnicId', e.target.value)
                      }}
                    />
                    <div>
                      <IconButton
                        onClick={() => {
                          setDialogTitle('Thêm mới dân tộc')
                          ethnicOpen[1](true)
                        }}
                        color='primary'
                      >
                        <Icon icon='bi:plus' fontSize={24} />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.nationId ? true : false}
                      data={searchData?.nation?.items ?? []}
                      fullWidth
                      label='Quốc tịch'
                      value={input?.nationId}
                      onChange={e => {
                        handleChange('nationId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.cityId ? true : false}
                      data={searchData?.city?.items ?? []}
                      fullWidth
                      label='Tỉnh/Thành phố'
                      value={input?.cityId}
                      onChange={e => {
                        handleChange('cityId', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.districtId ? true : false}
                      data={searchData?.district?.items ?? []}
                      fullWidth
                      label='Quận/Huyện'
                      value={input?.districtId}
                      onChange={e => {
                        handleChange('districtId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.districtId ? true : false}
                      data={searchData?.ward?.items ?? []}
                      fullWidth
                      label='Phường/Xã'
                      value={input?.wardId}
                      onChange={e => {
                        handleChange('wardId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.jobId ? true : false}
                      data={searchData?.job?.items ?? []}
                      fullWidth
                      label='Nghề nghiệp'
                      value={input?.jobId}
                      onChange={e => {
                        handleChange('jobId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={4.8}>
                    <TextField
                      fullWidth
                      label='Nơi làm việc'
                      placeholder='Nhập nơi làm việc'
                      defaultValue={input?.workPlace}
                      onBlur={e => {
                        handleChange('workPlace', e.target.value)
                      }}
                    />
                  </Grid>

                  <Grid item xs={4.8}>
                    <TextField
                      fullWidth
                      label='Tên người thân'
                      placeholder='Nhập tên người thân'
                      defaultValue={input?.famlilyName}
                      onBlur={e => {
                        handleChange('famlilyName', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <MuiSelect
                      notched={input?.relationshipId ? true : false}
                      data={searchData?.relationship?.items ?? []}
                      fullWidth
                      label='Quan hệ'
                      value={input?.relationshipId}
                      onChange={e => {
                        handleChange('relationshipId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='Số điện thoại người thân'
                      placeholder='Nhập số điện thoại người thân'
                      onBlur={e => {
                        handleChange('famlilyPhone', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      fullWidth
                      label='CCCD/CMT người thân'
                      placeholder='Nhập CCCD/CMT người thân'
                      defaultValue={input?.famlilyCccd}
                      onBlur={e => {
                        handleChange('famlilyCccd', e.target.value)
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value='2'>
              <Typography>
                Brownie cake jujubes pudding caramels. Biscuit powder dragée chocolate bar caramels tiramisu soufflé.
                Danish apple pie sweet roll donut cookie. Sweet roll donut cake dessert donut liquorice dessert. Cake
                bear claw cake gummi bears gingerbread tart pie marzipan. Shortbread shortbread cake danish dragée
                powder.
              </Typography>
            </TabPanel>
            <TabPanel value='3'>
              <Typography>
                Cheesecake fruitcake chocolate donut bear claw tiramisu powder. Wafer caramels oat cake chocolate cake
                pastry soufflé. Ice cream chupa chups cotton candy carrot cake sugar plum cake carrot cake cookie bear
                claw. Carrot cake cotton candy sweet roll liquorice lemon drops lemon drops ice cream jelly beans
                fruitcake.
              </Typography>
            </TabPanel>
          </Grid>
        </Grid>
        <MUIDialog open={ethnicOpen} title={dialogTitle}>
          <EthnicDialog
            open={ethnicOpen}
            onSubmit={() => {
              refetchSearchData()
            }}
          />
        </MUIDialog>
        <MUIDialog open={jobOpen} title={dialogTitle}>
          <JobDialog
            open={jobOpen}
            onSubmit={() => {
              refetchSearchData()
            }}
          />
        </MUIDialog>
        <MUIDialog open={patGroupOpen} title={dialogTitle}>
          <PatientGroupDialog
            open={patGroupOpen}
            onSubmit={() => {
              refetchSearchData()
            }}
          />
        </MUIDialog>
        <MUIDialog open={patTypeOpen} title={dialogTitle}>
          <PatientTypeDialog
            open={patTypeOpen}
            onSubmit={() => {
              refetchSearchData()
            }}
          />
        </MUIDialog>
        <MUIDialog open={placeTreatmentOpen} title={dialogTitle}>
          <OldPlaceTreatmentDialog
            open={placeTreatmentOpen}
            onSubmit={() => {
              refetchSearchData()
            }}
          />
        </MUIDialog>
      </TabContext>
    </MuiDialogContent>
  )
}

UpdatePatient.defaultProps = {
  type: 'add'
}

export default UpdatePatient
