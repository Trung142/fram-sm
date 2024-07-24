// ** React Imports
import { useEffect, useMemo, useState, useCallback } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Autocomplete, Button, IconButton, Tab, TextField, InputAdornment } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** GraphQL
import { useQuery, useMutation } from '@apollo/client'
import { GET_PATEINT, GET_PAT_GROUP, GET_PAT_TYPE } from './graphql/query'
import { UPDATE_PATIENT } from './graphql/mutation'

// ** Custom Components Imports
import styles from './index.module.scss'
import MUIDialog from 'src/@core/components/dialog'
import UpdatePatient from './update'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import moment from 'moment'
import { signal } from '@preact/signals'
import ActivityTag from '../service/components/activity-tag'
import ConfirmDialog from '../dialog/confirm/confirm'

type RequestType = {
  patTypeId: string | null
  patGroupId: string | null
  keySearch: string
  status: boolean | null
  statusId: string | null
  skip: number
  take: number
  createFrom: Date
  createTo: Date
}

export const dialogType = signal<'add' | 'update'>('add')

const Patient = () => {
  //mutation update
  const [updatePatient, { data: updateDatas, loading: updateLoading, error: updateError }] = useMutation(UPDATE_PATIENT)

  // ** Dialog
  const open = useState(false)
  const openconfirm = useState(false)
  // const [dialogType, setDialogType] = useState<"add" | "update">('add'); // Loại dialog
  const [updateData, setUpdateData] = useState<any>({}) // Dữ liệu cập nhật

  // Data tìm kiếm
  const { data: patGroupData } = useQuery(GET_PAT_GROUP)
  const { data: patTypeData } = useQuery(GET_PAT_TYPE)

  // Tham số tìm kiếm
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState<RequestType>({
    patTypeId: null,
    patGroupId: '',
    keySearch: '',
    status: null,
    statusId: '',
    skip: 0,
    take: paginationModel.pageSize,
    createFrom: new Date(new Date().getTime() - 24 * 5 * 3600 * 1000),
    createTo: new Date((new Date().getTime()) )
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
      flex: 0.1,
      minWidth: 200,
      field: 'id',
      headerName: 'Mã Khách Hàng'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Họ Tên'
    },
    {
      flex: 0.25,
      minWidth: 160,
      field: 'phone',
      headerName: 'Số điện thoại'
    },
    {
      flex: 0.15,
      minWidth: 60,
      field: 'gender',
      headerName: 'Giới tính',
      valueFormatter: params => (params.value === 1 ? 'Nam' : 'Nữ')
    },
    {
      flex: 0.15,
      minWidth: 130,
      headerName: 'Ngày sinh',
      field: 'birthday',
      valueFormatter: params => (params.value ? moment(params.value).format('DD/MM/YYYY') : '')
    },
    {
      flex: 0.45,
      minWidth: 230,
      field: 'address',
      headerName: 'Địa chỉ'
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'debt',
      headerName: 'Công nợ'
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        return (
          <ActivityTag type={params.value ? 'success' : 'denied'}>
            {params.value ? 'Hoạt động' : 'Tạm dừng'}
          </ActivityTag>
        )
      }
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              handleOpenUpdate(params.row)
            }}
          >
            <Icon icon='bx:edit' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            disabled={!params.row.status}
            onClick={() => {
              handleDisable(params.row)
            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton title='Thanh toán'>
            <Icon icon='bx:dollar' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton title='Điều chỉnh công nợ'>
            <Icon icon='bx:wallet' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]

  const statusGroup = [
    {
      id: '00',
      statusName: 'Hoạt Động',
      status: true
    },
    {
      id: '10',
      statusName: 'Tạm Dừng',
      status: false
    }
  ]

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  // Lấy dữ liệu
  const { data, loading, error, refetch } = useQuery(GET_PATEINT, {
    variables: queryVariables
  })

  const patGroup = useMemo(() => {
    return patGroupData?.getPatGroup?.items ?? []
  }, [patGroupData])

  const patType = useMemo(() => {
    return patTypeData?.getPatType?.items ?? []
  }, [patTypeData])

  const patientList: any[] = useMemo(() => {
    return data?.getPatient?.items ?? []
  }, [data])

  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        patGroupId: searchData.patGroupId ? { eq: searchData.patGroupId } : undefined,
        patTypeId: searchData.patTypeId ? { eq: searchData.patTypeId } : undefined,
        status: searchData.status !== null && searchData.status !== undefined ? { eq: searchData.status } : undefined,
        or: [
          { name: { contains: searchData.keySearch } },
          { phone: { contains: searchData.keySearch } },
          { email: { contains: searchData.keySearch } },
          { address: { contains: searchData.keySearch } }
        ],
        and: [
          { createAt: searchData.createFrom ? { gte: searchData.createFrom } : undefined },
          { createAt: searchData.createTo ? { lte: searchData.createTo } : undefined }
        ]
      }
    }))
  }, [searchData, paginationModel])

  useEffect(() => {
    refetch({ variables: queryVariables })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryVariables])

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  const clearSearch = () => {
    setQueryVariables({
      patTypeId: null,
      patGroupId: null,
      keySearch: '',
      status: null,
      skip: 0,
      take: paginationModel.pageSize,
      createFrom: null,
      createTo: null
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setKeySearch('')
  }

  const handleOpenAdd = () => {
    setUpdateData({
      gender: 1,
      status: true
    })
    // setDialogType('add');
    dialogType.value = 'add'
    open[1](true)
  }

  const handleOpenUpdate = (data: any) => {
    setUpdateData(data)
    // setDialogType('update');
    dialogType.value = 'update'
    open[1](true)
  }

  const handleDisable = (data: any) => {
    setUpdateData({
      id: data.id,
      status: !data.status
    })
    openconfirm[1](true)
  }

  const onChangeTab = (e: any, value: any) => {
    setTabValue(value)
    setSearchData({
      ...searchData,
      skip: 0,
      take: paginationModel.pageSize,
      status: value === '1' ? null : value === '2' ? true : false
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
  }

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title='Khách hàng'
            action={
              <Button variant='contained' color='primary' sx={{ pl: 5, pr: 8 }} onClick={() => handleOpenAdd()}>
                <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                Thêm mới
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={3} md={1.5}>
                <DatePickerWrapper>
                  <ReactDatePicker
                    selected={searchData.createFrom}
                    dateFormat={'dd/MM/yyyy'}
                    showMonthDropdown
                    showYearDropdown
                    customInput={
                      <TextField
                        fullWidth
                        label='Từ Ngày'
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
                    onChange={(date: Date) => handleChangeSearch('createFrom', date ? date : null)}
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={3} md={1.5}>
                <DatePickerWrapper>
                  <ReactDatePicker
                    selected={searchData.createTo}
                    dateFormat={'dd/MM/yyyy'}
                    showMonthDropdown
                    showYearDropdown
                    customInput={
                      <TextField
                        fullWidth
                        label='Đến Ngày'
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
                    onChange={(date: Date) => handleChangeSearch('createTo', date ? date : null)}
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={3} md={3}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={patGroup}
                  value={patGroup.find((x: any) => x.id === searchData.patGroupId) ?? ''}
                  onChange={(e, value: any) => handleChangeSearch('patGroupId', value?.id)}
                  renderInput={params => <TextField {...params} label='Nhóm khách hàng' />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Autocomplete
                  fullWidth
                  options={patType}
                  value={patType.find((x: any) => x.id === searchData.patTypeId) ?? ''}
                  onChange={(e, value: any) => handleChangeSearch('patTypeId', value?.id)}
                  renderInput={params => <TextField {...params} label='Loại khách hàng' />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Autocomplete
                  fullWidth
                  options={statusGroup}
                  getOptionLabel={option => option.statusName}
                  value={statusGroup.find((x: any) => x.id === searchData.statusId)}
                  onChange={(e, value: any) => {
                    if (value && value.status === searchData.status) {
                      handleChangeSearch('status', value?.status)
                    }
                    handleChangeSearch('status', value?.status)
                  }}
                  renderInput={params => <TextField {...params} label='Trạng Thái Hoạt Động' />}
                />
              </Grid>
              <Grid item xs={12} md={6.5}>
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
            {
              <DataGrid
                columns={COLUMN_DEF}
                rows={patientList.map((item, index) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={data?.getPatient?.totalCount ?? 0}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                loading={loading}
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                style={{ minHeight: 500, height: '60vh' }}
              />
            }
          </CardContent>
        </Card>
      </Grid>
      <MUIDialog
        open={open}
        maxWidth={false}
        title={dialogType.value === 'add' ? 'Thêm mới khách hàng' : 'Cập nhật thông tin khách hàng'}
      >
        <UpdatePatient open={open} data={updateData} onSubmit={handleSearch} />
      </MUIDialog>
      <MUIDialog open={openconfirm} title={'Cảnh Báo'}>
        <ConfirmDialog open={openconfirm} data={updateData} onSubmit={handleSearch} confirmType={'patient'} />
      </MUIDialog>
    </Grid>
  )
}
export default Patient
