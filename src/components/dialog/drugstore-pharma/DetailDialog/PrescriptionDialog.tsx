import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import MUIDialog from 'src/@core/components/dialog'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useQuery } from '@apollo/client'
import { GET_CANSALES, GET_PRESCRIPTION } from './graphql/query'
import moment from 'moment'
import styles from './index.module.scss'
import { IPrescription, IPrescriptionDts, IProduct } from './graphql/variables'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'

type handle = {
  openButtonDialog: boolean
  setOpenButtonDialog: any
  dataPayment: any
  totalPrice: number
  data: any
  product: any
}
type handleDt = {
  openButtonDialog: boolean
  setOpenButtonDialog: any
  data?: IPrescription
}
type ICk = {
  priceCK: number
  ck: number
  status: string
}

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  keySearch: string
  skip: number
  take: number
}
const startOfDay = new Date()
startOfDay.setHours(0, 0, 0, 0)

const endOfDay = new Date()
endOfDay.setHours(23, 59, 59, 999)

export default function PrescriptionDialog({
  openButtonDialog,
  setOpenButtonDialog,
  dataPayment,
  data,
  product
}: handle) {
  const { handleSubmit, control } = useForm()
  const [keySearch, setKeySearch] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dataProduct, setDataProduct] = useState<IProduct[]>([])
  const [selectedPrescriptionDetail, setSelectedPrescriptionDetail] = useState<IPrescription>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState<RequestType>({
    fromDate: startOfDay,
    toDate: endOfDay,
    statusId: '',
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const {
    data: dataPrescription,
    refetch,
    loading
  } = useQuery(GET_PRESCRIPTION, {
    variables: queryVariables
  })

  const getDataPrescription: any[] = useMemo(() => {
    return dataPrescription?.getPrescription?.items ?? []
  }, [dataPrescription])

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
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
        status: { eq: '111' },
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { id: { contains: searchData.keySearch } },
          {
            resExam: {
              patName: { contains: searchData.keySearch }
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
  const columns: GridColDef<IPrescription>[] = [
    {
      flex: 0.1,
      maxWidth: 80,
      field: 'index',
      headerName: 'STT',
      editable: true
    },
    {
      field: 'resExamId',
      headerName: 'Mã phiếu',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row.resExamId}</span>
          </div>
          <div>
            <span>{moment(params.row?.createAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      )
    },
    {
      field: 'id',
      headerName: 'Mã đơn thuốc',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.id}</span>
          </div>
        </div>
      )
    },
    {
      field: 'patName',
      headerName: 'Tên bệnh nhân',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row.resExam?.patName}</span>
          </div>
        </div>
      )
    },
    {
      field: 'bhytYn',
      headerName: 'Thuốc BHYT',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <Checkbox disabled checked={params.row?.bhytYn ? true : false} />
          </div>
        </div>
      )
    },
    {
      minWidth: 160,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        if (params.row.status == '111') {
          return <span className={styles.statusPending}>Chưa mua</span>
        }
      }
    },
    {
      width: 160,
      field: 'acttons',
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Xem chi tiết'
            onClick={() => {
              setSelectedPrescriptionDetail(params.row)
              setOpen(true)
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </div>
      )
    }
  ]

  const columnDts: GridColDef<IPrescriptionDts>[] = [
    {
      flex: 0.1,
      maxWidth: 80,
      field: 'index',
      headerName: 'STT',
      editable: true
    },
    {
      field: 'name',
      headerName: 'Tên thuốc',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row.product?.productName}</span>
          </div>
        </div>
      )
    },
    {
      field: 'dosage',
      headerName: 'Liều dùng',
      minWidth: 300,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row.dosage}</span>
          </div>
        </div>
      )
    },
    {
      field: 'prescribingUnit',
      headerName: 'Đvk',
      minWidth: 50,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row.product?.prescribingUnit?.name}</span>
          </div>
        </div>
      )
    },
    {
      field: 'soluong',
      headerName: 'Số lượng',
      minWidth: 50,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row?.quantity}</span>
          </div>
        </div>
      )
    },
    {
      field: 'buy',
      headerName: 'Mua',
      minWidth: 50,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.row?.quantity}</span>
          </div>
        </div>
      )
    },
    {
      field: 'quantity',
      headerName: 'Đơn giá',
      minWidth: 50,
      editable: true,
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{(params.row.product?.price || 0) * (params.row.quantity || 0)}</span>
          </div>
        </div>
      )
    }
  ]

  const PrescriptionDetailDialog = ({ openButtonDialog, setOpenButtonDialog, data }: handleDt) => {
    return (
      <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Chi tiết toa thuốc'>
        <>
          {data && (
            <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
              <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Đơn thuốc</h2>
              <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={6}>
                  <Typography sx={{ height: '50px', lineHeight: '50px', fontWeight: 'bold' }}>
                    Mã phiếu: {data?.id}
                  </Typography>
                  <Typography sx={{ height: '50px', lineHeight: '50px', fontWeight: 'bold' }}>
                    Tên bệnh nhân: {data?.resExam?.patName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ height: '50px', lineHeight: '50px', fontWeight: 'bold' }}>
                    Ngày kê đơn: {data?.createAt}
                  </Typography>
                  <Typography sx={{ height: '50px', lineHeight: '50px', fontWeight: 'bold' }}>
                    Tên bác sỹ:{' '}
                    {(data?.resExam?.doctor?.fristName || 'không') + ' ' + (data?.resExam?.doctor?.lastName || 'có')}
                  </Typography>
                </Grid>
              </Grid>
              <Controller
                name='selectedPrescription'
                control={control}
                render={({ field }) => (
                  <Grid container display='flex' flexDirection='column'>
                    <Grid item lg={12} sx={{ mt: 10 }}>
                      <Typography
                        style={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', top: '52%', left: '4%' }}
                      >
                        Tổng số thuốc{' '}
                        {selectedPrescriptionDetail && (selectedPrescriptionDetail?.prescriptionDts ?? []).length}
                      </Typography>

                      <DataGrid
                        rows={
                          data &&
                          (data?.prescriptionDts ?? []).map((item, index) => ({
                            ...item,
                            index: index + 1 + paginationModel.page * paginationModel.pageSize
                          }))
                        }
                        columns={columnDts}
                        rowCount={(data?.prescriptionDts ?? []).length ?? 0}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        paginationMode='server'
                        rowHeight={100}
                        loading={loading}
                        slots={{
                          noRowsOverlay: () => (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignContent: 'center',
                                height: '300px'
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
                        style={{ maxHeight: 350, height: '55vh' }}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Box>
          )}
          <Stack
            sx={{ padding: '8px', backgroundColor: '#D9D9D9' }}
            direction={'row'}
            spacing={4}
            justifyContent={'end'}
          >
            <Button
              variant='contained'
              color='primary'
              sx={{ width: '180px', color: '#fff' }}
              startIcon={<LocalPrintshopIcon />}
              onClick={() => setOpenButtonDialog(false)}
            >
              In phiếu
            </Button>
            <Button
              variant='contained'
              sx={{ width: '180px', color: '#fff', backgroundColor: '#8592A3' }}
              startIcon={<Icon icon='eva:close-fill' />}
              onClick={() => setOpenButtonDialog(false)}
            >
              Đóng
            </Button>
          </Stack>
        </>
      </MUIDialog>
    )
  }

  const submitHandler = () => {
    const updatedWhExistenceDt: any[] = []
    selectedItem[0]?.prescriptionDts.forEach((element: IPrescriptionDts) => {
      const sortedWhExistenceDt = [...(element.product?.cansales ?? [])].reverse()

      let remainingQuantity = element.quantity || 1

      for (let i = 0; i < sortedWhExistenceDt.length; i++) {
        const item = sortedWhExistenceDt[i]
        if (remainingQuantity === 0) break

        if (item.totalRemaining >= (remainingQuantity || 1)) {
          updatedWhExistenceDt.push({
            ...element.product,
            ck: 0,
            id: `new${Date.now()}`,
            productId: element.productId,
            quantity: remainingQuantity,
            totalPrice: remainingQuantity * (element.product?.price || 0),
            wh: { ...item, totalRemaining: item.totalRemaining - (remainingQuantity || 1) }
          })
          remainingQuantity = 0
        } else {
          remainingQuantity -= item.totalRemaining
          updatedWhExistenceDt.push({
            ...element.product,
            ck: 0,
            id: `new${Date.now()}`,
            productId: element.productId,
            quantity: remainingQuantity,
            totalPrice: remainingQuantity * (element.product?.price || 0),
            wh: { ...item, totalRemaining: 0 }
          })

          while (remainingQuantity > 0 && i < sortedWhExistenceDt.length - 1) {
            i++
            const nextItem = sortedWhExistenceDt[i]

            if (nextItem.totalRemaining >= remainingQuantity) {
              updatedWhExistenceDt.push({
                ...element.product,
                ck: 0,
                quantity: remainingQuantity,
                id: `new${Date.now()}`,
                productId: element.productId,
                totalPrice: remainingQuantity * (element.product?.price || 0),
                wh: {
                  ...nextItem,
                  totalRemaining: nextItem.totalRemaining - remainingQuantity
                }
              })

              remainingQuantity = 0
            } else {
              remainingQuantity -= nextItem.totalRemaining
              updatedWhExistenceDt.push({
                ...element.product,
                ck: 0,
                id: `new${Date.now()}`,
                productId: element.productId,
                quantity: remainingQuantity,
                totalPrice: remainingQuantity * (element.product?.price || 0),
                wh: { ...nextItem, totalRemaining: 0 }
              })
            }
          }
        }
      }
    })

    product(updatedWhExistenceDt)
    setOpenButtonDialog(false)
  }

  return (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Thông tin toa thuốc'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='selectedPrescription'
            control={control}
            render={({ field }) => (
              <Grid container display='flex' flexDirection='column'>
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

                <Grid item lg={12} sx={{ mt: 10 }}>
                  <DataGrid
                    rows={getDataPrescription.map((item, index) => ({
                      ...item,
                      index: index + 1 + paginationModel.page * paginationModel.pageSize
                    }))}
                    columns={columns}
                    rowCount={dataPrescription?.getPrescription.totalCount ?? 0}
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
                            height: '300px'
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
                    onRowSelectionModelChange={(newSelection: any) => {
                      if (newSelection.length > 1) {
                        newSelection = newSelection.slice(-1)
                      }
                      setSelectedItem(getDataPrescription?.filter(item => item.id === newSelection[0]))
                    }}
                    rowSelectionModel={selectedItem?.map((item: any) => item.id)}
                    style={{ maxHeight: 400, height: '60vh', cursor: 'pointer' }}
                    checkboxSelection
                  />
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={4} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '180px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => {
              if (selectedItem) {
                const { user } = dataPayment
                const patient = [
                  {
                    id: selectedItem[0].resExam.patId,
                    name: selectedItem[0].resExam.patName,
                    phone: selectedItem[0].resExam.phone,
                    patCccd: selectedItem[0].resExam.patCccd
                  }
                ]
                if (selectedItem[0]?.bhytYn) {
                  data({
                    user: patient,
                    prescription: selectedItem,
                    whId: 'wh0000002'
                  })
                } else {
                  data({
                    user: patient,
                    prescription: selectedItem,
                    whId: 'wh0000001'
                  })
                }
                product([])
                submitHandler()
              }
            }}
          >
            Chọn
          </Button>
          <Button
            variant='contained'
            sx={{ width: '180px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
        {open && (
          <PrescriptionDetailDialog
            openButtonDialog={open}
            setOpenButtonDialog={() => setOpen(false)}
            data={selectedPrescriptionDetail}
          />
        )}
      </>
    </MUIDialog>
  )
}
