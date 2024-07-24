import {
  Grid,
  Button,
  Typography,
  Tab,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Checkbox,
  Menu,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useContext, useEffect, useCallback, useMemo, useState } from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Description from '@mui/icons-material/Description'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import DangKiKhamTab from './RegExaminationTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import DanhSachKhamTab from './ExaminationListTab'
import VideoLabel from '@mui/icons-material/VideoLabel'
import CloudDownload from '@mui/icons-material/CloudDownload'
import DanhSachLichHenTab from './AppointScheduleListTab'
import MUIDialog from 'src/@core/components/dialog'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { GET_USER, GET_PATIENT, GET_APPOINTMENT_TYPE } from './graphql/query'
import { RegisterAppointmentExamination } from './graphql/types'
import { useQuery } from '@apollo/client'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import { MutationContext } from './MutationProvider'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { debounce } from './utils/helpers'
import PrintsComponent from '../prints'

const initRegisterAppointmentExamination: RegisterAppointmentExamination = {
  age: null,
  appointmentDate: null,
  appointmentTypeId: null,
  dob: null,
  doctorId: null,
  email: null,
  gender: 1,
  monthsOld: null,
  note: null,
  patId: null,
  patName: null,
  phone: null,
  presenterId: null,
  reasonExam: null,
  receptionistId: null,
  scheduleContent: null,
  year: null,
  status: '110',
  clinicId: getLocalstorage('userData')?.clinicId,
  parentClinicId: getLocalstorage('userData')?.parentClinicId
  // address: ''
}

const colorActive = {
  color: '#0292B1'
}

// *********************************************************************************** //
// ************************************ Component ************************************ //
// *********************************************************************************** //

