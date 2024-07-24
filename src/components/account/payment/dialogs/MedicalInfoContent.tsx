import { memo, useEffect, useCallback, useContext, useMemo } from 'react'
// Other imports
import {
  Box,
  Button,
  ButtonProps,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  styled,
  Autocomplete
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import QrCodeIcon from '@mui/icons-material/QrCode'
import SurvivalCard from '../cards/SurvivalCard'
import { useForm, Controller } from 'react-hook-form'
import { Examination } from '../graphql/types'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_RES_EXAM } from '../graphql/query'
import CardTemplate from '../cards/CardTemplate'
import { QueryContext } from '../QueryProvider'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'

const initRegister: Examination = {
  id: '',
  gender: 0,
  departmentId: null,
  dob: null,
  age: null,
  monthsOld: null,
  patId: null,
  year: null,
  phone: null,
  reasonExam: '',
  presenterId: null,
  patName: '',
  parentName: '',
  relationshipId: null,
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
  bp1: 0,
  bp2: 0,
  weight: 0,
  height: 0,
  bmi: 0,
  startDate: null,
  endDate: null,
  fiveYearFullDate: null,
  exploreObjectsId: null,
  patBhyt: '',
  benefitLevelId: null,
  glandTypeId: null,
  areaId: null,
  fromInsuranceId: null,
  swElseComeId: null,
  oldPlaceTreatmentId: null,
  appointmentDate: null,
  patGroupId: null,
  fristDayOfLastPeriod: '',
  dateOfConception: ''
}

