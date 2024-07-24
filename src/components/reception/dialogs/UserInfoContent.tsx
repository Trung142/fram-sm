import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
// Other imports
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import CustomerInfoLabel from '../labels/CustomerInfoLabel'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Controller, useForm } from 'react-hook-form'
import { Examination } from '../graphql/types'
import { PatientData } from '../utils/type'
import { MutationContext } from '../MutationProvider'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_APPOINT_SCHEDULE, GET_OLD_PLACE_TREATMENT, GET_RES_EXAM, GET_USER } from '../graphql/query'
import { set } from 'nprogress'
import moment from 'moment'

const initRegister: Record<string, any> = {
  id: '',
  gender: 0,
  departmentId: '',
  dob: '',
  age: '',
  monthsOld: '',
  patId: '',
  year: '',
  phone: '12345',
  reasonExam: '',
  presenterId: '',
  patName: 'sdfsdfsdfsd',
  parentName: '',
  relationshipId: '',
  parentPhone: '',
  patCccd: '',
  address: '',
  body: '',
  part: '',
  medHistory: '',
  personalMedHistory: '',
  familyMedHistory: '',
  otherDisease: '',
  personalAllergicHistory: '',
  paulse: 0,
  breathingRate: 0,
  temperature: 0,
  service: '',
  serviceGroup: '',
  bp1: 0,
  bp2: 0,
  weight: 0,
  height: 0,
  bmi: 0,
  startDate: '',
  endDate: '',
  fiveYearFullDate: '',
  exploreObjectsId: '',
  patBhyt: '',
  benefitLevelId: '',
  glandTypeId: '',
  areaId: '',
  fromInsuranceId: '',
  swElseComeId: '',
  oldPlaceTreatmentId: '',
  appointmentDate: '',
  patGroupId: ''
}