const Reception = () => {
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: initRegisterAppointmentExamination
  })
  const [openNewModal, setOpeNewModal] = useState(false)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const [printAppointment, setPrintAppointment] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [appointmentIdAfterCreate, setAppointmentIdAfterCreate] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [resExamId, setResExamId] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [tab, setTab] = useState('dangKiKham')
  const open = Boolean(anchorEl)
  const [searchData, setSearchData] = useState({
    keySearch: '',
    skip: 0,
    take: 25
  })

  const [queriesPatientCondition, setQueriesPatientCondition] = useState({
    input: {},
    skip: searchData.skip,
    take: searchData.take,
    order: [{ createAt: 'DESC' }]
  })
  const { data: getUserData } = useQuery(GET_USER)
  const userData: any[] = useMemo(() => {
    return getUserData?.getUser?.items ?? []
  }, [getUserData])
  const userDataRoleDoctor = userData
  const [print, setPrint] = useState<boolean>(false)
  const { addAppointmentSchedule, addPatient } = useContext(MutationContext)
  const { data: getAppointmentType } = useQuery(GET_APPOINTMENT_TYPE, {})
  const { data: getPatient } = useQuery(GET_PATIENT, {
    variables: queriesPatientCondition
  })
  const appointmentTypeData: any[] = useMemo(() => {
    return getAppointmentType?.getAppointmentType?.items ?? []
  }, [getAppointmentType])
  const patientData: any[] = useMemo(() => {
    return getPatient?.getPatient?.items ?? []
  }, [getPatient])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchPatientData = useCallback(
    debounce(keySearch => {
      setQueriesPatientCondition(x => ({
        ...x,
        skip: 0,
        take: 25,
        input: {
          or: [{ name: { contains: keySearch } }]
        }
      }))
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSetSearchPatientData(searchData.keySearch)
  }, [searchData, debouncedSetSearchPatientData])

  const handleClickUtilities = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSetTab = (val: any) => {
    setTab(val)
  }

  const onSubmit = (data: any) => {
    console.log('data', data)
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === '' ? null : value
      return acc
    }, {} as typeof data)

    processedData.phone = `${processedData.phone}`
    processedData.year = +processedData.year

    if (!processedData.patId) {
      const newPatientData = {
        name: processedData.patName || '',
        gender: processedData.gender || 1,
        address: processedData.address || '',
        patCccd: processedData.patCccd || '',
        birthday: processedData.dob || new Date(),
        phone: processedData.phone || '',
        email: processedData.email || '',
        famlilyName: processedData.parentName || '',
        status: true,
        famlilyPhone: processedData.parentPhone || '',
        monthsOld: processedData.monthsOld || 0,
        age: processedData.age || 0,
        oldPlaceTreatmentId: processedData.oldPlaceTreatmentId || null,
        presenterId: processedData.presenterId || null,
        year: processedData.year || 0,
        note: processedData.note || '',
        reasonExam: processedData.reasonExam || '',
        clinicId: getLocalstorage('userData')?.clinicId,
        parentClinicId: getLocalstorage('userData')?.parentClinicId
      }
      addPatient({
        variables: {
          input: newPatientData
        },
        onCompleted: (data: { addPatient: { id: any } }) => {
          const patientId = data.addPatient.id
          processedData.patId = patientId
          toast.success('Tạo khách hàng thành công')
          addAppointment(processedData)
        },
        onError: (error: { message: any }) => {
          toast.error('Có lỗi xảy ra khi tạo khách hàng')
          console.error('Error creating patient:', error.message)
        }
      })
    } else {
      addAppointment(processedData)
    }
  }

  const addAppointment = (data: any) => {
    console.log('data', data)
    addAppointmentSchedule({
      variables: {
        input: data
      },
      onCompleted: (data: { addAppointSchedule: { id: any } }) => {
        const appointmentId = data.addAppointSchedule.id
        setAppointmentId(appointmentId)
        triggerRefetch()
        toast.success('Tạo lịch hẹn thành công')
        setOpeNewModal(false)
        // setShowSuccessModal(true)
        reset(initRegisterAppointmentExamination)
      },
      onError: (error: { message: any }) => {
        toast.error('Có lỗi xảy ra khi tạo lịch hẹn')
        console.error('Error creating appointment:', error.message)
      }
    })
  }

  const handlePrint = () => {
    console.log('Printing or downloading appointment details for ID:', appointmentIdAfterCreate)
    setShowSuccessModal(false)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleCreateResExamFromAppointSchedule = (data: any) => {
    setTab('dangKiKham')
    setAppointmentIdAfterCreate(data.id)
  }

  const clearAppointmentIdAfterCreate = () => {
    setAppointmentIdAfterCreate('')
  }

  const triggerRefetch = () => {
    setShouldRefetch(true)
  }

  return (
    <Grid container spacing={4} style={{ width: '100%' }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Tiếp đón</h1>
          <Box sx={{ display: 'flex', gap: '11px' }}>
            <Button
              variant='contained'
              onClick={() => setOpeNewModal(true)}
              sx={{ pl: 5, pr: 8, backgroundColor: '#0292B1', width: 245, height: 42 }}
              startIcon={<CalendarTodayIcon />}
            >
              Thêm mới lịch hẹn
            </Button>
            <Box sx={{ display: 'flex' }}>
              <Button
                variant='outlined'
                sx={{ backgroundColor: 'white', borderTopRightRadius: 0, width: 172, height: 42 }}
                onClick={handleClickUtilities}
                endIcon={<ArrowDropDownIcon />}
              >
                Tiện ích
              </Button>
              <Menu id='simple-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    handleClose()
                    window.open('/reception/waiting-screen', '_blank')
                  }}
                >
                  <VideoLabel />
                  Màn Hình Chờ
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Icon icon='bx:bxs-chart' />
                  Tổng quang
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <CloudDownload />
                  Báo cáo
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabContext value={tab}>
            <TabList
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0292B1'
                }
              }}
              value={tab}
              onChange={(e, val) => handleSetTab(val)}
              aria-label='basic tabs example'
            >
              <Tab
                label={
                  <Typography
                    style={tab === 'dangKiKham' ? colorActive : {}}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <NoteAddIcon />
                    <span style={{ height: '100%' }}>Đăng kí khám</span>
                  </Typography>
                }
                value={'dangKiKham'}
              />
              <Tab
                label={
                  <Typography
                    style={tab === 'danhSacKham' ? colorActive : {}}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Description />
                    <span style={{ height: '100%' }}>Danh sách khám</span>
                  </Typography>
                }
                value={'danhSacKham'}
              />
              <Tab
                label={
                  <Typography
                    style={tab === 'danhSachLichHen' ? colorActive : {}}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <EventAvailableIcon />
                    <span style={{ height: '100%' }}>Danh sách lich hẹn</span>
                  </Typography>
                }
                value={'danhSachLichHen'}
              />
            </TabList>
            <TabPanel value='dangKiKham'>
              <DangKiKhamTab
                appointmentScheduleIdWillRegister={appointmentIdAfterCreate}
                triggerRefetch={triggerRefetch}
                clearAppointmentIdAfterCreate={clearAppointmentIdAfterCreate}
              />
            </TabPanel>
            <TabPanel value='danhSacKham'>
              <DanhSachKhamTab />
            </TabPanel>
            <TabPanel value='danhSachLichHen'>
              <DanhSachLichHenTab
                shouldRefetch={shouldRefetch}
                onRefetchComplete={() => setShouldRefetch(false)}
                onCreateResExam={handleCreateResExamFromAppointSchedule}
                triggerRefetch={triggerRefetch}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
      {/* =============================== DIAGLOG ======================================= */}
      {/* =============================== DIAGLOG ======================================= */}
      {/* =============================== DIAGLOG ======================================= */}
      <Dialog open={showSuccessModal} onClose={handleClose}>
        <DialogTitle>Lịch Hẹn Tạo Mới Thành Công</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lịch hẹn của bạn đã được tạo thành công với ID: <strong>{appointmentId}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color='primary'>
            In Phiếu Hẹn
          </Button>
          <Button onClick={handleCloseSuccessModal} color='primary' autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <MUIDialog useFooter={false} maxWidth='xl' open={[openNewModal, setOpeNewModal]} title='Thêm mới lịch khám'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            sx={{ padding: 8 }}
            rowSpacing={4}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems='stretch'
          >
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={7}>
                  <Box sx={{ display: 'flex', marginRight: 2 }}>
                    <Controller
                      name='patName'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          autoHighlight
                          freeSolo
                          openOnFocus
                          sx={{ width: '100%' }}
                          options={patientData}
                          onChange={(e, data) => {
                            if (!!data) {
                              reset({
                                ...getValues(),
                                patName: data.name || null,
                                patId: data.id || null,
                                phone: data.phone || null,
                                email: data.email || null,
                                dob: data.birthday || null,
                                year: data.birthday ? new Date(data.birthday).getFullYear() : null,
                                age: data.age || null,
                                monthsOld: data.monthsOld || null,
                                reasonExam: data.reasonExam || null,
                                appointmentDate: data.appointmentDate || null,
                                appointmentTypeId: data.appointmentTypeId || null,
                                doctorId: data.doctorId || null,
                                receptionistId: data.receptionistId || null,
                                scheduleContent: data.scheduleContent || null,
                                note: data.note || null
                                // address: data.address || ''
                              })
                            } else {
                              reset(initRegisterAppointmentExamination)
                              setSearchData({ ...searchData, keySearch: '' })
                            }
                          }}
                          getOptionLabel={option => (typeof option === 'string' ? option : option.name || '')}
                          renderOption={(props, option) => (
                            <Box
                              component='li'
                              {...props}
                              key={`${option.id}-${option.name}`}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start'
                              }}
                            >
                              <>
                                <Typography variant='body2' sx={{ width: '100%' }}>
                                  <strong>{option.name}</strong> - {option.gender === 1 ? 'Nam' : 'Nữ'}
                                </Typography>
                                <Typography variant='body2' sx={{ width: '100%' }}>
                                  <strong>SĐT:</strong> {option.phone}
                                </Typography>
                                <Typography variant='body2' sx={{ width: '100%' }}>
                                  <strong> Ngày sinh:</strong> {option.dob} - <strong>Tuổi: </strong>
                                  {option.age}
                                </Typography>
                                <Typography variant='body2' sx={{ width: '100%' }}>
                                  <strong>Địa chỉ:</strong> {option.address}
                                </Typography>
                              </>
                            </Box>
                          )}
                          renderInput={params => (
                            <TextField
                              {...params}
                              onChange={e => {
                                const value = e.target.value
                                field.onChange(value === '' ? null : value)
                                setSearchData({ ...searchData, keySearch: value })
                              }}
                              label='Tên khách hàng'
                              placeholder='Nhập tên khách hàng'
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderTopRightRadius: '0px',
                                  borderBottomRightRadius: '0px'
                                }
                              }}
                            />
                          )}
                        />
                      )}
                    />

                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#AEB4AB', width: 56 }}
                    >
                      <svg width='35' height='35' viewBox='0 0 35 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M25.7396 9.26302C23.625 7.14844 20.7229 5.83594 17.5 5.83594C11.0542 5.83594 5.84793 11.0568 5.84793 17.5026C5.84793 23.9484 11.0542 29.1693 17.5 29.1693C22.9396 29.1693 27.475 25.4505 28.7729 20.4193H25.7396C24.5438 23.8172 21.3063 26.2526 17.5 26.2526C12.6729 26.2526 8.75001 22.3297 8.75001 17.5026C8.75001 12.6755 12.6729 8.7526 17.5 8.7526C19.9208 8.7526 22.0792 9.75885 23.6542 11.3484L18.9583 16.0443H29.1667V5.83594L25.7396 9.26302Z'
                          fill='white'
                        />
                      </svg>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <FormControl>
                    <FormLabel>
                      Giới tính <strong style={{ color: 'red' }}>*</strong>
                    </FormLabel>
                    <Controller
                      name='gender'
                      control={control}
                      defaultValue={1}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          aria-labelledby='demo-form-control-label-placement'
                          name='position'
                          defaultValue='top'
                        >
                          <FormControlLabel value={1} control={<Radio />} label='Nam' />
                          <FormControlLabel value={2} control={<Radio />} label='Nữ' />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={4}>
                <Grid item xs={3}>
                  <Controller
                    name='dob'
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
                              label='Ngày sinh'
                              placeholder='Chọn ngày sinh'
                              InputLabelProps={{ shrink: true }}
                            />
                          }
                          onChange={(date: Date) => field.onChange(date)}
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name='year'
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <TextField
                        {...field}
                        label='Năm sinh'
                        placeholder='Nhập năm sinh'
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                        value={value === null ? '' : value}
                        onChange={e => {
                          onChange(e.target.value === '' ? null : e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name='age'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Tuổi'
                        placeholder='Nhập tuổi'
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? null : Number(value))
                        }}
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name='monthsOld'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Tháng tuổi'
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? null : Number(value))
                        }}
                        value={field.value ?? ''}
                        placeholder='Nhập tháng tuổi'
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: '100%' }}
                    label='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : value)
                    }}
                    value={field.value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    placeholder='Nhập email'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    onChange={e => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : value)
                    }}
                    value={field.value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              {/* <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Địa chỉ'
                    placeholder='Nhập địa chỉ'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    value={field.value ?? ''}
                  />
                )}
              /> */}
              <Controller
                name='patId'
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    type='hidden'
                    fullWidth
                    style={{ display: 'none' }}
                    label='Mã Bệnh Nhân'
                    placeholder='Nhập mã bệnh nhân'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                    value={value === null ? '' : value}
                    onChange={e => {
                      onChange(e.target.value === '' ? null : e.target.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='appointmentTypeId'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    autoHighlight
                    openOnFocus
                    disablePortal
                    options={appointmentTypeData}
                    getOptionLabel={option => `${option.name}`}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.id : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label='Loại lịch hẹn'
                        placeholder='Nhập loại lịch hẹn'
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='appointmentDate'
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                    <ReactDatePicker
                      selected={value ? new Date(value) : null}
                      onChange={date => onChange(date || null)}
                      dateFormat={'dd/MM/yyyy'}
                      showMonthDropdown
                      showYearDropdown
                      customInput={<TextField fullWidth label='Ngày hẹn' InputLabelProps={{ shrink: true }} />}
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='doctorId'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    autoHighlight
                    openOnFocus
                    disablePortal
                    options={userDataRoleDoctor}
                    getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.id : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        placeholder='Chọn bác sỉ khám'
                        label='Bác sỉ khám'
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <Controller
                name='receptionistId'
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
                        label='Lễ Tân'
                        placeholder='Chọn lễ tân'
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='scheduleContent'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    onChange={e => {
                      onChange(e.target.value === '' ? null : e.target.value)
                    }}
                    fullWidth
                    label='Nội dung đặt lịch'
                    placeholder='Nhập nội dung đặt lịch'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='reasonExam'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    onChange={e => {
                      onChange(e.target.value === '' ? null : e.target.value)
                    }}
                    fullWidth
                    label='Lý do khám'
                    placeholder='Nhập lý do khám'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='note'
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    label='Ghi chú'
                    placeholder='Nhập ghi chú'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    multiline
                    rows={4}
                    onChange={e => {
                      onChange(e.target.value === '' ? null : e.target.value)
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Stack
            sx={{ padding: '20px', backgroundColor: '#D9D9D9' }}
            direction={'row'}
            spacing={12}
            justifyContent={'end'}
          >
            <Box>
              <Checkbox checked={printAppointment} onChange={e => setPrintAppointment(e.target.checked)} />
              In giấy hẹn
            </Box>
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
              onClick={() => setOpeNewModal(false)}
            >
              Đóng
            </Button>
          </Stack>
        </form>
      </MUIDialog>
    </Grid>
  )
}

export default Reception
