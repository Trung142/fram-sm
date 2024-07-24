import React, { useState, useEffect, useMemo } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  Grid,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Card,
  Typography,
  Menu,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useMutation, useQuery } from '@apollo/client'

import { GET_WH_CHECK_INV, GET_WH } from './graphql/query'
import moment from 'moment'
import { useRouter } from 'next/router'
import { formatVND } from 'src/utils/formatMoney'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import PrintIcon from '@mui/icons-material/Print'
import DetailDialog from './DetailDialog'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { UPDATE_WH_CHECK_INV } from './graphql/mutaion'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  whReleaseId: string | null
  keySearch: string
  skip: number
  take: number
}

const InventoryCheck = () => {
  //========================================HANDLER================================
  const [updateWhCheckInv] = useMutation(UPDATE_WH_CHECK_INV)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)
  const [id, setId] = useState<string>()
  const [data, setData] = useState()
  const [statusId, setStatusId] = useState<string>()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const route = useRouter()
  const handleChoiceDelete = () => {
    toast(t => (
      <div>
        <Typography fontWeight={500} fontSize={'1.25rem'}>
          Bạn chắc chắn muốn hủy phiếu {id}?
        </Typography>
        <br />
        <span style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            variant='contained'
            color='error'
            sx={{ paddingX: 5 }}
            startIcon={<Icon icon='bx:trash' />}
            onClick={() => {
              handleDelete(id)
              toast.dismiss(t.id)
            }}
          >
            hủy
          </Button>
          <Button
            variant='contained'
            color='info'
            sx={{ paddingX: 5 }}
            startIcon={<Icon icon='lets-icons:back' width='24' height='24' />}
            onClick={() => toast.dismiss(t.id)}
          >
            quay về
          </Button>
        </span>
      </div>
    ))
  }
  const handleDelete = (id: string | undefined) => {
    updateWhCheckInv({
      variables: {
        input: JSON.stringify({
          id: id,
          status: '303'
        })
      },
      onCompleted: async () => {
        await refetch()
        toast.success(`Hủy phiếu ${id} thành công`)
      }
    })
  }
  //========================================SEARCH-DATA================================
  const [keySearch, setKeySearch] = useState('')
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
    whReleaseId: '',
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const handleChangeSearch = (key: string, value: any) => {
    setPaginationModel({
      page: 0,
      pageSize: 25
    })
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
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
      whReleaseId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setKeySearch('')
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }
  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        status: searchData.statusId ? { eq: searchData.statusId } : undefined,
        whReleaseId: searchData.whReleaseId ? { eq: searchData.whReleaseId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { id: { contains: searchData.keySearch } },
          { whRelease: { name: { contains: searchData.keySearch } } },
        ]
      }
    }))
  }, [searchData, paginationModel])

  //========================================DATA================================
  const user = getLocalstorage('userData')
  const status = [
    { id: '301', name: 'Lưu nháp' },
    { id: '302', name: 'Hoàn thành' },
    { id: '303 ', name: 'Đã hủy' }
  ]

  const {
    data: getWhCheckInv,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_CHECK_INV, {
    variables: queryVariables
  })

  const { data: getWhName } = useQuery(GET_WH, {variables: {input: {parentClinicId: {eq: user.parentClinicId}}}})
  const whCheckInv: any[] = useMemo(() => {
    refetch()
    return getWhCheckInv?.getWhCheckInv?.items ?? []
  }, [getWhCheckInv])
  const getWh = useMemo(() => {
    return getWhName?.getWarehouse?.items ?? []
  }, [getWhName])
  
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
      headerName: 'Mã phiếu',
      renderCell: params => (
        <div>
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
      flex: 0.35,
      minWidth: 200,
      field: 'whName',
      headerName: 'Kho',
      renderCell: params => {
        return `${params.row?.whRelease?.name} `
      }
    },
    {
      flex: 0.3,
      minWidth: 120,
      field: 'totalDifference',
      headerName: 'Tồn hiện tại',
      renderCell: params => <div>{formatVND(params.value)}</div>
    },
    {
      flex: 0.45,
      minWidth: 230,
      field: 'note',
      headerName: 'Ghi chú',
      valueFormatter: params => (params.value ? params.value : '')
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => (
        <div>
          {params.row.status == '301' ? (
            <Button
              variant='outlined'
              color='primary'
              style={{ width: '102px', fontSize: '13px', borderRadius: '10px' }}
            >
              Lưu nháp
            </Button>
          ) : params.row.status == '303' ? (
            <Button variant='outlined' color='error' style={{ width: '102px', fontSize: '13px', borderRadius: '10px' }}>
              ĐÃ HỦY
            </Button>
          ) : (
            params.row.status == '302' && (
              <Button
                style={{
                  width: '102px',
                  fontSize: '13px',
                  backgroundColor: 'rgba(38, 249, 160, 0.1215686275)',
                  color: '#67C932',
                  borderRadius: '10p',
                  border: '1px solid #67C932'
                }}
                variant='contained'
                color='success'
              >
                Hoàn thành
              </Button>
            )
          )}
        </div>
      )
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: params => {
        return (
        <div className='flex justify-center'>
          <IconButton
            title='Xem chi tiết'
            onClick={() => {
              if (params.row?.id) {
                setData(params.row)
                setOpenDetailDialog(true)
              }
            }}
          >
            <RemoveRedEyeOutlinedIcon />
          </IconButton>
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
            <Icon icon='icon-park-outline:more-two' />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose}>
              <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu
            </MenuItem>
            <MenuItem disabled={statusId !== '301'} 
              onClick={handleChoiceDelete}
            >
              <Icon icon='bx:trash' width='24' height='24' color='#FF3E1D' style={{ marginRight: 8 }} /> Hủy phiếu
            </MenuItem>
          </Menu>
        </div>
        )
      }
    }
  ]

  return (
    <>
      <DetailDialog open={[openDetailDialog, setOpenDetailDialog]} data={data}/>
      <Grid container spacing={2}>
        <Card sx={{ width: '100%', p: 5 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>KIỂM KHO</h2>
              <Box sx={{ display: 'flex', gap: '11px' }}>
                <Button
                  variant='contained'
                  sx={{ pl: 5, pr: 8, backgroundColor: '#0292B1', paddingX: 5 }}
                  onClick={() => route.push('/inventory/inventory-check/add')}
                  startIcon={<AddIcon />}
                >
                  Thêm mới
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
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowGap={6}>
            <Grid item xs={12} sm={2}>
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
            </Grid>
            <Grid item xs={12} sm={2}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={searchData.toDate}
                  dateFormat={'dd/MM/yyyy'}
                  customInput={
                    <TextField
                      fullWidth
                      label='Đến ngày '
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
            <Grid item xs={12} sm={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={getWh}
                value={getWh.find((x: any) => x.id === searchData.whReleaseId) ?? ''}
                onChange={(e, value: any) => handleChangeSearch('whReleaseId', value?.id)}
                placeholder='Thông tin kho'
                renderInput={params => (
                  <TextField {...params} label='Thông tin kho' placeholder='Kho' InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={status}
                placeholder='Trạng thái kiểm kho'
                getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Trạng thái kiểm kho'
                    placeholder='Trạng thái'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                onChange={(e, value: any) => {
                  if (value && value.id === searchData.statusId) {
                    handleChangeSearch('statusId', value.id)
                  }
                  handleChangeSearch('statusId', value?.id)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <div style={{ display: 'flex' }}>
                <TextField  
                  label='Nhập từ khoá tìm kiếm'
                  placeholder='Nhập từ khoá tìm kiếm'
                  InputLabelProps={{ shrink: true }}
                  value={keySearch}
                  onChange={e => {
                    setKeySearch(e.target.value)
                  }}
                  onBlur={e => handleChangeSearch('keySearch', e.target.value)}
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
                  style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                  onClick={() => {
                    handleSearch()
                  }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  variant='contained'
                  style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
                  onClick={() => {
                    clearSearch()
                  }}
                >
                  <RefreshIcon />
                </Button>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <>
            <DataGrid
              columns={COLUMN_DEF}
              rows={whCheckInv.map((item: any, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              rowCount={getWhCheckInv?.getWhCheckInv?.totalCount ?? 0}
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
          </>
        </Card>
      </Grid>
    </>
  )
}
export default InventoryCheck