const UserInfoContent: React.FC<{ resExamId: string }> = ({ resExamId }) => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: initRegister
  })

  const { addResExam, addPatient } = useContext(MutationContext)
  const [triggerRefetchData, setTriggerRefetchData] = useState(false)

  const removeNullUndefined = useCallback((obj: Record<string, any>) => {
    return Object.entries(obj).reduce((acc: Record<string, any>, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = typeof value === 'object' ? removeNullUndefined(value) : value
      }
      return acc
    }, {})
  }, [])

  const [getResExam] = useLazyQuery(GET_RES_EXAM, {
    variables: {
      input: {
        id: { eq: resExamId }
      }
    }
  })

  const { data: getOldPlaceTreatmentData } = useQuery(GET_OLD_PLACE_TREATMENT)
  const { data: getUserData } = useQuery(GET_USER)

  const oldPlaceTreatmentData = useMemo(
    () => getOldPlaceTreatmentData?.getOldPlaceTreatment?.items ?? [],
    [getOldPlaceTreatmentData]
  )
  const userData: any[] = useMemo(() => getUserData?.getUser?.items ?? [], [getUserData])

  useEffect(() => {
    ;(async () => {
      const { data: body }: Record<string, any> = await getResExam()
      const data = body?.getResExam?.items[0]

      reset({
        ...removeNullUndefined(data),
        dob: moment(new Date(data?.dob)).format('yyyy-MM-DD') || '',
        startDate: moment(new Date(data?.startDate)).format('yyyy-MM-DD') || '',
        endDate: moment(new Date(data?.endDate)).format('yyyy-MM-DD') || ''
      })
    })()
  }, [getResExam, resExamId, reset, removeNullUndefined])

  const onSubmit = (data: any) => {
    const newData = {
      ...data,
      age: +data.age || 0
    }

    const processedData = Object.entries(newData).reduce((acc, [key, value]) => {
      if (
        [
          'appointmentTypeId',
          'appointmentDate',
          '__typename',
          'email',
          'receptionistId',
          'scheduleContent',
          'note',
          'id'
        ].includes(key)
      )
        return acc
      acc[key] = value === '' ? null : value
      return acc
    }, {} as typeof data)

    const toggleTriggerRefetchData = () => {
      setTriggerRefetchData((prev: any) => !prev)
    }

    console.log('processedData', processedData)

    toggleTriggerRefetchData()

    if (processedData.patId) {
      addResExam({
        variables: {
          input: processedData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi cập nhật khách hàng')
        },
        onCompleted: () => {
          toast.success('Cập nhật khách hàng thành công')
          toggleTriggerRefetchData()
          reset()
        }
      })
    } else {
      const newPatientData: PatientData = {
        name: processedData.patName || '',
        gender: processedData.gender || 0,
        address: processedData.address || '',
        patCccd: processedData.patCccd || '',
        birthday: processedData.dob || new Date(),
        phone: processedData.phone || '',
        famlilyName: processedData.parentName || '',
        famlilyPhone: processedData.parentPhone || '',
        monthsOld: processedData.monthsOld || 0,
        age: processedData.age || 0,
        oldPlaceTreatmentId: processedData.oldPlaceTreatmentId || null,
        presenterId: processedData.presenterId || null,
        year: processedData.year || 0,
        note: '',
        email: '',
        reasonExam: '',
        status: false,
        bhyt1:processedData.bhyt1 || null,
        bhyt2:processedData.bhyt2 || null,
        bhyt3:processedData.bhyt3 || null,
        bhyt4:processedData.bhyt4 || null,
        bhyt5:processedData.bhyt5 || null,
        bhyt6:processedData.bhyt6 || null,

      }

      addPatient({
        variables: {
          input: newPatientData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo khách hàng mới')
        },
        onCompleted: () => {
          toast.success('Tạo mới khách hàng thành công')
          reset()
        }
      })

      addResExam({
        variables: {
          input: processedData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo đăng ký khám')
        },
        onCompleted: () => {
          toast.success('Tạo mới đăng ký khám thành công')
          reset()
        }
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', p: 10, mx: 10 }} component='form' onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='id'
            render={({ field }) => <TextField {...field} fullWidth label='Mã khám' placeholder='' />}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='patName'
            render={({ field }) => <TextField {...field} fullWidth label='Họ tên' placeholder='Nhập họ tên' />}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Số điện thoại'
                placeholder='Nhập số điện thoại'
                type='number'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='patCccd'
            render={({ field }) => (
              <TextField {...field} fullWidth label='CCCD/CMT' placeholder='' InputLabelProps={{ shrink: true }} />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='patBhyt'
            render={({ field }) => (
              <TextField {...field} fullWidth label='BHYT' placeholder='' InputLabelProps={{ shrink: true }} />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='dob'
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Ngày sinh'
                placeholder=''
                type='date'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={1.2}>
          <Controller
            control={control}
            name='year'
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Năm sinh'
                placeholder=''
                type='number'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={1.2}>
          <Controller
            control={control}
            name='age'
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  fullWidth
                  label='Tuổi'
                  placeholder=''
                  type='number'
                  InputLabelProps={{ shrink: true }}
                />
              )
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <FormLabel>
              Giới tính <strong style={{ color: 'red' }}>*</strong>
            </FormLabel>
            <Controller
              name='gender'
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <RadioGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                  <FormControlLabel value={2} checked={field.value === 2} control={<Radio />} label='Nam' />
                  <FormControlLabel value={1} checked={field.value === 1} control={<Radio />} label='Nữ' />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <>
                <Typography>Trạng thái</Typography>
                <FormControlLabel control={<Switch />} label='' {...field} />
              </>
            )}
          />
        </Grid>

        <Grid item xs={3.2}>
          <Controller
            control={control}
            name='address'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Địa chỉ'
                placeholder='Nhập địa chỉ'
                InputLabelProps={{ shrink: true }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='service'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Loại Dịch Vụ'
                InputLabelProps={{ shrink: true }}
                placeholder='Chọn loại dịch vụ'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <ArrowDropDownIcon />
                    </InputAdornment>
                  )
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='serviceGroup'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Nhóm Dịch Vụ'
                InputLabelProps={{ shrink: true }}
                placeholder='Chọn nhóm dịch vụ'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <ArrowDropDownIcon />
                    </InputAdornment>
                  )
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            name='presenterId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                value={userData.find(option => option.id === value) || null}
                options={userData}
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
        <Grid item xs={4.8}>
          <Controller
            name='oldPlaceTreatmentId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                disablePortal
                options={oldPlaceTreatmentData}
                getOptionLabel={option => option.name}
                value={oldPlaceTreatmentData.find((option: { id: string }) => option.id === value) || null}
                onChange={(event, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Nơi khám chữa bệnh ban đầu'
                    placeholder='Chọn loại đối tượng khám bệnh'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={7.2}>
          <Controller
            control={control}
            name='reasonExam'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Lý do khám'
                InputLabelProps={{ shrink: true }}
                placeholder='Chọn lý do khám'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <ArrowDropDownIcon />
                    </InputAdornment>
                  )
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='startDate'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Ngày bắt đầu'
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
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            control={control}
            name='endDate'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Ngày kết thúc'
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
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            control={control}
            name='reasonExam'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Lý do khám'
                InputLabelProps={{ shrink: true }}
                multiline
                rows={4}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            control={control}
            name='familyMedHistory'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Tiểu sử bệnh gia đình'
                InputLabelProps={{ shrink: true }}
                multiline
                rows={4}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            control={control}
            name='test'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Tiểu sử bệnh dị ứng'
                InputLabelProps={{ shrink: true }}
                multiline
                rows={4}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            control={control}
            name='otherDisease'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Vấn đề khác'
                InputLabelProps={{ shrink: true }}
                multiline
                rows={4}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(UserInfoContent)
