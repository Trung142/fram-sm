import React, { useState, useMemo, useEffect } from 'react'
import moment from 'moment'
import { useMutation, useQuery } from '@apollo/client'
import ReactDatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import {
  Grid,
  Card,
  Typography,
  Menu,
  TextField,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
  Tab,
  Box,
  Button,
  Stack
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import RefreshIcon from '@mui/icons-material/Refresh'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import CreateIcon from '@mui/icons-material/Create'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MUIDialog from 'src/@core/components/dialog'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FilterDropdown from 'src/@core/components/filter-dropdown'
import { dropdownOptions } from 'src/@core/components/filter-dropdown/constant'
import styles from './index.module.scss'
import { getGender, statusMapping } from 'src/utils/common'
import { GET_RES_EXAM } from './graphql/query'
import { UPDATE_RES_EXAM } from './graphql/mutation'
import { Examination } from './graphql/types'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'

// ***************************************************************************************** //
// ************************************ Helper Function ************************************ //
// ***************************************************************************************** //
const getStatusLabel = (statusCode: any) => {
  const status = statusMapping(statusCode, styles)
  return status ? <span className={status.className}>{status.label}</span> : <></>
}

const renderPatInfo = (params: { row: { patName: any; gender: any; age: any; year: any } }) => {
  const { patName, gender, age, year } = params.row
  return (
    <div className='flex flex-col'>
      <span>{patName}</span>
      <div className='text-xs text-gray-500'>
        {getGender(gender)} - {year} - {age} tuổi
      </div>
    </div>
  )
}

const colorActive = {
  backgroundColor: '#025061'
}

// *********************************************************************************** //
// ************************************ Component ************************************ //
// *********************************************************************************** //
const MeasureVitalSigns = () => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [queryVariables, setQueryVariables] = useState({
    patTypeId: '',
    patGroupId: '',
    keySearch: '',
    skip: paginationModel.page * paginationModel.pageSize,
    take: paginationModel.pageSize
  })
  const [tab, setTab] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchData, setSearchData] = useState({
    fromDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    toDate: new Date(),
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })
  const [keySearch, setKeySearch] = useState('')
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [calculatedBMI, setCalculatedBMI] = useState(0)
  const [selectedResExam, setSelectedResExam] = useState<Examination | null>({} as Examination)

  const [updateResExam] = useMutation(UPDATE_RES_EXAM)
  const openFilter = Boolean(anchorEl)

  const {
    data: getResExamData,
    loading,
    error,
    refetch: refetchResExam
  } = useQuery(GET_RES_EXAM, {
    variables: queryVariables,
    fetchPolicy: 'network-only'
  })

  const resExamData: any[] = useMemo(() => {
    return getResExamData?.getResExam?.items ?? []
  }, [getResExamData])

  const { register, handleSubmit, control, reset } = useForm()

  const handleOpenFilter = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseFilter = () => {
    setAnchorEl(null)
  }
  const handleSetTab = (val: string) => setTab(val)

  const handleOpenScreen = () => {
    window.open('/examination/waiting-screen', '_blank')
  }

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  useEffect(() => {
    refetchResExam({
      patTypeId: queryVariables.patTypeId,
      patGroupId: queryVariables.patGroupId,
      keySearch: queryVariables.keySearch,
      skip: queryVariables.skip,
      take: queryVariables.take
    })
  }, [queryVariables, refetchResExam])

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100
      const bmiValue: number = +(weight / (heightInMeters * heightInMeters)).toFixed(2)
      setCalculatedBMI(bmiValue)
    } else {
      setCalculatedBMI(0)
    }
  }, [weight, height])

  const handleSearch = () => {
    console.log('searchData', searchData)
    setQueryVariables({
      ...queryVariables,
      keySearch: keySearch,
      skip: 0,
      take: paginationModel.pageSize
    })
  }

  const clearSearch = () => {
    setQueryVariables({
      patTypeId: '',
      patGroupId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setKeySearch('')
  }

  const handleRowClick = (params: { row: Examination }) => {
    console.log('Selected Patient', params.row)
    setSelectedResExam(params.row)

    const newWeight = !!params.row.weight ? params.row.weight : 0
    const newHeight = !!params.row.height ? params.row.height : 0

    setWeight(newWeight)
    setHeight(newHeight)

    reset({
      paulse: params.row.paulse,
      breathingRate: params.row.breathingRate,
      temperature: params.row.temperature,
      bp1: params.row.bp1,
      bp2: params.row.bp2,
      weight: newWeight,
      height: newHeight,
      bmi: calculatedBMI,
      fristDayofLastPeriod: params.row.fristDayofLastPeriod,
      dateOfConception: params.row.dateOfConception,
      personalMedHistory: params.row.personalMedHistory,
      familyMedHistory: params.row.familyMedHistory,
      personalAllergicHistory: params.row.personalAllergicHistory,
      otherDisease: params.row.otherDisease
    })
    setOpenDetailsModal(true)
  }

  const onSubmit = (data: any) => {
    console.log(data)
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === '' ? null : value
      return acc
    }, {} as typeof data)

    updateResExam({
      variables: {
        input: {
          id: selectedResExam?.id,
          ...processedData
        }
      },
      refetchQueries: [
        {
          query: GET_RES_EXAM,
          variables: queryVariables
        }
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success('Cập nhật thành công')
        setOpenDetailsModal(false)
        reset(
          {
            paulse: '',
            breathingRate: '',
            temperature: '',
            bp1: '',
            bp2: '',
            weight: '',
            height: '',
            bmi: '',
            fristDayOfLastPeriod: '',
            dateOfConception: '',
            personalMedHistory: '',
            familyMedHistory: '',
            personalAllergicHistory: '',
            otherDisease: ''
          },
          {
            keepValues: false
          }
        )
      },
      onError: () => {
        toast.error('Cập nhật thất bại')
      }
    })
  }

  const newColDef: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'id',
      headerName: '#',
      renderCell: (params: { row: { index?: any } }) => {
        const { index } = params.row
        return <div>{index}</div>
      }
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'patId',
      headerName: 'Mã Phiếu',
      renderCell: (params: { row: { createdAt?: any; patId?: any } }) => {
        const { patId } = params.row

        return (
          <div>
            <span>{patId}</span>
            <div>
              <span>{moment(params.row.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </div>
          </div>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 160,
      field: 'patInfo',
      headerName: 'Khách Hàng',
      renderCell: renderPatInfo
    },
    {
      flex: 0.25,
      minWidth: 120,
      field: 'doctor',
      headerName: 'Bác sỉ',
      renderCell: (params: { row: { doctor: any } }) => {
        const { doctor } = params.row

        return <div>{/* {doctor.firstName} {doctor.lastName} */}</div>
      }
    },
    {
      flex: 0.25,
      minWidth: 120,
      field: 'staff',
      headerName: 'Người đo',
      renderCell: (params: { row: { staff: any } }) => {
        const { staff } = params.row
        if (staff) {
          return (
            <div>
              {staff.fristName} {staff.lastName}
            </div>
          )
        } else {
          return <div>Missing Params</div>
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: (params: any) => getStatusLabel(params.value)
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      renderCell: (params: any) => (
        <div className='flex justify-center'>
          <IconButton onClick={() => handleRowClick(params)}>
            <CreateIcon sx={{ color: '#6062E8' }} />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title='ĐO SINH HIỆU'
            action={
              <Button
                variant='contained'
                style={{ backgroundColor: '#FDB528', width: 245, height: 42, borderRadius: 8 }}
                sx={{ pl: 5, pr: 8 }}
                onClick={() => handleOpenScreen()}
              >
                <ScreenShareIcon sx={{ mr: 2 }} />
                MÀN HÌNH CHỜ
              </Button>
            }
          />
          <CardContent>
            {/* =============================== MAIN HEAD ======================================= */}
            {/* =============================== MAIN HEAD ======================================= */}
            {/* =============================== MAIN HEAD ======================================= */}
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Button
                    variant='text'
                    sx={{
                      backgroundColor: '#D9D9D9',
                      color: '#fff',
                      mr: 2,
                      '&:hover': {
                        backgroundColor: '#D9D9D9'
                      }
                    }}
                    onClick={handleOpenFilter}
                  >
                    <FilterAltIcon sx={{ width: '2rem', height: '2rem' }} />
                  </Button>
                  <Menu anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter}>
                    <FilterDropdown options={dropdownOptions} onClick={handleCloseFilter} />
                  </Menu>
                  <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                    <ReactDatePicker
                      selected={searchData.fromDate}
                      dateFormat={'dd/MM/yyyy'}
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
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <ReactDatePicker
                    selected={searchData.toDate}
                    dateFormat={'dd/MM/yyyy'}
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
              <Grid item xs={12} sm={5}>
                <div style={{ display: 'flex', width: '80%' }}>
                  <TextField
                    label='Nhập từ khoá tìm kiếm'
                    placeholder='Nhập từ khoá tìm kiếm'
                    InputLabelProps={{ shrink: true }}
                    value={keySearch}
                    onChange={e => setKeySearch(e.target.value)}
                    variant='outlined'
                    sx={{
                      '& label': { paddingLeft: theme => theme.spacing(2) },
                      '& input': { paddingLeft: theme => theme.spacing(3.5) },
                      width: '100%',
                      '& fieldset': {
                        paddingLeft: theme => theme.spacing(2.5),
                        maxWidth: 600,
                        borderTopRightRadius: '0px',
                        borderBottomRightRadius: '0px'
                      }
                    }}
                  />
                  <Button
                    sx={{ borderRadius: 0 }}
                    variant='contained'
                    style={{ backgroundColor: '#55A629', width: 56, height: 56 }}
                    onClick={() => handleSearch()}
                  >
                    <Icon fontSize={20} icon='bx:bx-search' color='white' />
                  </Button>
                  <Button
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    variant='contained'
                    style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
                    onClick={() => clearSearch()}
                  >
                    <RefreshIcon />
                  </Button>
                </div>
              </Grid>
            </Grid>
            {/* =============================== MAIN DATA ======================================= */}
            {/* =============================== MAIN DATA ======================================= */}
            {/* =============================== MAIN DATA ======================================= */}
            <Grid container sx={{ mt: 6 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <TabContext value={tab}>
                <TabList
                  sx={{
                    backgroundColor: '#0292B1',
                    width: '100%'
                  }}
                  value={tab}
                  onChange={(e, val) => handleSetTab(val)}
                  aria-label='basic tabs example'
                >
                  <Tab
                    style={tab === 'all' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>Danh sách</Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.length}
                        </Typography>
                      </Box>
                    }
                    value={'all'}
                  />
                  <Tab
                    style={tab === 'waiting_examines' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          style={tab === 'waiting_examines' ? colorActive : {}}
                          sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                        >
                          Chờ khám
                        </Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.filter(item => item.status === '00').length}
                        </Typography>
                      </Box>
                    }
                    value={'waiting_examines'}
                  />
                  <Tab
                    style={tab === 'examines' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>Đang khám</Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.filter(item => item.status === '10').length}
                        </Typography>
                      </Box>
                    }
                    value={'examines'}
                  />
                  <Tab
                    style={tab === 'waiting_action' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                          Chờ thực hiện
                        </Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.filter(item => item.status === '20').length}
                        </Typography>
                      </Box>
                    }
                    value={'waiting_action'}
                  />
                  <Tab
                    style={tab === 'success' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                          Hoàn thành
                        </Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.filter(item => item.status === '30').length}
                        </Typography>
                      </Box>
                    }
                    value={'success'}
                  />
                  <Tab
                    style={tab === 'canceled' ? colorActive : {}}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>Huỷ Khám</Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            ml: 4,
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem'
                          }}
                        >
                          {resExamData.filter(item => item.status === '40').length}
                        </Typography>
                      </Box>
                    }
                    value={'canceled'}
                  />
                </TabList>
                <TabPanel value='all' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData.map((item, index) => ({
                          ...item,
                          patInfo: '',
                          index: index + 1 + paginationModel.page * paginationModel.pageSize
                        }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='waiting_examines' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData
                          .filter(item => item.status === '00')
                          .map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='examines' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData
                          .filter(item => item.status === '10')
                          .map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='waiting_action' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData
                          .filter(item => item.status === '20')
                          .map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='success' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData
                          .filter(item => item.status === '40')
                          .map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value='canceled' sx={{ width: '100%', p: 0 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DataGrid
                        columns={newColDef}
                        rows={resExamData
                          .filter(item => item.status === '50')
                          .map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))}
                        rowCount={getResExamData?.getPatient?.totalCount ?? 0}
                        onRowClick={params => {
                          setSelectedResExam(params.row)
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        loading={loading}
                        style={{ minHeight: 700 }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              </TabContext>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* =============================== DIAGLOG ======================================= */}
      {/* =============================== DIAGLOG ======================================= */}
      {/* =============================== DIAGLOG ======================================= */}
      <MUIDialog
        maxWidth='xl'
        open={[openDetailsModal, setOpenDetailsModal]}
        title={`ĐO SINH HIỆU - ${selectedResExam?.patId ? selectedResExam?.patId : ''}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            {selectedResExam && (
              <Grid container>
                <Grid item sm={8}>
                  <Card sx={{ margin: '30px' }}>
                    <CardHeader
                      title={`${selectedResExam?.patId ? selectedResExam?.patId : ''}`}
                      style={{ textAlign: 'start' }}
                    />
                    <CardContent>
                      <Card>
                        <CardContent>
                          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 4, sm: 4, md: 6 }}>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='paulse'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    label='Mạch (lần/phút)'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='breathingRate'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    label='Nhịp thở (lần/phút)'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='temperature'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    label='Nhiệt độ C'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='bp1'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    label='HA mmhg'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>/</div>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='bp2'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    label='HA mmHg'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='weight'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    value={weight === 0 ? '' : weight}
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                      setWeight(+e.target.value)
                                    }}
                                    label='Cân nặng (kg)'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='height'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    value={height === 0 ? '' : height}
                                    onChange={e => {
                                      field.onChange(Number(e.target.value))
                                      setHeight(+e.target.value)
                                    }}
                                    label='Chiều cao (cm)'
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Controller
                                name='bmi'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label='BMI'
                                    InputProps={{
                                      readOnly: true
                                    }}
                                    sx={{ backgroundColor: '#F5F5F5' }}
                                    value={calculatedBMI === 0 ? '' : calculatedBMI}
                                    InputLabelProps={{ shrink: true }}
                                    variant='outlined'
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </CardContent>
                    <CardContent>
                      <Card>
                        <CardContent>
                          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 4, sm: 4, md: 6 }}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                label='Ngày đầu kinh cuối cùng'
                                placeholder='Nhập hãng sản xuất'
                                {...register('fristDayOfLastPeriod', { required: true })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                label='Ngày thụ thai'
                                placeholder='Nhập hãng sản xuất'
                                {...register('dateOfConception', { required: true })}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                label='Ngày đầu kì kinh cuối'
                                placeholder='Nhập hãng sản xuất'
                                {...register('fristDayOfLastPeriod', { required: true })}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={4}>
                  <Card sx={{ my: '30px', mr: '30px' }}>
                    <CardHeader
                      title={`${selectedResExam.patName} - ${getGender(selectedResExam.gender)} - ${
                        selectedResExam.age
                      } Tuổi`}
                    />
                    <CardContent>
                      <Grid container rowSpacing={{ xs: 1, sm: 2, md: 6 }}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label='Tiểu sử bệnh bản thân'
                            placeholder='Nhập tiểu sử bệnh bản thân'
                            {...register('personalMedHistory', { required: true })}
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label='Tiểu sử bệnh gia đình'
                            placeholder='Nhập tiểu sử bệnh gia đình'
                            {...register('familyMedHistory', { required: true })}
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label='Dị ứng thuốc'
                            placeholder='Nhập tiểu sử dị ứng thuốc'
                            {...register('personalAllergicHistory', { required: true })}
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            label='Dị ứng khác'
                            placeholder='Nhập dị ứng khác'
                            {...register('otherDisease', { required: true })}
                            multiline
                            rows={2}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
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
            >
              Lưu
            </Button>
            <Button
              variant='outlined'
              sx={{ width: '200px', color: '#fff', backgroundColor: '#8592A3' }}
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

export default MeasureVitalSigns
