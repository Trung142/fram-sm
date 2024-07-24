// ** React Imports
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Autocomplete, Button, IconButton, InputAdornment, Tab, TextField, Typography } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteIcon from '@mui/icons-material/Delete'
import PrintIcon from '@mui/icons-material/Print'
import Icon from 'src/@core/components/icon'

// ** GraphQL
import { useMutation, useQuery } from '@apollo/client'
import { GET_RES_EXAM } from './graphql/query'

// ** Custom Components Imports
import styles from './index.module.scss'
import MUIDialog from 'src/@core/components/dialog'
// import UpdatePatient from './update'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import moment from 'moment'
import { signal } from '@preact/signals'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { ResExamInput } from './graphql/variables'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UPDATE_RES_EXAM } from './graphql/mutation'
import { getLocalstorage } from 'src/utils/localStorageSide'
import PrintsComponent from 'src/components/prints'
type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  keySearch: string
  skip: number
  take: number
}

export const dialogType = signal<'add' | 'update'>('add')
export const data = signal<ResExamInput>({})

const PediatricExam = () => {
  const router = useRouter()
  const [print, setPrint] = useState<boolean>(false)
  const [id, setId] = useState<string>('')
  const [updateResExam] = useMutation(UPDATE_RES_EXAM)
  const dataUser = getLocalstorage('userData')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  const [searchData, setSearchData] = useState<RequestType>({
    fromDate: startOfDay,
    toDate: endOfDay,
    statusId: '',
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [keySearch, setKeySearch] = useState('')
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const [tabValue, setTabValue] = useState('1')

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 200,
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
      flex: 0.25,
      minWidth: 200,
      field: 'patName',
      headerName: 'Họ Tên',
      renderCell: params => (
        <div className={styles.name}>
          <div>
            <span>{params.value}</span>
          </div>
          <div>
            <span>{params.row?.phone}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 160,
      field: 'doctor',
      headerName: 'Bác sĩ',
      renderCell: params => (
        <div className={styles.name}>
          <div>
            <span>
              {params.value?.fristName} {params.value?.lastName}
            </span>
          </div>
        </div>
      )
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        if (params.row.status === '100') {
          return <span className={styles.statusWaiting}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '102') {
          return <span className={styles.statusExaming}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '104') {
          return <span className={styles.statusPending}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '106') {
          return <span className={styles.statusComplete}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '107') {
          return <span className={styles.statusCancel}>{params.row.statusNavigation.name}</span>
        } else {
          return ''
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'resExamServiceDts',
      headerName: 'Dịch vụ',

      renderCell: params => {
        const findUnpaid = params.value.find((item: any) => item.paymentStatus === '101')
        return findUnpaid ? (
          <div>
            <span style={{ width: '200px' }} className={styles.statusWaiting}>
              Chưa thanh toán
            </span>
          </div>
        ) : (
          <div>
            <span style={{ width: '200px' }} className={styles.statusComplete}>
              Đã thanh toán
            </span>
          </div>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'prescriptions',
      headerName: 'Đơn thuốc',
      renderCell: params => {
        const status = params.value?.status
        if (params.value === null || params.value === undefined || status === null || status === undefined) {
          return <span className={styles.statusWaiting}>Chưa kê đơn</span>
        } else if (status === '111') {
          return <span className={styles.statusPending}>Chưa mua thuốc</span>
        } else if (status === '112') {
          return <span className={styles.statusComplete}>Đã mua thuốc</span>
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'object',
      headerName: 'Đối tượng',
      renderCell: params => (
        <div className={styles.name}>
          <div>
            <span>{params.row?.exploreObjects?.name}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              {
                params.row?.status === '100' ||
                  (params.row?.status === null &&
                    updateResExam({
                      variables: {
                        input: JSON.stringify({
                          id: params.row.id,
                          status: '102'
                        })
                      }
                    }))
              }
              router.push(`/examination/examination-list/examination-update/${params.row.id}`)
            }}
          >
            <Icon icon='bx:edit' fontSize={20} style={{ marginRight: 5, color: '#0292B1' }} />
          </IconButton>
          <IconButton
            title='In phiếu khám'
            onClick={() => {
              setId(params.row.id)
              setPrint(true)
            }}
          >
            <PrintIcon sx={{ color: '#BF8000', mr: 2 }} />
          </IconButton>

          {params.row?.status !== '107' ? (
            <IconButton
              onClick={() => {
                updateResExam({
                  variables: {
                    input: JSON.stringify({
                      id: params.row.id,
                      status: '107'
                    })
                  }
                })
              }}
              title='Huỷ'
            >
              <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
            </IconButton>
          ) : (
            <IconButton title='Huỷ'>
              <DeleteIcon sx={{ color: '#95a5b1', mr: 1.5 }} />
            </IconButton>
          )}
        </div>
      )
    }
  ]
  const statusGroup = [
    {
      id: '100',
      statusName: 'Chờ khám'
    },
    {
      id: '102',
      statusName: 'Đang khám'
    },
    {
      id: '104',
      statusName: 'Chờ thực hiện'
    },
    {
      id: '106',
      statusName: 'Hoàn thành'
    },
    {
      id: '107',
      statusName: 'Hủy khám'
    }
  ]

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  // Lấy dữ liệu
  const {
    data: queryData,
    loading,
    error,
    refetch
  } = useQuery(GET_RES_EXAM, {
    variables: queryVariables
  })

  const data: any[] = useMemo(() => {
    return queryData?.getResExam?.items ?? []
  }, [queryData])

  const onChangeTab = (e: any, value: any) => {
    setTabValue(value)
    setSearchData({
      ...searchData,
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
  }
  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        status: searchData.statusId ? { eq: searchData.statusId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { patName: { contains: searchData.keySearch } },
          { id: { contains: searchData.keySearch } },
          {
            doctor: {
              fristName: { contains: searchData.keySearch }
            }
          },
          {
            doctor: {
              lastName: { contains: searchData.keySearch }
            }
          }
        ]
      }
    }))
  }, [searchData, paginationModel])

  const clearSearch = () => {
    setQueryVariables({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setSearchData({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setKeySearch('')
  }

  const handleOpenAdd = () => {
    // setOpen(true);
  }

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader title={<Typography variant='h4'>Khám nhi</Typography>} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={6} md={2}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <ReactDatePicker
                    selected={searchData.fromDate}
                    autoComplete='true'
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
              </Grid>
              <Grid item xs={6} md={2}>
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
              <Grid item xs={6} md={2}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={statusGroup}
                  getOptionLabel={option => option.statusName}
                  value={statusGroup.find((x: any) => x.id === searchData.statusId)}
                  onChange={(e, value: any) => {
                    if (value && value.id === searchData.statusId) {
                      handleChangeSearch('statusId', value.id)
                    }
                    handleChangeSearch('statusId', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Trạng thái' />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container gap={2}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label='Từ khoá tìm kiếm'
                      autoComplete='off'
                      placeholder='Nhập từ khoá tìm kiếm'
                      value={keySearch}
                      onChange={e => {
                        setKeySearch(e.target.value)
                      }}
                      onBlur={e => handleChangeSearch('keySearch', e.target.value)}
                    />
                  </Grid>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleSearch()
                    }}
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      clearSearch()
                    }}
                  >
                    <Icon icon='bx:revision' fontSize={24} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <TabContext value={tabValue}>
              <TabList onChange={onChangeTab} color='red' centered={false} variant='scrollable' sx={{ width: '100%' }}>
                <Tab value='1' label='Danh sách' />
              </TabList>
            </TabContext>
            <DataGrid
              columns={COLUMN_DEF}
              rows={data.map((item, index) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              rowCount={queryData?.getResExam.totalCount ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              loading={loading}
              slots={{
                noRowsOverlay: () => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignContent: 'center',
                      height: '100%'
                    }}
                  >
                    <span>Không có dữ liệu</span>
                  </div>
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
          </CardContent>
        </Card>
      </Grid>
      <PrintsComponent
        openPrint={print}
        setOpenButtonDialog={setPrint}
        titlePrint='Phiếu Khám bệnh'
        clinicId='CLI0001'
        parentClinicId='CLI0001'
        printFunctionId='pr10000013'
        printType='p_res_id'
        printTypeId={id}
      />
    </Grid>
  )
}

export default PediatricExam
