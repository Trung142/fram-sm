import { QueryContext } from './QueryProvider'
import {
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Menu,
  InputAdornment,
  IconButton,
  Autocomplete
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useContext, useEffect, useMemo, useState, useTransition } from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import MUIDialog from 'src/@core/components/dialog'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import FilterDropdown from 'src/@core/components/filter-dropdown'
import { dropdownOptions } from 'src/@core/components/filter-dropdown/constant'
import { GET_APPOINT_SCHEDULE, GET_PATIENT, GET_APPOINTMENT_TYPE } from './graphql/query'
import toast from 'react-hot-toast'
import { useQuery } from '@apollo/client'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import dateformat from 'dateformat'
import { MutationContext } from './MutationProvider'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { getStatus } from './utils/helpers'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { AppointScheduleStatuses } from './constants'

// *********************************************************************************** //
// ************************************ Component ************************************ //
// *********************************************************************************** //

const initRegisterAppointmentExamination = {
  age: '',
  patName: '',
  year: '',
  dob: '',
  monthsOld: '',
  appointmentDate: '',
  appointmentTypeId: '',
  doctorId: '',
  email: '',
  gender: 0,
  note: '',
  patId: '',
  phone: '',
  presenterId: '',
  reasonExam: '',
  receptionistId: '',
  scheduleContent: '',
  address: ''
}

