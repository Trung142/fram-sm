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
import styles from './style.module.scss'
import { GET_WH_TRANSFER, GET_CLINIC } from './graphql/query'
import moment from 'moment'
import { useRouter } from 'next/router'
import { formatVND } from 'src/utils/formatMoney'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'
import { UPDATE_WH_TRANSFER } from './graphql/mutation'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import PrintIcon from '@mui/icons-material/Print'
import DetailDialog from './DetailDialog'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  placeReleaseId: string | null
  placeReceivingId: string | null
  keySearch: string
  skip: number
  take: number
}

const EpTransfer = () => {
  //========================================HANDLER================================
  const [updateWhImportSup] = useMutation(UPDATE_WH_TRANSFER)
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
    updateWhImportSup({
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
    placeReleaseId: '',
    placeReceivingId: '',
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
      placeReleaseId: '',
      placeReceivingId: '',
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
        placeReleaseId: searchData.placeReleaseId ? { eq: searchData.placeReleaseId } : undefined,
        placeReceivingId: searchData.placeReceivingId ? { eq: searchData.placeReceivingId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { id: { contains: searchData.keySearch } }
        ]
      }
    }))
  }, [searchData, paginationModel])

  //========================================DATA================================
  const status = [
    { id: '301', name: 'Lưu nháp' },
    { id: '302', name: 'Hoàn thành' },
    { id: '303 ', name: 'Đã hủy' }
  ]

  const {
    data: getWhTransfer,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_TRANSFER, {
    variables: queryVariables
  })

  const { data: getClinic } = useQuery(GET_CLINIC)
  const whTransfer: any[] = useMemo(() => {
    refetch()
    return getWhTransfer?.getWhTransfer?.items ?? []
  }, [getWhTransfer])
  const clinic = useMemo(() => {
    return getClinic?.getClinic?.items ?? []
  }, [getClinic])

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
      minWidth: 250,
      field: 'placeRelease',
      headerName: 'Nơi xuất',
      renderCell: params => 
        <div>
          {params.row?.placeRelease?.name}
          <br/>
          {params.row?.whRelease?.name}
        </div>
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'placeReceiving',
      headerName: 'Nơi nhập',
      renderCell: params => 
        <div>
          {params.row?.placeReceiving?.name}
          <br/>
          {params.row?.whReceiving?.name}
        </div>
    },
    {
      flex: 0.3,
      minWidth: 120,
      field: 'totalAmount',
      headerName: 'Tổng tiền',
      renderCell: params => <div>{formatVND(params.value)}</div>
    },
    {
      flex: 0.45,
      minWidth: 150,
      field: 'note',
      headerName: 'Ghi chú',
      renderCell: params => (params.value ? params.value : '')
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        const status = () => {
          if (params.row.status === '302') {
            return <span className={styles.completed}>HOÀN THÀNH</span>
          } else if (params.row?.status === '303') {
            return <span className={styles.cancel}>ĐÃ HỦY</span>
          } else if (params.row?.status === '301') {
            return <span className={styles.temp}>LƯU NHÁP</span>
          }
        }
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            {status()}
          </div>
        )
      }
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
            <MenuItem disabled={statusId !== '301'} onClick={handleChoiceDelete}>
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
              <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>điều chuyển</h2>
              <Box sx={{ display: 'flex', gap: '11px' }}>
                <Button
                  variant='contained'
                  sx={{ pl: 5, pr: 8, backgroundColor: '#0292B1', paddingX: 5 }}
                  onClick={() => route.push('/inventory/ep_transfer/add')}
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
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowGap={5}>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
                options={clinic}
                value={clinic.find((x: any) => x.id === searchData.placeReleaseId) ?? ''}
                onChange={(e, value: any) => handleChangeSearch('placeReleaseId', value?.id)}
                placeholder='Phòng khám xuất'
                renderInput={params => (
                  <TextField {...params} label='Phòng khám xuất' placeholder='Phòng khám xuất' InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={clinic}
                value={clinic.find((x: any) => x.id === searchData.placeReceivingId) ?? ''}
                onChange={(e, value: any) => handleChangeSearch('placeReceivingId', value?.id)}
                placeholder='Phòng khám nhận'
                renderInput={params => (
                  <TextField {...params} label='Phòng khám nhận' placeholder='Phòng khám nhận' InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={status}
                placeholder='Trạng thái điều chuyển'
                getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Trạng thái điều chuyển'
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
            <Grid item xs={12} sm={6}>
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
              rows={whTransfer.map((item: any, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
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
export default EpTransfer