const MedicalInfoContent: React.FC<{ resExamId: string }> = ({ resExamId }) => {
  const { control, setValue, reset } = useForm<Examination>({ defaultValues: initRegister })

  const [getResExam] = useLazyQuery(GET_RES_EXAM, {
    variables: {
      input: {
        id: { eq: resExamId }
      }
    }
  })

  const {
    getExploreObject,
    getPatGroupData,
    getDepartmentData,
    getUserData,
    getRelationshipData,
    getBenefitLevelData,
    getAreaData,
    getFromInsuranceData,
    getGlandTypeData,
    getOldPlaceTreatmentData
  } = useContext(QueryContext)

  // const { data: getPatientData } = useQuery(GET_PATIENT)

  // const { data: getAppointmentScheduleData } = useQuery(GET_APPOINT_SCHEDULE)

  const benefitLevelData = useMemo(() => {
    return getBenefitLevelData?.getBenefitLevel?.items ?? []
  }, [getBenefitLevelData])

  const areaData = useMemo(() => {
    return getAreaData?.getArea?.items ?? []
  }, [getAreaData])

  const fromInsuranceData = useMemo(() => {
    return getFromInsuranceData?.getFromInsurance?.items ?? []
  }, [getFromInsuranceData])

  const glandTypeData = useMemo(() => {
    return getGlandTypeData?.getGlandType?.items ?? []
  }, [getGlandTypeData])

  const oldPlaceTreatmentData = useMemo(() => {
    return getOldPlaceTreatmentData?.getOldPlaceTreatment?.items ?? []
  }, [getOldPlaceTreatmentData])

  const relationshipData: any[] = useMemo(() => {
    return getRelationshipData?.getRelationship?.items ?? []
  }, [getRelationshipData])

  // const patientData: any[] = useMemo(() => {
  //   return getPatientData?.getPatient?.items ?? []
  // }, [getPatientData])

  // const appointmentScheduleData: any[] = useMemo(() => {
  //   return getAppointmentScheduleData?.getAppointSchedule?.items ?? []
  // }, [getAppointmentScheduleData])

  const userData: any[] = useMemo(() => {
    return getUserData?.getUser?.items ?? []
  }, [getUserData])

  const userDataRoleDoctor = userData

  const departmentData: any[] = useMemo(() => {
    return getDepartmentData?.getDepartment?.items ?? []
  }, [getDepartmentData])

  const departmentDataTypePK = useMemo(
    () => departmentData.filter(department => department.id.split('_')[0] === 'PK'),
    [departmentData]
  )

  const exploreObjectData: any[] = useMemo(() => {
    return getExploreObject?.getExploreObject?.items ?? []
  }, [getExploreObject])

  const patGroupData: any[] = useMemo(() => {
    return getPatGroupData?.getPatGroup?.items ?? []
  }, [getPatGroupData])

  const removeNullUndefined = useCallback((obj: Record<string, any>) => {
    return Object.entries(obj).reduce((acc: Record<string, any>, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = typeof value === 'object' ? removeNullUndefined(value) : value
      }
      return acc
    }, {})
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data: body }: Record<string, any> = await getResExam()
      const data = body?.getResExam?.items[0]
      console.log('data', data)
      reset({
        ...removeNullUndefined(data)
      })
    })()
  }, [getResExam, resExamId, reset, removeNullUndefined])

  return (
    <Box sx={{ display: 'flex', p: 10, mx: 10 }} component='form'>
      <Grid container spacing={3} rowGap={6}>
        <Grid item xs={2}>
          <Controller
            control={control}
            name='id'
            render={({ field }) => (
              <TextField
                fullWidth
                label='Mã phiếu'
                InputLabelProps={{ shrink: true }}
                placeholder='Chọn mã phiếu'
                value={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            control={control}
            name='exploreObjectsId'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                getOptionLabel={option => `${option.name}`}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                value={exploreObjectData.find(option => option.id === value) || null}
                options={exploreObjectData}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Đối tượng khám'
                    placeholder='Chọn đối tượng khám'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            fullWidth
            label='QR Thẻ BHYT'
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <QrCodeIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2.5}>
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
                onChange={(_, newValue) => {
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
        <Grid item xs={2}>
          <Controller
            name='benefitLevelId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                disablePortal
                value={benefitLevelData.find((option: { id: string }) => option.id === value) || null}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                getOptionLabel={option => option.name}
                options={benefitLevelData}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Mức hưởng'
                    placeholder='Chọn mức hưởng'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            required
            label='Mức hưởng'
            InputLabelProps={{ shrink: true }}
            placeholder='Chọn mức hưởng'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <ArrowDropDownIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            required
            label='Mức hưởng'
            InputLabelProps={{ shrink: true }}
            placeholder='Chọn mức hưởng'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <ArrowDropDownIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name='startDate'
            control={control}
            render={({ field }) => (
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={field.value ? new Date(field.value) : null}
                  dateFormat={'dd/MM/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  customInput={
                    <TextField
                      fullWidth
                      required
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
                    />
                  }
                  onChange={(date: Date) => field.onChange(date)}
                />
              </DatePickerWrapper>
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name='endDate'
            control={control}
            render={({ field }) => (
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={field.value ? new Date(field.value) : null}
                  dateFormat={'dd/MM/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  customInput={
                    <TextField
                      fullWidth
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
                  onChange={(date: Date) => field.onChange(date)}
                />
              </DatePickerWrapper>
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name='fiveYearFullDate'
            control={control}
            render={({ field }) => (
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={field.value ? new Date(field.value) : null}
                  dateFormat={'dd/MM/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  customInput={
                    <TextField
                      fullWidth
                      label='Ngày đủ 5 năm'
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
                  onChange={(date: Date) => field.onChange(date)}
                />
              </DatePickerWrapper>
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            required
            label='Hình thức bảo hiểm'
            InputLabelProps={{ shrink: true }}
            placeholder='Chọn hình thức'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <ArrowDropDownIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Controller
            name='parentName'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Người thân'
                placeholder='Nhập người thân'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={1.8}>
          <Controller
            name='relationshipId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                disablePortal
                options={relationshipData}
                getOptionLabel={option => option.name}
                value={relationshipData.find(option => option.id === value) || null}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Quan hệ'
                    placeholder='Chọn quan hệ'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={1.8}>
          <Controller
            name='parentPhone'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Số điện thoại'
                placeholder='Nhập số điện thoại'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='presenterId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                onChange={(event, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                value={userDataRoleDoctor.find(option => option.id === value) || null}
                options={userDataRoleDoctor}
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
        <Grid item xs={3}>
          <Controller
            name='appointScheduleId'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='search'
                label='Lịch hẹn'
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                value={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name='reasonExam'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Lý do khám'
                placeholder='Nhập lý do khám'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='departmentId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                disablePortal
                options={departmentDataTypePK}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    placeholder='Chọn phòng khám'
                    label='Phòng khám'
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='presenterId'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                autoHighlight
                openOnFocus
                getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                onChange={(event, newValue) => {
                  onChange(newValue ? newValue.id : '')
                }}
                value={userDataRoleDoctor.find(option => option.id === value) || null}
                options={userDataRoleDoctor}
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
        <Grid item xs={3}>
          <Controller
            name='personalMedHistory'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Tiểu sử bệnh bản thân'
                placeholder='Nhập thông tin tiểu sử bệnh bản thân'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='familyMedHistory'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Tiểu sử bệnh gia đình'
                placeholder='Nhập thông tin bệnh gia đình'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='personalAllergicHistory'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Tiểu sử bệnh dị ứng'
                placeholder='Nhập thông tin tiểu sử bệnh dị ứng'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='otherDisease'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Vấn đề khác'
                placeholder='Nhập thông tin vấn đề khác'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='medHistory'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Bệnh sử'
                placeholder='Nhập thông tin bệnh sử'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='body'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Toàn thân'
                placeholder='Nhập thông tin toàn thân'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name='part'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Bộ phận'
                placeholder='Nhập thông tin bộ phận'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField fullWidth label='Chuẩnđoán ban đầu' InputLabelProps={{ shrink: true }} />
        </Grid>
        {/* <SurvivalCard control={control} setValue={setValue} /> */}
        <CardTemplate title='Chỉ số sinh tồn'>
          <CardContent>
            <Grid container>
              <Grid item xs={5}>
                <Grid container columnSpacing={3}>
                  <Grid item xs={3}>
                    <Controller
                      name='paulse'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Mạch (lần/phút)'
                          value={field.value}
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='breathingRate'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          value={field.value}
                          label='Nhịp thở (lần/phút)'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='temperature'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          value={field.value}
                          label='Nhiệt độ C'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='bp1'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          value={field.value}
                          label='Ha mmhg'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    fontWeight: '700',
                    fontSize: '2rem'
                  }}
                >
                  /
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Grid container columnSpacing={3}>
                  <Grid item xs={3}>
                    <Controller
                      name='bp2'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          value={field.value}
                          label='Ha mmhg'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='weight'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Cân nặng (kg)'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='height'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Chiều cao (cm)'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name='bmi'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type='number'
                          label='BMI'
                          InputLabelProps={{ shrink: true }}
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </CardTemplate>
        <CardTemplate title='Chỉ số chuyên khoa'>
          <CardContent>
            <Grid container spacing={3} rowGap={6}>
              <Grid item xs={3}>
                <Controller
                  name='fristDayOfLastPeriod'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      value={field.value}
                      label='Ngày đầu kinh cuối cùng'
                      variant='outlined'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name='dateOfConception'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      value={field.value}
                      label='Ngày thụ thai'
                      variant='outlined'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name='fristDayOfLastPeriod'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      value={field.value}
                      label='Ngày đầu kinh cuối cùng'
                      variant='outlined'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name='otherDisease'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Vấn đề khác'
                      placeholder='Nhập thông tin vấn đề khác'
                      variant='outlined'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </CardTemplate>
      </Grid>
    </Box>
  )
}

export default memo(MedicalInfoContent)
