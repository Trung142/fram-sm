import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { use, useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './styles.module.scss'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import PrintIcon from '@mui/icons-material/Print'
import { formatNumber } from 'src/utils/formatMoney'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DetailDialog from './DetailDialog'
import { GET_ORDER, GET_PAYMENT_TYPE } from './graphql/query'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_ORDER } from './graphql/mutation'
import toast from 'react-hot-toast'
import { Order, PaymentType } from './graphql/variables'
import Dialog from '@mui/material/Dialog'
import PrintsComponent from 'src/components/prints'
import { getLocalstorage } from 'src/utils/localStorageSide'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  paymentType: string | null
  keySearch: string
  skip: number
  take: number
}
const StyledDataGrid = styled('div')(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#32475C38'
  }
}))
const OrderInvoice = () => {
  //==============================HANDLE============================
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [priteOpen, setPrintOpen] = useState(false)
  const dataUser = getLocalstorage('userData')
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)
  const [dataDt, setDataDt] = useState<Order>()
  const setDialog = (data: Order) => {
    setDataDt(data)
    setOpenDetailDialog(true)
  }
  const [id, setId] = useState<string>('')
  const choiceDelete = () => {
    toast(t => (
      <div>
        <Typography fontWeight={500} fontSize={'1.25rem'}>
          Bạn chắc chắn muốn hủy phiếu?
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
  const handPrint = () => {
    setPrintOpen(true)
    handleClose()
  }
  const handleDelete = (id: string) => {
    updateOrder({
      variables: {
        input: JSON.stringify({
          id: id,
          status: '103'
        })
      },
      onCompleted: () => {
        toast.success(`Hủy phiếu ${id} thành công`)
      }
    })
  }
  //==============================TABLE============================
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.5,
      minWidth: 100,
      field: 'index',
      headerName: '#'
    },
    {
      flex: 2,
      minWidth: 200,
      field: 'id',
      headerName: 'MÃ HÓA ĐƠn',
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
      flex: 2,
      minWidth: 200,
      field: 'customer',
      headerName: 'KHÁCH HÀNG',
      renderCell: params => {
        if (params.row?.resExam?.id) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{params.row?.pat?.name}</span>
              <span>(PK: {params.row?.resExam?.patName})</span>
            </div>
          )
        } else if (params.row?.pat) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Khách lẻ</span>
              <span>({params.row?.pat?.name})</span>
            </div>
          )
        } else return <span>Khách lẻ</span>
      }
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'finalPrice',
      headerName: 'THÀNH TIỀN',
      renderCell: params => (
        <div>
          <span>{formatNumber(params.row?.finalPrice)} VNĐ</span>
        </div>
      )
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'amountPayment',
      headerName: 'THANH TOÁN',
      renderCell: params => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{formatNumber(params.row?.payments[0]?.actuallyReceivedAmount || 0)} VNĐ</span>
          {params.row?.payments[0]?.debtAmount === 0 ? null : (
            <span>Dư nợ: {formatNumber(params.row?.payments[0]?.debtAmount || 0)}</span>
          )}
        </div>
      )
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'note',
      headerName: 'GHI CHÚ',
      renderCell: params => <div>{params.row?.note}</div>
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'payment_type',
      headerName: 'P.THỨC THANH TOÁN',
      renderCell: params => (
        <div>
          <span>{params.row?.paymentType?.name}</span>
        </div>
      )
    },
    {
      flex: 1.5,
      minWidth: 200,
      field: 'status',
      headerName: 'TRẠNG THÁI',
      renderCell: params => {
        const status = () => {
          if (params.row.status === '102') {
            return <span className={styles.buy_completed}>ĐÃ THANH TOÁN</span>
          } else if (params.row?.status === '103') {
            return <span className={styles.buy_delete}>ĐÃ HỦY</span>
          } else if (params.row?.status === '101') {
            return <span className={styles.buy_waiting}>CHƯA MUA</span>
          }
        }
        const payment =
          params.row?.paymentStatus === true ? <UploadFileIcon sx={{ color: '#72E1288A' }} /> : <UploadFileIcon />
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            {status()} {payment}
          </div>
        )
      }
    },
    {
      flex: 1.5,
      field: 'action',
      minWidth: 100,
      headerName: 'THAO TÁC',
      renderCell: params => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            title='Xem chi tiết'
            onClick={() => {
              if (params.row?.id) {
                setDialog(params.row)
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
            <MenuItem onClick={handPrint}>
              <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu
            </MenuItem>
            <MenuItem onClick={choiceDelete}>
              <Icon icon='bx:trash' width='24' height='24' color='#FF3E1D' style={{ marginRight: 8 }} /> Hủy phiếu
            </MenuItem>
          </Menu>
        </div>
      )
    }
  ]

  //====================================SEARCH-DATA==================================
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
    paymentType: '',
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
  const statusGroup = [
    {
      id: '101',
      statusName: 'Chưa mua'
    },
    {
      id: '102',
      statusName: 'Đã thanh toán'
    },
    {
      id: '103',
      statusName: 'Đã hủy'
    },
    {
      id: '',
      statusName: 'Tất cả'
    }
  ]
  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        status: searchData.statusId ? { eq: searchData.statusId } : undefined,
        paymentType: searchData.paymentType ? { id: { eq: searchData.paymentType } } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { id: { contains: searchData.keySearch } },
          {
            pat: {
              name: { contains: searchData.keySearch }
            }
          }
        ]
      }
    }))
  }, [searchData, paginationModel])
  const clearSearch = () => {
    setSearchData({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      paymentType: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setQueryVariables({
      input: {},
      skip: searchData.skip,
      take: searchData.take
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
  }
  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  //==================================DATA =============================
  const { data: queryData, loading, error, refetch } = useQuery(GET_ORDER, { variables: queryVariables })
  const { data: getPaymentType } = useQuery(GET_PAYMENT_TYPE)
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const data: Order[] = useMemo(() => {
    refetch()
    return queryData?.getOrder?.items ?? []
  }, [queryData, refetch])
  const paymentType: PaymentType[] = useMemo(() => {
    return getPaymentType?.getPaymentType?.items ?? []
  }, [getPaymentType])
  return (
    <Grid container>
      {openDetailDialog ? (
        <DetailDialog open={[openDetailDialog, setOpenDetailDialog]} data={dataDt} handlePrint={handPrint} />
      ) : null}
      <Grid item md={12} xs={12}>
        <Card sx={{ p: 5 }}>
          <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
            <Typography variant='h4' ml={10}>
              Hóa đơn
            </Typography>
            <Button variant='contained' sx={{ paddingX: 5, backgroundColor: '#55A629' }}>
              <Icon icon='bx:bxs-file-export' fontSize={20} style={{ marginRight: 5 }} />
              XUẤT EXCEL
            </Button>
          </Stack>
          <Grid container spacing={6} mt={3}>
            <Grid item xs={6} md={2}>
              <DatePickerWrapper>
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
              <DatePickerWrapper>
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

            <Grid item xs={6} md={2}>
              <Autocomplete
                disablePortal
                fullWidth
                options={paymentType}
                getOptionLabel={option => option.name}
                value={paymentType.find((x: any) => x.id === searchData.paymentType)}
                onChange={(e, value: any) => {
                  if (value && value.id === searchData.paymentType) {
                    handleChangeSearch('paymentType', value.id)
                  }
                  handleChangeSearch('paymentType', value?.id)
                }}
                renderInput={params => <TextField {...params} label='Phương thức thanh toán' />}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label='Nhập tìm kiếm'
                    autoComplete='off'
                    placeholder='Nhập từ khoá tìm kiếm'
                    value={searchData.keySearch}
                    onChange={e => {
                      handleChangeSearch('keySearch', e.target.value)
                    }}
                  />
                </Grid>
                <Button
                  sx={{ ml: -1, borderRadius: 0 }}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    handleSearch()
                  }}
                >
                  <Icon icon='bx:search' fontSize={24} />
                </Button>
                <Button
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
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
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant='h6' color={'white'}>
                DANH SÁCH HÓA ĐƠN
              </Typography>
            }
            sx={{ backgroundColor: '#0292B1', height: '10px' }}
          />
          <CardContent sx={{ width: '104.5%', ml: -6 }}>
            <StyledDataGrid>
              <DataGrid
                columns={COLUMN_DEF}
                rows={data.map((item, index) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={queryData?.getOrder?.totalCount ?? 0}
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
            </StyledDataGrid>
          </CardContent>
        </Card>
      </Grid>
      <PrintsComponent
        printFunctionId='pr10000002'
        printType='p_order_id'
        printTypeId={id}
        clinicId={dataUser.clinicId}
        parentClinicId={dataUser.parentClinicId}
        openPrint={priteOpen}
        setOpenButtonDialog={setPrintOpen}
        titlePrint='In hoá đơn bán hàng'
      />
    </Grid>
  )
}

export default OrderInvoice
