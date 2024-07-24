import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './style.module.scss'
// ====Icon
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
// ====GraphQL
import { useMutation, useQuery } from '@apollo/client'
import { getGender, statusSubclinicalMapping } from 'src/utils/common'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import DownloadIcon from '@mui/icons-material/Download'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { TabContext, TabList } from '@mui/lab'
import apollo from 'src/graphql/apollo'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import PrintIcon from '@mui/icons-material/Print'
import { GET_RES_EXAM_SERVICE_DT } from './graphql/query'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { UPDATE_RES_EXAM_SERVICE_DT } from './graphql/mutation'
type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  status: string | null
  skip: number
  take: number
  keySearch: string
}

type IOnChangeValue = {
  id?: string
  label: string
}

const renderPatInfo = (params: any) => {
  const name = params.row?.resExam.patName
  const age = params.row?.resExam.age
  const gender = params.row?.resExam.gender
  const year = params.row?.resExam.year
  return (
    <div className='flex flex-col'>
      <span>{name}</span>
      <div className='text-xs text-gray-500'>
        {year} - {getGender(gender)} - {age} tuổi
      </div>
    </div>
  )
}
const getStatusLabel = (statusCode: any) => {
  const status = statusSubclinicalMapping(statusCode, styles)
  return status ? <span className={status.className}>{status.label}</span> : <></>
}
type Props = {
  title: string
  url: string
  speaker: boolean
}
const ServiceIndex = (props: Props) => {
  // ======================Handler========================
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [id, setId] = useState<string>()
  const [statusId, setStatusId] = useState<string>('')
  const [updateResExamServiceDt] = useMutation(UPDATE_RES_EXAM_SERVICE_DT) 
  const handleChangeStatus = (id: any) => {
    updateResExamServiceDt({
      variables: {
        input: JSON.stringify({
          id: id,
          status: '1000_102'
        })
      }
    })
  }
  // ======================Variables Search========================
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)
  const initialSearchData: RequestType = {
    fromDate: startDate,
    toDate: endDate,
    keySearch: '',
    status: null,
    skip: 0,
    take: paginationModel.pageSize
  }
  const [searchData, setSearchData] = useState<RequestType>(initialSearchData)
  const [keySearch, setKeySearch] = useState('')
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const clearSearch = () => {
    setSearchData(initialSearchData)
    setQueryVariables({
      input: {},
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setKeySearch('')
  }
  //get Data
  const {
    data: queryData,
    loading,
    error,
    refetch
  } = useQuery(GET_RES_EXAM_SERVICE_DT, {
    variables: queryVariables
  })
  const [data, setData] = useState([])
  useEffect(() => {
    setData(queryData?.getResExamServiceDt?.items ?? [])
  },[queryData?.getResExamServiceDt?.items])
  const [count, setCount] = useState({
    all_count: 0,
    in_progress_count: 0,
    waiting_action_count: 0,
    complete_count: 0,
    canceled_count: 0
  })
  const counter = async () => {
    const vari = {
      createAt: {
        gte: searchData.fromDate,
        lte: searchData.toDate
      },
      service: {
        serviceType: {
          name: { eq: props.title }
        }
      },
      or: [
        { id: { contains: searchData.keySearch } },
        { resExam: { patName: { contains: searchData.keySearch } } },
        { service: { name: { contains: searchData.keySearch } } },
        { resExam: { id: { contains: searchData.keySearch } } },
        
      ]
    }
    const all = await apollo
      .query({
        query: GET_RES_EXAM_SERVICE_DT,
        variables: {
          input: {
            ...vari
          }
        }
      })
      .then(res =>
        setCount((pre: any) => ({
          ...pre,
          all_count: res.data?.getResExamServiceDt?.totalCount
        }))
      )
    const inProgress = await apollo
      .query({
        query: GET_RES_EXAM_SERVICE_DT,
        variables: {
          input: {
            ...vari,
            status: { eq: '1000_102' }
          }
        }
      })
      .then(res =>
        setCount((pre: any) => ({
          ...pre,
          in_progress_count: res.data?.getResExamServiceDt?.totalCount
        }))
      )
    const waiting_action = await apollo
      .query({
        query: GET_RES_EXAM_SERVICE_DT,
        variables: {
          input: {
            ...vari,
            status: { eq: '1000_100' }
          }
        }
      })
      .then(res =>
        setCount((pre: any) => ({
          ...pre,
          waiting_action_count: res.data?.getResExamServiceDt?.totalCount
        }))
      )
    const complete = await apollo
      .query({
        query: GET_RES_EXAM_SERVICE_DT,
        variables: {
          input: {
            ...vari,
            status: { eq: '1000_104' }
          }
        }
      })
      .then(res =>
        setCount((pre: any) => ({
          ...pre,
          complete_count: res.data?.getResExamServiceDt?.totalCount
        }))
      )
    const cancel = await apollo
      .query({
        query: GET_RES_EXAM_SERVICE_DT,
        variables: {
          input: {
            ...vari,
            status: { eq: '1000_105' }
          }
        }
      })
      .then(res =>
        setCount((pre: any) => ({
          ...pre,
          canceled_count: res.data?.getResExamServiceDt?.totalCount
        }))
      )
  }
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.05,
      minWidth: 50,
      field: 'index',
      headerName: 'STT',
      renderCell: (params: { row: { index?: any } }) => {
        const { index } = params.row
        return <div>{index}</div>
      }
    },
    {
      flex: 0.18,
      minWidth: 160,
      field: 'id',
      headerName: 'Mã Phiếu',
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.value}</span>
          </div>
          <div>
            <span>{moment(params.row?.createAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'patName',
      headerName: 'Họ Tên',
      renderCell: renderPatInfo
    },
    {
      flex: 0.15,
      minWidth: 80,
      field: 'stt',
      headerName: 'Số khám',
      renderCell: (params: any) => {
        const index = params.row?.resExam.id
        return <div>{index}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'name',
      headerName: 'Dịch vụ',
      renderCell: (params: any) => {
        return (
          <div>
            <span>{params.row?.service.name}</span>
          </div>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'implementerDoctor',
      headerName: 'Người thực hiện',
      renderCell: (params: any) => {
        return (
          <div>
            {params.row?.implementerDoctorId == null ? (
              <span>
                {params.row?.implementerDoctor?.fristName} {params.row?.implementerDoctor?.lastName}
              </span>
            ) : (
              <span></span>
            )}
          </div>
        )
      }
    },
    {
      flex: 0.18,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: (params: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span>{getStatusLabel(params.value)}</span>
            <span
              style={
                params.row?.paymentStatus
                  ? {
                      marginLeft: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#69cc38',
                      backgroundColor: '#f6ffed',
                      borderColor: '#69cc38',
                      borderRadius: 5,
                      border: '1px solid'
                    }
                  : {
                      marginLeft: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#838383',
                      backgroundColor: '#fafafa',
                      borderColor: '#838383',
                      borderRadius: 5,
                      border: '1px solid'
                    }
              }
            >
              <AttachMoneyIcon sx={{ fontSize: 24 }} />
            </span>
          </div>
        )
      }
    },
    {
      flex: 0.02,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            disabled={params.row?.status === '1000_102'}
            onClick={() => {
              handleChangeStatus(params.row?.id)
              router.push(`/subclinical/${props.url}/update/${params.row?.id}`)
            }}
          >
            <Icon icon='bx:edit' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          {props.speaker ? (
            <IconButton
              title='Gọi loa'
              // onClick={() => {
              //   router.push(`/subclinical/disease-test/update/${params.row?.id}`)
              // }}
            >
              <VolumeUpIcon style={{ marginRight: 5, fontSize: 20 }} />
            </IconButton>
          ) : null}
          <IconButton
            title='Thêm'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={event => {
              handleClick(event)
              setId(params.row?.id)
              setStatusId(params.row?.status)
            }}
          >
            <Icon icon='bx:dots-horizontal-rounded' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem
            // onClick={handlePrint}
            >
              <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu chỉ định DV
            </MenuItem>
            <MenuItem
              disabled={statusId != '1000_104'}
              // onClick={handlePrint}
            >
              <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In kết quả
            </MenuItem>
          </Menu>
        </div>
      )
    }
  ]
  useEffect(() => {
    // make typing when search faster
    setQueryVariables((prev: any) => ({
      ...prev,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        service: {
          serviceType: {
            name: { eq: props.title }
          }
        },
        status: searchData.status != '' && searchData.status != null ? { eq: searchData.status } : undefined,
        or: [
          { id: { contains: searchData.keySearch } },
          { resExam: { patName: { contains: searchData.keySearch } } },
          { service: { name: { contains: searchData.keySearch } } },
          { resExam: { id: { contains: searchData.keySearch } } },
        ]
      }
    }))
    console.log(data)
    counter()
  }, [paginationModel, searchData])
  return (
    <Grid container rowGap={5}>
      <Card sx={{ width: '100%', p: 5 }}>
        <Grid item xs={12} mb={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>{props.title}</h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, pr: 8, backgroundColor: '#ef9d25', paddingX: 5 }}
                startIcon={<ScreenShareIcon />}
              >
                Màn hình chờ
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: 'green', color: 'white', paddingX: 5 }}
                  startIcon={<DownloadIcon />}
                >
                  Xuất EXCEL
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={3}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.fromDate}
                dateFormat={'dd/MM/yyyy'}
                onChange={(date: Date) => handleChangeSearch('fromDate', date)}
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
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.toDate}
                dateFormat={'dd/MM/yyyy'}
                onChange={(date: Date) => handleChangeSearch('toDate', date)}
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
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div style={{ display: 'flex' }}>
              <TextField
                label='Từ khoá tìm kiếm'
                fullWidth
                value={keySearch}
                placeholder='Nhập từ khoá tìm kiếm'
                autoComplete='off'
                onChange={e => setKeySearch(e.target.value)}
                sx={{
                  '& fieldset': {
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px'
                  }
                }}
              />
              <Button
                sx={{ borderRadius: 0, width: 56, height: 56 }}
                variant='contained'
                color='primary'
                onClick={() => {
                  handleChangeSearch('keySearch', keySearch)
                }}
              >
                <Icon icon='bx:search' fontSize={24} />
              </Button>
              <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 56, height: 56 }}
                variant='contained'
                color='secondary'
                onClick={() => {
                  clearSearch()
                }}
              >
                <Icon icon='bx:revision' fontSize={24} />
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ width: '100%' }}>
        {/* <Grid container sx={{ mt: 6 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}> */}
        <TabContext value={searchData.status ?? ''}>
          <TabList
            sx={{
              backgroundColor: '#0292B1',
              width: '100%'
            }}
            onChange={(e, value) => {
              handleChangeSearch('status', value)
            }}
            aria-label='lab API tabs example'
          >
            <Tab
              style={searchData.status === null ? { backgroundColor: '#025061' } : {}}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    Danh sách
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
                    {count.all_count}
                  </Typography>
                </Box>
              }
              value={''}
            />
            <Tab
              style={searchData.status === '1000_100' ? { backgroundColor: '#025061' } : {}}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
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
                    {count.waiting_action_count}
                  </Typography>
                </Box>
              }
              value={'1000_100'}
            />
            <Tab
              style={searchData.status === '1000_102' ? { backgroundColor: '#025061' } : {}}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    Đang thực hiện
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
                    {count.in_progress_count}
                  </Typography>
                </Box>
              }
              value={'1000_102'}
            />
            <Tab
              style={searchData.status === '1000_104' ? { backgroundColor: '#025061' } : {}}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    Đã thực hiện
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
                    {count.complete_count}
                  </Typography>
                </Box>
              }
              value={'1000_104'}
            />
            <Tab
              style={searchData.status === '1000_105' ? { backgroundColor: '#025061' } : {}}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    Đã hủy
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
                    {count.canceled_count}
                  </Typography>
                </Box>
              }
              value={'1000_105'}
            />
          </TabList>
        </TabContext>
        <DataGrid
          columns={COLUMN_DEF}
          rows={data.map((item: any, index: any) => ({
            ...item,
            index: index + 1 + paginationModel.page * paginationModel.pageSize
          }))}
          rowCount={queryData?.getResExamServiceDt?.totalCount ?? 0}
          // onRowClick={params => {
          //   setSelectedResExam(params.row)
          // }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode='server'
          loading={loading}
          slots={{
            noRowsOverlay: () => (
              <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
            ),
            noResultsOverlay: () => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  height: '100%'
                }}
              >
                <span>Không tìm thấy dữ liệu</span>
              </div>
            )
          }}
          style={{ minHeight: 500, height: '60vh' }}
        />
      </Card>
    </Grid>
  )
}
export default ServiceIndex