const AppointScheduleListTab: React.FC<{
  shouldRefetch: boolean
  onCreateResExam: (data: any) => void
  onRefetchComplete: () => void
  triggerRefetch: () => void
}> = ({ shouldRefetch, onCreateResExam, triggerRefetch, onRefetchComplete }) => {
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: initRegisterAppointmentExamination
  })
  const [isPending, startTransition] = useTransition()
  const [showDetailData, setShowDetailData] = useState<any>({})
  const [anchorEl, setAnchorEl] = useState(null)
  const openFilter = Boolean(anchorEl)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState({
    status: null,
    appointmentTypeId: null,
    fromDate: null,
    toDate: null,
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })
  const [queriesAppointScheduleDataCondition, setQueriesAppointScheduleDataCondition] = useState({
    input: {},
    skip: searchData.skip,
    take: searchData.take,
    order: [{ createAt: 'DESC' }]
  })

  const { updateAppointSchedule, deleteAppointSchedule } = useContext(MutationContext)
  const { getUserData, getDepartmentData } = useContext(QueryContext)
  const { data: getAppointSchedule, refetch: refetchAppointSchedule } = useQuery(GET_APPOINT_SCHEDULE, {
    variables: queriesAppointScheduleDataCondition
  })
  const { data: getPatient, loading } = useQuery(GET_PATIENT, {})
  const { data: getAppointmentType } = useQuery(GET_APPOINTMENT_TYPE, {})

  const appointScheduleData: any[] = useMemo(() => {
    return getAppointSchedule?.getAppointSchedule?.items ?? []
  }, [getAppointSchedule])
  const appointmentTypeData: any[] = useMemo(() => {
    return getAppointmentType?.getAppointmentType?.items ?? []
  }, [getAppointmentType])
  const userData: any[] = useMemo(() => {
    return getUserData?.getUser?.items ?? []
  }, [getUserData])
  const userDataRoleDoctor = userData

  const columns = [
    { field: 'index', headerName: 'ID', width: 200 },
    {
      field: 'id',
      headerName: 'Mã Lịch Hẹn',
      width: 400,
      renderCell: (param: any) => {
        return (
          <Stack spacing={2} alignItems='center'>
            <div style={{ textTransform: 'uppercase' }}>{param.row.id}</div>
            <div>{dateformat(new Date(param.row.appointmentDate), 'dd/mm/yyyy - HH:MM')}</div>
          </Stack>
        )
      }
    },
    {
      field: 'patName',
      headerName: 'Khách Hàng',
      width: 300,
      renderCell: (param: any) => {
        return (
          <Stack spacing={2}>
            <div>{param.row.patName}</div>
            <div>{`${param.row.age} tuổi - ${param.row.gender == 1 ? 'Nam' : 'Nữ'} - ${param.row.year}`}</div>
          </Stack>
        )
      }
    },
    { field: 'phone', headerName: 'Số Điện Thoại', width: 300 },

    {
      field: 'status',
      headerName: 'Trạng Thái',
      width: 250,
      renderCell: (param: any) => {
        const status = getStatus(param.row.status)
        return (
          <>
            <Stack direction='column' spacing={2} alignItems='center'>
              <div style={{ ...status.styles, textAlign: 'center' }}>{status ? status.label : ''}</div>
            </Stack>
          </>
        )
      }
    },

    {
      field: 'head',
      headerName: 'Head',
      width: 250,
      renderCell: (params: any) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setShowDetailData(params.row)
                setOpenDetailsModal(true)
              }}
            >
              <RemoveRedEyeIcon sx={{ fontSize: '32px' }} />
            </IconButton>
            <IconButton
              onClick={() => {
                console.log('params', params.row.id)
                deleteAppointSchedule({
                  variables: {
                    input: params.row.id
                  },
                  onCompleted: () => {
                    toast.success('Xóa lịch hẹn thành công')
                    refetchAppointSchedule()
                  },
                  onError: (error: { message: any }) => {
                    toast.error('Xóa lịch hẹn thất bại')
                    console.error('Error creating appointment:', error.message)
                  }
                })
              }}
              sx={{
                ml: 4
              }}
            >
              <DeleteForeverIcon sx={{ color: 'red', fontSize: '32px' }} />
            </IconButton>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    if (showDetailData) {
      reset({
        ...showDetailData,
        doctorId: showDetailData.doctorId,
        patId: showDetailData.patId
      })
    }
  }, [showDetailData, reset])

  useEffect(() => {
    if (shouldRefetch) {
      refetchAppointSchedule().then(() => {
        onRefetchComplete()
      })
    }
  }, [shouldRefetch, onRefetchComplete, refetchAppointSchedule])

  useEffect(() => {
    startTransition(() => {
      setQueriesAppointScheduleDataCondition((x: any) => ({
        ...x,
        input: {
          or: [
            { id: { contains: searchData.keySearch } },
            { patName: { contains: searchData.keySearch } },
            { phone: { contains: searchData.keySearch } },
            { email: { contains: searchData.keySearch } }
          ],
          appointmentDate: {
            gte: searchData.fromDate ? dateformat(searchData.fromDate, 'yyyy-mm-dd') : undefined,
            lte: searchData.toDate ? dateformat(searchData.toDate, 'yyyy-mm-dd') : undefined
          },
          status: searchData.status ? { eq: searchData.status } : undefined,
          appointmentTypeId: searchData.appointmentTypeId ? { eq: searchData.appointmentTypeId } : undefined
        },

        skip: paginationModel.page * paginationModel.pageSize,
        take: paginationModel.pageSize,
        order: [{ createAt: 'DESC' }]
      }))
    })
  }, [searchData, paginationModel])

  const handleClickSubmitModal = () => {
    if (showDetailData.status === '110') {
      console.log('Xác Nhận')
      updateAppointSchedule({
        variables: {
          input: JSON.stringify({ id: showDetailData.id, status: '112' })
        },
        onCompleted: () => {
          toast.success('Xác nhận lịch hẹn thành công')
          refetchAppointSchedule()
          setOpenDetailsModal(false)
        },
        onError: (error: { message: any }) => {
          toast.error('Xác nhận lịch hẹn thất bại')
          console.error('Error creating appointment:', error.message)
        }
      })
    } else if (showDetailData.status === '112') {
      onCreateResExam(showDetailData)
    } else if (showDetailData.status === '') {
      updateAppointSchedule({
        variables: {
          input: JSON.stringify({
            id: showDetailData.id,
            age: showDetailData.age,
            patName: showDetailData.patName,
            year: showDetailData.year,
            dob: showDetailData.dob,
            monthsOld: showDetailData.monthsOld,
            appointmentDate: showDetailData.appointmentDate,
            appointmentTypeId: showDetailData.appointmentTypeId,
            doctorId: showDetailData.doctorId,
            email: showDetailData.email,
            gender: showDetailData.gender,
            note: showDetailData.note,
            patId: showDetailData.patId,
            phone: showDetailData.phone,
            presenterId: showDetailData.presenterId,
            reasonExam: showDetailData.reasonExam,
            receptionistId: showDetailData.receptionistId,
            scheduleContent: showDetailData.scheduleContent,
            clinicId: getLocalstorage('userData')?.clinicId,
            parentClinicId: getLocalstorage('userData')?.parentClinicId
          })
        },
        onCompleted: () => {
          toast.success('Update lịch hẹn thành công')
          refetchAppointSchedule()
          setOpenDetailsModal(false)
        },
        onError: (error: { message: any }) => {
          toast.error('Update lịch hẹn thất bại')
          console.error('Error creating appointment:', error.message)
        }
      })
    } else if (showDetailData.status === '114') {
      setOpenDetailsModal(false)
    }
  }
  const handleOpenFilter = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseFilter = () => {
    setAnchorEl(null)
  }
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const onSubmit = (data: any) => {
    console.log('data', data)
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === '' ? null : value
      return acc
    }, {} as typeof data)

    processedData.phone = `${processedData.phone}`
    processedData.year = +processedData.year
    console.log('processedData', processedData)
  }
  const handleSearch = () => {
    console.log('searchData', queriesAppointScheduleDataCondition)
    refetchAppointSchedule({ variables: queriesAppointScheduleDataCondition })
  }

  return (
    <Grid container>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={6}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant='text'
              sx={{
                backgroundColor: '#D9D9D9',
                '&:hover': {
                  backgroundColor: '#D9D9D9'
                }
              }}
              onClick={handleOpenFilter}
            >
              <FilterAltIcon sx={{ width: '2rem', height: '2rem' }} />
            </Button>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
              <ReactDatePicker
                selected={searchData.fromDate}
                dateFormat={'dd/MM/yyyy'}
                showMonthDropdown
                showYearDropdown
                customInput={
                  <TextField
                    fullWidth
                    label='Từ ngày'
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
                onChange={(date: Date) => handleChangeSearch('fromDate', date)}
              />
            </DatePickerWrapper>
            <Menu anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter}>
              <FilterDropdown options={dropdownOptions} onClick={handleCloseFilter} />
            </Menu>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
            <ReactDatePicker
              selected={searchData.toDate}
              dateFormat={'dd/MM/yyyy'}
              showMonthDropdown
              showYearDropdown
              customInput={
                <TextField
                  fullWidth
                  label='Đến ngày'
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
              onChange={(date: Date) => handleChangeSearch('toDate', date)}
            />
          </DatePickerWrapper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={appointmentTypeData}
            getOptionLabel={option => option.name}
            value={appointmentTypeData.find(dept => dept.id === searchData.appointmentTypeId) || null}
            onChange={(event, newValue) => {
              handleChangeSearch('appointmentTypeId', newValue ? newValue.id : '')
            }}
            renderInput={params => <TextField {...params} label='Loại lịch hẹn' placeholder='Chọn loại lịch hẹn' />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={AppointScheduleStatuses}
            getOptionLabel={option => option.label}
            value={AppointScheduleStatuses.find(status => status.value === searchData.status) || null}
            onChange={(event, newValue) => {
              handleChangeSearch('status', newValue ? newValue.value : '')
            }}
            renderInput={params => <TextField {...params} label='Trạng Thái' placeholder='Chọn trạng thái' />}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: 'flex' }}>
            <TextField
              label='Nhập từ khoá tìm kiếm'
              placeholder='Nhập từ khoá tìm kiếm'
              value={searchData.keySearch}
              onChange={e => handleChangeSearch('keySearch', e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant='outlined'
              sx={{
                width: '100%',
                '& fieldset': {
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px'
                }
              }}
            />
            <Button
              sx={{ borderRadius: 0 }}
              variant='contained'
              onClick={handleSearch}
              style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
            >
              <SearchIcon />
            </Button>
            <Button
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              variant='contained'
              style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
            >
              <RefreshIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <DataGrid
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={getAppointSchedule?.getAppointSchedule?.totalCount ?? 0}
                rows={appointScheduleData.map((item, index) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                columns={columns}
                rowHeight={80}
                loading={loading}
                pagination
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                style={{ minHeight: 700 }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <MUIDialog
        useFooter={false}
        maxWidth='xl'
        open={[openDetailsModal, setOpenDetailsModal]}
        title='Chi tiết lịch hẹn'
      >
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
                        <TextField
                          {...field}
                          InputLabelProps={{ shrink: true }}
                          label='Họ tên'
                          value={field.value ?? ''}
                          placeholder='Nhập họ tên'
                          InputProps={{
                            readOnly: true
                          }}
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
                      defaultValue={0}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          aria-labelledby='demo-form-control-label-placement'
                          name='position'
                          defaultValue='top'
                        >
                          <FormControlLabel value={2} checked={field.value === 2} control={<Radio />} label='Nam' />
                          <FormControlLabel value={1} checked={field.value === 1} control={<Radio />} label='Nữ' />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={3}>
                  <Controller
                    name='dob'
                    control={control}
                    render={({ field }) => (
                      <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : new Date()}
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
                        InputProps={{
                          readOnly: true
                        }}
                        placeholder='Nhập năm sinh'
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                        value={value ?? ''}
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
                        InputProps={{
                          readOnly: true
                        }}
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
                        InputProps={{
                          readOnly: true
                        }}
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
                    // InputProps={{
                    //   readOnly: true
                    // }}
                    placeholder='Nhập số điện thoại'
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
            <Grid item xs={4}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    // InputProps={{
                    //   readOnly: true
                    // }}
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
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Địa Chỉ'
                    // InputProps={{
                    //   readOnly: true
                    // }}
                    placeholder='Nhập địa chỉ'
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
                name='appointmentTypeId'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={appointmentTypeData.find(item => item.id === field.value)?.name ?? ''}
                    label='Loại hẹn'
                    placeholder='Chọn loại hẹn'
                    InputLabelProps={{ shrink: true }}
                    // InputProps={{
                    //   readOnly: true
                    // }}
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
                      customInput={
                        <TextField
                          // InputProps={{
                          //   readOnly: true
                          // }}
                          fullWidth
                          label='Ngày hẹn'
                          InputLabelProps={{ shrink: true }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='doctorId'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={
                      userDataRoleDoctor.find(item => item.id === field.value)?.fristName +
                        ' ' +
                        userDataRoleDoctor.find(item => item.id === field.value)?.lastName ?? ''
                    }
                    label='Bác sĩ'
                    placeholder='Chọn bác sĩ'
                    InputLabelProps={{ shrink: true }}
                    // InputProps={{
                    //   readOnly: true
                    // }}
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
                    value={userDataRoleDoctor.find(option => option.id === value) || ''}
                    options={userDataRoleDoctor}
                    renderInput={params => (
                      <TextField
                        {...params}
                        // InputProps={{
                        //   readOnly: true
                        // }}
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
                    value={userDataRoleDoctor.find(option => option.id === value) || ''}
                    options={userDataRoleDoctor}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Lễ Tân'
                        // InputProps={{
                        //   readOnly: true
                        // }}
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
                    value={value ?? ''}
                    fullWidth
                    label='Nội dung đặt lịch'
                    placeholder='Nhập nội dung đặt lịch'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    // InputProps={{
                    //   readOnly: true
                    // }}
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
                    value={value === null ? '' : value}
                    label='Lý do khám'
                    placeholder='Nhập lý do khám'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    multiline
                    rows={4}
                    // InputProps={{
                    //   readOnly: true
                    // }}
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
                    value={value === null ? '' : value}
                    placeholder='Nhập ghi chú'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    multiline
                    rows={4}
                    // InputProps={{
                    //   readOnly: true
                    // }}
                    onChange={e => {
                      onChange(e.target.value === '' ? null : e.target.value)
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
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
                  value={value ?? ''}
                  onChange={e => {
                    onChange(e.target.value === '' ? null : e.target.value)
                  }}
                />
              )}
            />
          </Grid>
          <Stack
            sx={{ padding: '20px', backgroundColor: '#D9D9D9' }}
            direction={'row'}
            spacing={12}
            justifyContent={'end'}
          >
            {showDetailData.status !== '114' && (
              <Button
                variant='contained'
                sx={{ mr: 5, width: '200px' }}
                startIcon={<Icon icon='eva:save-fill' />}
                type='submit'
                onClick={() => handleClickSubmitModal()}
              >
                {showDetailData.status === '110'
                  ? 'Xác Nhận'
                  : showDetailData.status === '112'
                  ? 'Đăng Ký Khám'
                  : showDetailData.status === '114'
                  ? 'Đóng'
                  : 'Update'}
              </Button>
            )}
            <Button
              variant='outlined'
              sx={{ width: '200px', backgroundColor: '#8592A3', color: '#fff' }}
              startIcon={<Icon icon='eva:close-fill' />}
              onClick={() => setOpenDetailsModal(false)}
            >
              Đóng
            </Button>
          </Stack>
        </form>
      </MUIDialog>
    </Grid>
  )
}

export default AppointScheduleListTab
