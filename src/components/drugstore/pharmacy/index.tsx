import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  ClickAwayListener,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  MenuItem,
  MenuList,
  Pagination,
  Paper,
  Popper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Icon } from '@iconify/react'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_COMMODITY,
  GET_COMMODITY_GROUP,
  GET_ORDERS,
  GET_PAYMENT_TYPE,
  GET_PRODUCTS,
  GET_WARE_HOUSE
} from './graphql/query'
import { Controller, useForm } from 'react-hook-form'
import styles from './styles.module.scss'
import { IPatient, IProduct } from './graphql/variables'
import { formatNumber, formatVND } from 'src/utils/formatMoney'
import BackspaceIcon from '@mui/icons-material/Backspace'
import InfoIcon from '@mui/icons-material/Info'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import QrCodeIcon from '@mui/icons-material/QrCode'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import NoteIcon from '@mui/icons-material/Note'

import { NumericFormat } from 'react-number-format'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Stack, height, width } from '@mui/system'
import DetailDialog from 'src/components/dialog/drugstore-pharma/DetailDialog'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import MUIDialog from 'src/@core/components/dialog'
import CkDialog from 'src/components/dialog/drugstore-pharma/DetailDialog/CkDialog'
import PrescriptionDialog from 'src/components/dialog/drugstore-pharma/DetailDialog/PrescriptionDialog'
import PatientDialog from 'src/components/dialog/drugstore-pharma/DetailDialog/PatientDialog'
import toast from 'react-hot-toast'
import {
  ADD_MANY_ORDER_DT,
  ADD_MANY_PAYMENT_DT,
  ADD_ORDER,
  ADD_PAYMENT,
  DELETE_ORDER_DT,
  UPDATE_MANY_CANSALES,
  UPDATE_MANY_ORDER_DT,
  UPDATE_ORDER,
  UPDATE_PRESCRIPTION
} from './graphql/mutation'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { IPrescription } from 'src/components/dialog/drugstore-pharma/DetailDialog/graphql/variables'
import AddProductDialog from 'src/components/dialog/drugstore-pharma/DetailDialog/AddProduct'
import InputSearch from 'src/components/inputSearch/InputSearch'
import NoteDialog from 'src/components/dialog/drugstore-pharma/DetailDialog/NoteDialog'
const tienIchList = ['Chọn thuốc mẫu']

export const donHang = [
  {
    name: 'NABUCOX 200',
    quantity: 10,
    unit: 'Viên',
    ck: 0,
    price: '500,000'
  }
]
export const button_leftSide = [
  {
    name: 'Ghi chú khách hàng',
    icon: <NoteIcon />
  },
  {
    name: 'Thông tin thuốc',
    icon: <InfoIcon />
  },
  {
    name: 'Chọn đơn thuốc đã lên',
    icon: <MedicationOutlinedIcon />
  },
  {
    name: 'Chiết khấu',
    icon: <LocalOfferIcon />
  },
  {
    name: 'Mã giảm giá',
    icon: <QrCodeIcon />
  },
  {
    name: 'Chương trình khuyến mãi',
    icon: <StarBorderOutlinedIcon />
  }
]

export const number_cal = [
  {
    id: 1,
    number: '1'
  },
  {
    id: 2,
    number: '2'
  },
  {
    id: 3,
    number: '3'
  },
  {
    id: 4,
    number: '4'
  },
  {
    id: 5,
    number: '5'
  },
  {
    id: 6,
    number: '6'
  },
  {
    id: 7,
    number: '7'
  },
  {
    id: 8,
    number: '8'
  },
  {
    id: 9,
    number: '9'
  },
  {
    id: 10,
    number: '0'
  },
  {
    id: 11,
    number: 'Clean'
  }
]
const khoXuatHangList = ['Kho xuất hàng', 'DEZ', 'HKT']

type RequestType = {
  commodityGroup: string | null
  commodity: string | null
  cansales: string | null
  keySearch: string
}

interface ButtonItem {
  title: string
  dialogContent: JSX.Element
}
type productAll = {
  data: IProduct[]
}

const Pharmacy = () => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const { handleSubmit, control } = useForm()
  const [keySearch, setKeySearch] = useState('')
  const [note, setNote] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [finalPrice, setFinalPrice] = useState<number>(0)
  const [addProduct, setAddProduct] = useState<boolean>(false)
  const [debtor, setDebtor] = useState<number>(0)
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<IProduct>()
  const [surplusMoney, setSurplusMoney] = useState<number>(0)
  const [calculator, setCalculator] = useState<string>('')
  const [selectedItem, setSelectItem] = useState<IProduct[]>([])
  const [openButtonDialog, setOpenButtonDialog] = useState(false)
  const [activatingCardID, setActivatingCardID] = useState()
  const [dataCk, setDataCk] = useState<any>()
  const [totalVat, setTotalVat] = useState<number>(0)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)

  const { data: GetCommodity } = useQuery(GET_COMMODITY)
  const { data: GetCommodityGroup } = useQuery(GET_COMMODITY_GROUP)
  const [searchData, setSearchData] = useState<RequestType>({
    commodityGroup: '',
    commodity: '',
    cansales: '',
    keySearch: ''
  })
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: 0,
    take: 100
  })
  const { data: GetProducts, refetch } = useQuery(GET_PRODUCTS, {
    variables: queryVariables
  })
  const { data: GEtWareHouse } = useQuery(GET_WARE_HOUSE)
  const { data: GetPaymentType } = useQuery(GET_PAYMENT_TYPE)
  const { data: GetOrder } = useQuery(GET_ORDERS)
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('PT0000001')
  const [page, setPage] = useState(1)
  const user = getLocalstorage('userData')
  const [dataAdd, setDataAdd] = useState<any>({
    user: null,
    prescription: null
  })
  const itemsPerPage = 8

  const wareHouse: any[] = useMemo(() => {
    return GEtWareHouse?.getWarehouse?.items ?? []
  }, [GEtWareHouse])
  const paymentType: any[] = useMemo(() => {
    return GetPaymentType?.getPaymentType?.items ?? []
  }, [GetPaymentType])

  useEffect(() => {
    if (!selectedItem || selectedItem.length === 0) {
      setTotalPrice(0)
    } else {
      let total = 0
      let finalPrice = 0
      let totalVat = 0
      selectedItem.forEach(item => {
        total += (item.price || 0) * (item.quantity || 1)
        totalVat += (item.totalPrice || 0) * (8 / 100)
        finalPrice += item.totalPrice || 0
        finalPrice += (item.totalPrice || 0) * (8 / 100) || 0
      })
      setTotalVat(totalVat)
      setTotalPrice(total)
      if (!openButtonDialog && dataCk && dataCk.status === 'popupCK') {
        setFinalPrice(finalPrice - dataCk.priceCK)
      } else {
        setFinalPrice(finalPrice)
      }
    }
    if (selectedItem.length === 0) {
      setDebtor(0)
      setFinalPrice(0)
      setTotalPrice(0)
      setTotalVat(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])

  useEffect(() => {
    if (!openButtonDialog && dataCk && dataCk.status === 'popupCK') {
      const dt = selectedItem.map((e: any) => {
        return {
          ...e,
          ck: 0
        }
      })
      setFinalPrice(finalPrice - dataCk.priceCK)

      setSelectItem(dt)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openButtonDialog, dataCk])

  useEffect(() => {
    if (searchData) {
      setQueryVariables((x: any) => ({
        ...x,
        input: {
          commoditiesId: searchData.commodity ? { eq: searchData.commodity } : undefined,
          and: [
            { cansales: { all: { whId: { eq: searchData.cansales } } } }
            // { cansales: { all: { totalRemaining: { neq: 0 } } } }
          ],
          commodityGroupId: searchData.commodityGroup ? { eq: searchData.commodityGroup } : undefined,
          or: [{ productName: { contains: searchData.keySearch } }]
        }
      }))
    }
  }, [searchData])

  console.log('searchData', searchData)

  useEffect(() => {
    if (parseInt(calculator) > finalPrice) {
      setDebtor(0)
    } else if (calculator === '') {
      setDebtor(finalPrice)
    } else {
      setDebtor(finalPrice - parseInt(calculator))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculator])
  const [AddOrder] = useMutation(ADD_ORDER)
  const [AddPayment] = useMutation(ADD_PAYMENT)
  const [AddManyPaymentDt] = useMutation(ADD_MANY_PAYMENT_DT)
  const [UpdateOrder] = useMutation(UPDATE_ORDER)
  const [UpdatePrescription] = useMutation(UPDATE_PRESCRIPTION)
  const [DeleteOrderDt] = useMutation(DELETE_ORDER_DT)
  const [AddManyOrderDt] = useMutation(ADD_MANY_ORDER_DT)
  const [UpdateManyCansale] = useMutation(UPDATE_MANY_CANSALES)
  const [UpdateManyOrderDt] = useMutation(UPDATE_MANY_ORDER_DT)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleOpenDetailDialog = (data: IProduct | null) => {
    if (data) {
      setOpenDetailDialog(true)
      setDetailData(data)
    }
  }
  const handleOpenAddProductDialog = (data: IProduct | null) => {
    if (data) {
      setAddProduct(true)
      setDetailData(data)
    }
  }
  const prducts: any[] = useMemo(() => {
    return GetProducts?.getProduct?.items ?? []
  }, [GetProducts])

  const clearSearch = () => {
    setQueryVariables({
      commodityGroup: '',
      commodity: '',
      cansales: '',
      keySearch: ''
    })

    setSearchData({
      commodityGroup: '',
      commodity: '',
      cansales: '',
      keySearch: ''
    })
    setKeySearch('')
  }

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  const handleClickItem = (data: IProduct[]) => {
    if (data) {
      data.map((item: IProduct) => {
        const selectIndex = selectedItem.findIndex(service => service.id === item.id)
        if (item.cansales && item?.cansales.length <= 0) {
          toast.error('Sản phẩm không có hàng tồn kho')
          return
        }
        if (selectIndex !== -1) {
          const updatedProduct = [...selectedItem]
          updatedProduct[selectIndex].quantity = (updatedProduct[selectIndex].quantity || 0) + 1
          updatedProduct[selectIndex].totalPrice =
            (updatedProduct[selectIndex].quantity || 0) * (updatedProduct[selectIndex].price || 0)
          updatedProduct[selectIndex].batchId = updatedProduct[selectIndex].cansales[0].batchId
          let total = 0
          let finalPrice = 0
          updatedProduct.forEach(item => {
            total += (item?.price || 0) * (item.quantity || 1)
            finalPrice += item?.totalPrice || 0
          })
          setTotalPrice(total)
          setFinalPrice(finalPrice)
          setSelectItem(updatedProduct)
        } else {
          const newService = {
            ...item,
            quantity: item.quantity || 1,
            totalPrice: (item?.price || 0) * (item.quantity || 1),
            ck: item.ck || 0,
            batchId: item.cansales[0].batchId
          }
          let total = 0
          let finalPrice = 0
          total += newService.totalPrice || 0
          selectedItem.forEach(item => {
            total += (item?.price || 0) * (item.quantity || 1)
            finalPrice += item?.totalPrice || 0
          })
          setTotalPrice(total)
          setFinalPrice(finalPrice)
          setSelectItem(prevSelectedServices => [...prevSelectedServices, newService])
        }
      })
    }
    setAddProduct(false)
  }

  const handleClick = () => {
    console.info(`You clicked ${tienIchList[selectedIndex]}`)
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }
  const hanlePressProduct = () => {
    setPage(e => (e === 1 ? 1 : e - 1))
  }

  const hanleNextProduct = () => {
    setPage(page + 1)
  }
  const handleRemoveItem = (serviceId: string, index: number) => {
    setSelectItem(prevSelectedServices => {
      // const serviceItem = prevSelectedServices[index]

      // if (serviceItem?.id === serviceId) {
      //   if (serviceItem.quantity && serviceItem?.quantity > 1) {
      //     const updatedServices = [...prevSelectedServices]
      //     updatedServices[index] = { ...serviceItem, quantity: serviceItem?.quantity - 1 }
      //     let total = 0
      //     let finalPrice = 0
      //     updatedServices.forEach(item => {
      //       total += (item?.price || 0) * (item?.quantity || 1) || 0
      //       finalPrice += total || 0
      //     })
      //     setTotalPrice(total)
      //     setFinalPrice(finalPrice)
      //     return updatedServices
      //   } else {
      //     let total = 0
      //     let ck = 0
      //     let finalPrice = 0
      //     prevSelectedServices.forEach(item => {
      //       total += (item?.totalPrice || 0) * (item?.quantity || 0)
      //       finalPrice += total || 0
      //       ck += item?.ck || 0
      //     })
      //     setTotalPrice(total)
      //     setDataCk(ck)
      //     setFinalPrice(finalPrice)
      //     return prevSelectedServices.filter(service => service.id !== serviceId)
      //   }
      // }
      return prevSelectedServices.filter(service => service.id !== serviceId)
    })
  }

  const hanldCalculator = (index: number, item: any) => {
    const id = index + 1

    if (id === item.id) {
      if (parseInt(calculator) > finalPrice) {
        setDebtor(0)
      } else {
        setCalculator(`${calculator}${item.number}`)
      }
    }
  }

  const hanldRemoveCalculator = () => {
    if (calculator.length > 0) {
      setCalculator(calculator.slice(0, -1))
    }
  }

  const checkTotalRemaining = (data: any[]) => {
    let total = 0
    data.forEach((item: any) => {
      total += item.totalRemaining
    })
    return total
  }

  const COLUMN_DEF_SALE_PROGRAM: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.4,
      minWidth: 160,
      field: 'program_type',
      headerName: 'LOẠI CHƯƠNG TRÌNH'
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'program_detail',
      headerName: 'CHI TIẾT CHƯƠNG TRÌNH'
    }
  ]
  const Noted = () => (
    <MUIDialog maxWidth='sm' open={[openButtonDialog, setOpenButtonDialog]} title='Ghi chú khách hàng'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='notedClient'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                rows={10}
                multiline
                label='Ghi chú khách hàng'
                placeholder={'Nhập ghi chú khách hàng'}
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                defaultValue={note}
                InputProps={{
                  style: { padding: '0px, 12px, 0px, 12px' }
                }}
                onChange={e => setNote(e.target.value)}
              />
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const Info = ({ data }: productAll) => (
    <MUIDialog maxWidth='sm' open={[openButtonDialog, setOpenButtonDialog]} title='Thông tin thuốc'>
      <>
        <Box p={5} sx={{ width: '100%', height: 400, overflow: 'auto' }}>
          {data.map((item: any, index: number) => (
            <Stack direction='row' key={index} sx={{ boxShadow: '0 0 2px gray', padding: 5, margin: 5 }}>
              <Stack direction='column' width={'80%'}>
                <Stack direction={'row'}>
                  <Typography fontWeight={'bold'} color={'#0292B1'}>
                    {item.productName}
                  </Typography>
                </Stack>
                <Typography>
                  Hoạt chất: <b> {item.ingredients}</b>
                </Typography>
                <Typography>
                  Quy cách: <b>{item.prescribingUnit?.name}</b>
                </Typography>
                <Stack direction='row' width={'fullWidth'}>
                  <Typography sx={{ width: '50%' }}>Giá: {formatVND(item.price || 0)}</Typography>
                  <Typography textAlign={'left'}>Tồn: {item.maximumInventory}</Typography>
                </Stack>
              </Stack>
              <CardMedia
                component={'img'}
                sx={{ width: '20%' }}
                image='https://vivita.vn/wp-content/uploads/2021/08/Tylenol-Extra-Strength-500mg-2.jpg'
              />
            </Stack>
          ))}
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )

  const Discount = () => (
    <MUIDialog open={[openButtonDialog, setOpenButtonDialog]} maxWidth='sm' title='Mã giảm giá'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='discount'
            control={control}
            render={({ field }) => (
              <>
                <Card sx={{ width: '100%', padding: '10px' }} variant='elevation'>
                  <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography fontWeight={'bold'}>Mã giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>Hạn dùng:</Typography>
                    <Typography fontWeight={'bold'}>Trạng thái mã:</Typography>
                    <Typography fontWeight={'bold'}>Số tiền giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>% Giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>Loại mã áp dụng: </Typography>
                  </Box>
                </Card>
                <Stack direction={'row'} sx={{ mt: 10 }}>
                  <TextField
                    {...field}
                    sx={{ width: '90%' }}
                    label='Mã giảm giá'
                    placeholder='Nhập mã giảm giá'
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '10%', height: 56, ml: -1 }}
                    variant='contained'
                    color='primary'
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                </Stack>
              </>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const SaleProgram = () => (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Chương trình khuyến mãi'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='saleProggtram'
            control={control}
            render={({ field }) => (
              <>
                <Stack direction={'row'}>
                  <TextField
                    {...field}
                    sx={{ width: '90%' }}
                    label='Tìm chương trình khuyến mãi'
                    placeholder='Nhập thông tin cần tìm kiếm của chương trình khuyến mãi'
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '10%', height: 56, ml: -1 }}
                    variant='contained'
                    color='primary'
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                </Stack>
                <DataGrid
                  sx={{ mt: 10 }}
                  columns={COLUMN_DEF_SALE_PROGRAM}
                  rows={[]}
                  paginationMode='server'
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
              </>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )

  const button_leftSide = [
    {
      id: 1,
      name: 'Ghi chú khách hàng',
      icon: <NoteIcon />,
      dialog: (
        <NoteDialog data={setNote} openButtonDialog={openButtonDialog} setOpenButtonDialog={setOpenButtonDialog} />
      )
    },
    {
      id: 2,
      name: 'Thông tin thuốc',
      icon: <InfoIcon />,
      dialog: <Info data={selectedItem} />
    },
    {
      id: 3,
      name: 'Chọn đơn thuốc đã lên',
      icon: <MedicationOutlinedIcon />,
      dialog: (
        <PrescriptionDialog
          openButtonDialog={openButtonDialog}
          totalPrice={totalPrice}
          dataPayment={dataAdd}
          setOpenButtonDialog={setOpenButtonDialog}
          data={setDataAdd}
          product={setSelectItem}
        />
      )
    },
    {
      id: 4,
      name: 'Chiết khấu',
      icon: <LocalOfferIcon />,
      dialog: (
        <CkDialog
          openButtonDialog={openButtonDialog}
          totalPrice={finalPrice}
          setOpenButtonDialog={setOpenButtonDialog}
          data={setDataCk}
        />
      )
    },
    {
      id: 5,
      name: 'Mã giảm giá',
      icon: <QrCodeIcon />,
      dialog: <Discount />
    },
    {
      id: 6,
      name: 'Chương trình khuyến mãi',
      icon: <StarBorderOutlinedIcon />,
      dialog: <SaleProgram />
    },
    {
      id: 7,
      name: 'Chọn khách hàng',
      icon: <GroupAddOutlinedIcon />,
      dialog: (
        <PatientDialog
          openButtonDialog={openButtonDialog}
          totalPrice={totalPrice}
          setOpenButtonDialog={setOpenButtonDialog}
          data={setDataAdd}
          dataPayment={dataAdd}
        />
      )
    }
  ]

  const handleDialogOpen = (character: any) => {
    setOpenButtonDialog(true)
    setActivatingCardID(character.id)
  }
  const dialogContent = () => {
    return (
      <>
        {button_leftSide &&
          button_leftSide.length > 0 &&
          button_leftSide.map((item: any) => {
            return <div key={item.id}>{activatingCardID === item.id ? item.dialog : null}</div>
          })}
      </>
    )
  }

  const handleSaveDetailData = (data: any) => {
    const index = selectedItem.findIndex(item => item.id === data.id)

    if (index !== -1) {
      const itemCK = selectedItem.length
      const updatedSelectedItem = [...selectedItem]
      updatedSelectedItem[index] = {
        ...updatedSelectedItem[index],
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        ck: dataCk?.status === 'popupCK' ? dataCk?.priceCK / itemCK : data.discount,
        batchId: data.batchId
      }
      setSelectItem(updatedSelectedItem)

      let total = 0
      let finalPrice = 0
      let ck = 0
      updatedSelectedItem.forEach(item => {
        finalPrice += item?.totalPrice || 0
        total += (item?.price || 0) * (item?.quantity || 1) || 0
        ck += item?.ck || 0
      })
      setTotalPrice(total)
      if (dataCk?.status !== 'popupCK') {
        setDataCk({
          ...dataCk,
          priceCK: ck,
          status: 'popupDt'
        })
      } else {
        const dataCK = selectedItem.length
        setDataCk({
          ...dataCk,
          priceCKDt: ck / dataCK
        })
      }

      if (!openButtonDialog && dataCk) {
        setFinalPrice(finalPrice - dataCk.priceCK)
      } else {
        setFinalPrice(finalPrice)
      }

      setOpenDetailDialog(false)
    }
  }
  const handlePayment = () => {
    if (dataAdd.whId === '' || !dataAdd.whId) {
      toast.error('Vui lòng chọn kho xuất')
      return
    }
    if (calculator === '' || !calculator) {
      toast.error('Chưa nhập số tiền mà khách trả')
      return
    }

    const prescription = dataAdd.prescription as IPrescription[]
    if (dataAdd?.prescription?.length < 0 || !dataAdd.prescription) {
      const data = {
        resExamId: null,
        prescriptionId: null,
        paymentStatus: true,
        paymentTypeId: phuongThucThanhToan,
        status: '102',
        totalVat: totalVat,
        totalDiscount: dataCk?.priceCK,
        totalPrice: totalPrice,
        finalPrice: finalPrice,
        patId: dataAdd?.user && dataAdd?.user.length > 0 ? dataAdd?.user[0]?.id : null,
        whId: dataAdd?.whId,
        note: null,
        pharmacyManagerId: user?.id,
        clinicId: user?.clinicId,
        parentClinicId: user?.parentClinicId
      }
      const dtUpdateCanSales = selectedItem.map((item: IProduct) => {
        return {
          id: item.wh?.id,
          totalRemaining: item.wh?.totalRemaining,
          clinicId: user?.clinicId,
          parentClinicId: user?.parentClinicId
        }
      })
      AddOrder({
        variables: {
          input: data
        },
        onError: () => {
          toast.error('Tạo hoá đơn bán hành Thất bại')
        }
      }).then((res: any) => {
        const dtDetail = selectedItem.map((item: IProduct) => {
          return {
            batchId: item.batchId,
            orderId: res.data?.addOrder?.id,
            productId: item.id,
            quantity: item.quantity,
            vat: item.vat,
            vatAmount: ((item.price || 0) * (item.quantity || 1) * (item.vat || 0)) / 100,
            totalAmount: (item.price || 0) * (item.quantity || 1),
            unitPrice: item.price || 0,
            discountPercent: item.ck || 0,
            discountAmount: item.ck || 0,
            finalPrice: (item.price || 0) * (item.quantity || 1) - (item.ck || 0) + (item.vat || 0),
            clinicId: user?.clinicId,
            parentClinicId: user?.parentClinicId
          }
        })

        AddManyOrderDt({
          variables: {
            input: JSON.stringify(dtDetail)
          },
          onCompleted: () => {
            toast.success('Tạo hoá đơn bán hành thành công')
            setSelectItem([])
            setDataCk('')
            setDebtor(0)
            setTotalPrice(0)
            setTotalVat(0)
            setFinalPrice(0)
            setCalculator('')
          },
          onError: () => {
            toast.error('Tạo hoá đơn bán hành Thất bại')
          }
        })

        AddPayment({
          variables: {
            input: {
              orderId: res.data?.addOrder?.id,
              paymentTypeId: phuongThucThanhToan,
              resExamServiceId: null,
              patName: dataAdd.user && dataAdd.user[0]?.resExam?.patName,
              status: '111',
              discountAmount: dataCk?.priceCK,
              totalAmount: totalPrice,
              finalPrice: finalPrice,
              vatAmount: totalVat,
              actuallyReceivedAmount: parseInt(calculator),
              debtAmount: debtor,
              clinicId: user?.clinicId,
              parentClinicId: user?.parentClinicId
            }
          },
          onError: () => {
            toast.error('Có lỗi khi thêm thanh toán')
          }
        }).then((dt: any) => {
          const dtDetail = selectedItem.map((item: IProduct) => {
            return {
              orderId: res.data?.addOrder?.id,
              productId: item.id,
              quantity: item.quantity,
              paymentId: dt.data?.addPayment?.id,
              vatAmount: ((item.price || 0) * (item.quantity || 1) * (item.vat || 0)) / 100,
              totalAmount: (item.price || 0) * (item.quantity || 1),
              unitPrice: item.price || 0,
              discountPercent: item.ck || 0,
              discountAmount: item.ck || 0,
              finalPrice: (item.price || 0) * (item.quantity || 1) - (item.ck || 0) + (item.vat || 0),
              clinicId: user?.clinicId,
              parentClinicId: user?.parentClinicId
            }
          })
          AddManyPaymentDt({
            variables: {
              input: JSON.stringify(dtDetail)
            },
            onCompleted: () => {
              setSelectItem([])
              setDataCk('')
              setDebtor(0)
              setTotalPrice(0)
              setTotalVat(0)
              setFinalPrice(0)
              setCalculator('')
            },
            onError: () => {
              toast.error('Tạo paymentDt bán hành Thất bại')
            }
          })
        })
      })
      UpdateManyCansale({
        variables: {
          input: JSON.stringify(dtUpdateCanSales)
        },
        onCompleted: () => {
          toast.success('Cập nhập số lượng bán hàng thành công')
          refetch()
        },
        onError: () => {
          toast.error('Có lỗi khi Cập nhập số lượng bán hàng')
        }
      })
    } else {
      const data = {
        resExamId: prescription[0]?.resExamId,
        prescriptionId: prescription[0]?.id,
        paymentStatus: true,
        paymentTypeId: phuongThucThanhToan,
        status: '102',
        totalVat: totalVat,
        totalDiscount: dataCk?.priceCK,
        totalPrice: totalPrice,
        finalPrice: finalPrice,
        patId: dataAdd?.user && dataAdd?.user.length > 0 ? dataAdd?.user[0]?.id : null,
        whId: dataAdd?.whId,
        note: null,
        pharmacyManagerId: user?.id,
        clinicId: user?.clinicId,
        parentClinicId: user?.parentClinicId
      }
      const dtUpdateCanSales = selectedItem.map((item: IProduct) => {
        return {
          id: item.wh?.id,
          totalRemaining: item.wh?.totalRemaining
        }
      })

      AddOrder({
        variables: {
          input: data
        },
        onError: () => {
          toast.error('Tạo hoá đơn bán hành Thất bại')
        }
      }).then((res: any) => {
        const dtDetail = selectedItem.map((item: IProduct) => {
          return {
            orderId: res.data?.addOrder?.id,
            batchId: item.wh?.batchId,
            productId: item.productId,
            quantity: item.quantity,
            vat: item.vat,
            vatAmount: ((item.price || 0) * (item.quantity || 1) * (item.vat || 0)) / 100,
            totalAmount: (item.price || 0) * (item.quantity || 1),
            unitPrice: item.price || 0,
            discountPercent: item.ck || 0,
            discountAmount: item.ck || 0,
            finalPrice: (item.price || 0) * (item.quantity || 1) - (item.ck || 0) + (item.vat || 0),
            clinicId: user?.clinicId,
            parentClinicId: user?.parentClinicId
          }
        })
        AddManyOrderDt({
          variables: {
            input: JSON.stringify(dtDetail)
          },
          onCompleted: () => {
            toast.success('Tạo hoá đơn bán hành thành công')
          },
          onError: () => {
            toast.error('Tạo hoá đơn bán hành Thất bại')
          }
        })

        AddPayment({
          variables: {
            input: {
              orderId: res.data?.addOrder?.id,
              paymentTypeId: phuongThucThanhToan,
              resExamServiceId: null,
              patName: dataAdd.prescription[0].resExam.patName,
              status: '111',
              discountAmount: dataCk?.priceCK,
              totalAmount: totalPrice,
              finalPrice: finalPrice,
              vatAmount: totalVat,
              actuallyReceivedAmount: parseInt(calculator),
              debtAmount: debtor,
              clinicId: user?.clinicId,
              parentClinicId: user?.parentClinicId
            }
          },
          onCompleted: () => {
            toast.success('Đã thanh toán hoá đơn thành công')
          },
          onError: () => {
            toast.error('Có lỗi khi thêm thanh toán')
          }
        }).then((dt: any) => {
          const dtDetail = selectedItem.map((item: IProduct) => {
            return {
              orderId: res.data?.addOrder?.id,
              productId: item.id,
              quantity: item.quantity,
              paymentId: dt.data?.addPayment?.id,
              vatAmount: ((item.price || 0) * (item.quantity || 1) * (item.vat || 0)) / 100,
              totalAmount: (item.price || 0) * (item.quantity || 1),
              unitPrice: item.price || 0,
              discountPercent: item.ck || 0,
              discountAmount: item.ck || 0,
              finalPrice: (item.price || 0) * (item.quantity || 1) - (item.ck || 0) + (item.vat || 0),
              clinicId: user?.clinicId,
              parentClinicId: user?.parentClinicId
            }
          })
          AddManyPaymentDt({
            variables: {
              input: JSON.stringify(dtDetail)
            },
            onCompleted: () => {
              setSelectItem([])
              setDataCk('')
              setDebtor(0)
              setTotalPrice(0)
              setTotalVat(0)
              setFinalPrice(0)
              setCalculator('')
            },
            onError: () => {
              toast.error('Tạo paymentDt bán hành Thất bại')
            }
          })
        })
      })

      UpdateManyCansale({
        variables: {
          input: JSON.stringify(dtUpdateCanSales)
        },
        onCompleted: () => {
          toast.success('Cập nhập số lượng bán hàng thành công')
          refetch()
        },
        onError: () => {
          toast.error('Có lỗi khi Cập nhập số lượng bán hàng')
        }
      })

      UpdatePrescription({
        variables: {
          input: JSON.stringify({
            id: prescription[0]?.id,
            status: '112'
          })
        },
        onError: () => {
          toast.error('Có lỗi khi cập nhập trang thái đơn thuốc')
        }
      })
    }
  }
  const searchProduct = async (keySearch: any) => {
    await refetch({
      input: {
        commoditiesId: searchData.commodity ? { eq: searchData.commodity } : undefined,
        and: [
          { cansales: { all: { whId: { eq: searchData.cansales } } } },
          { cansales: { all: { totalRemaining: { neq: 0 } } } }
        ],
        commodityGroupId: searchData.commodityGroup ? { eq: searchData.commodityGroup } : undefined,
        or: [{ productName: { contains: keySearch } }]
      }
    })
  }

  return (
    <>
      {openDetailDialog ? (
        <DetailDialog
          detailData={detailData}
          open={[openDetailDialog, setOpenDetailDialog]}
          onSave={handleSaveDetailData}
        />
      ) : null}
      <Grid container spacing={4}>
        {/* <Grid item xs={6}>
          <Typography
            variant='h4'
            pl={'48px'}
            sx={{ fontWeight: 500, lineHeight: '40px', color: '#000000', letterSpacing: '0.25px' }}
          >
            BÁN HÀNG
          </Typography>
        </Grid>
        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
          <ButtonGroup variant='outlined' ref={anchorRef}>
            <Button>Tiện ích</Button>
            <Button
              size='small'
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='menu'
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id='split-button-menu' autoFocusItem>
                      {tienIchList.map((option: any, index: any) => (
                        <MenuItem
                          key={option}
                          // selected={index === selectedIndex}
                          onClick={(event: any) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid> */}
        <Grid item xs={5} style={{ height: '88vh', overflow: 'auto', scrollbarWidth: 'none' }}>
          <Paper variant='elevation' style={{ borderRadius: '10px', height: '100px' }}>
            <Paper
              className={styles.paperDonHangWrapper}
              style={{
                borderRadius: '10px 10px 0px 0px',

                boxShadow:
                  '0px 1px 3px 2px rgba(50, 71, 92, 0.02), 0px 2px 5px 1px rgba(50, 71, 92, 0.04), 0px 1px 3px 2px rgba(50, 71, 92, 0.06)'
              }}
            >
              {dataAdd.prescription ? (
                <>
                  {selectedItem?.map((item: IProduct, index) => (
                    <Paper key={item.id} className={styles.paperContent} style={{ borderRadius: '10px' }}>
                      <Box
                        className={styles.boxContent}
                        style={{ width: '65%', cursor: 'pointer' }}
                        onClick={() => handleOpenDetailDialog(item)}
                      >
                        <Typography className={styles.donHangTitle} noWrap>
                          {item.productName}
                        </Typography>
                        <Typography className={styles.donHangText}>Số Lượng: {item.quantity}</Typography>
                        <Typography className={styles.donHangText}>Đơn Vị: {item.prescribingUnit?.name}</Typography>
                        <Typography className={styles.donHangText}>Chiết Khấu: {item.ck} VNĐ</Typography>
                        <Typography className={styles.donHangText}>Vat: {item.vat}%</Typography>
                        <Typography className={styles.donHangText}>Batch: {item.batchId}</Typography>
                      </Box>
                      <Box display={'flex'} textAlign={'center'} className={styles.boxContent}>
                        <Typography className={styles.donHangText}>
                          <b>{formatNumber(item?.totalPrice || 0)}</b> VNĐ
                        </Typography>
                        <IconButton onClick={() => handleRemoveItem(item.id || '', index)}>
                          <DeleteIcon color='error' />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </>
              ) : (
                <>
                  {selectedItem.map((item: IProduct, index) => (
                    <Paper key={item.id} className={styles.paperContent} style={{ borderRadius: '10px' }}>
                      <Box
                        className={styles.boxContent}
                        style={{ width: '65%', cursor: 'pointer' }}
                        onClick={() => handleOpenDetailDialog(item)}
                      >
                        <Typography className={styles.donHangTitle} noWrap>
                          {item.productName}
                        </Typography>
                        <Typography className={styles.donHangText}>Số Lượng: {item.quantity}</Typography>
                        <Typography className={styles.donHangText}>Đơn Vị: {item.prescribingUnit?.name}</Typography>
                        <Typography className={styles.donHangText}>Chiết Khấu: {item.ck} VNĐ</Typography>
                        <Typography className={styles.donHangText}>Vat: {item.vat}%</Typography>
                      </Box>
                      <Box display={'flex'} textAlign={'center'} className={styles.boxContent}>
                        <Typography className={styles.donHangText}>
                          <b>{formatNumber(item?.totalPrice || 0)}</b> VNĐ
                        </Typography>
                        <IconButton onClick={() => handleRemoveItem(item.id || '', index)}>
                          <DeleteIcon color='error' />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </>
              )}
            </Paper>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                <Typography>Thông tin hoá đơn</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} style={{ width: '100%' }}>
                  <Grid item xs={4}>
                    {dataAdd.prescription && dataAdd.prescription.length > 0 ? (
                      <Box sx={{ width: '100%' }}>
                        <Typography sx={{ width: '100%', fontWeight: 'bold' }}>
                          Tên: {dataAdd.prescription[0].resExam.patName}
                        </Typography>
                        <Typography sx={{ width: '100%' }}>Phone: {dataAdd.prescription[0].resExam.phone}</Typography>
                        <Typography sx={{ width: '100%' }}>
                          CCCD: {dataAdd.prescription[0].resExam.patCccd || 'Không có'}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        {dataAdd?.user?.length > 0 ? (
                          <Box sx={{ width: '100%' }}>
                            <Typography sx={{ width: '100%', fontWeight: 'bold' }}>
                              Tên: {dataAdd.user[0].name}
                            </Typography>
                            <Typography sx={{ width: '100%' }}>Phone: {dataAdd.user[0].phone}</Typography>
                            <Typography sx={{ width: '100%' }}>
                              CCCD: {dataAdd.user[0].patCccd || 'Không có'}
                            </Typography>
                          </Box>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={8}>
                    <Box className={styles.paperTinhTienWrapper}>
                      <Box className={styles.boxContentTinhTien}>
                        <Typography className={styles.tinhTienTitle1}>Tổng Tiền</Typography>
                        <Typography className={styles.tinhTienTitle1}>Chiết khấu</Typography>
                        <Typography className={styles.tinhTienTitle1}>Vat</Typography>
                        <Typography className={styles.tinhTienTitle1}>Giảm giá</Typography>
                        <Typography sx={{ fontWeight: 700 }} className={styles.tinhTienTitle1}>
                          Thanh Toán
                        </Typography>
                        <Typography className={styles.tinhTienTitle1}>Khách trả</Typography>
                        <Typography className={styles.tinhTienTitle1}>Còn nợ</Typography>
                      </Box>
                      <Box className={styles.boxContentTinhTien}>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='total'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                // onValueChange={(values: any) => field.onChange(values.value)} // Pass value changes to Controller
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={totalPrice}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='ck'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={dataCk && dataCk.priceCK}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='vat'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={formatNumber(totalVat)}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='sale'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                // onValueChange={(values: any) => field.onChange(values.value)} // Pass value changes to Controller
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={0}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>

                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='totalPrice'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                // // onValueChange={(values: any) => field.onChange(values.value)} // Pass value changes to Controller
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={formatNumber(finalPrice)}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='khachTra'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                // onValueChange={(values: any) => field.onChange(values.value)} // Pass value changes to Controller
                                thousandSeparator=','
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                value={calculator}
                                onChange={e => {
                                  setCalculator(e.target.value)
                                }}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                        <Box className={styles.tinhTienTitle}>
                          :
                          <Controller
                            name='conNo'
                            control={control}
                            render={({ field }) => (
                              <NumericFormat
                                {...field}
                                onValueChange={(values: any) => field.onChange(values.value)}
                                thousandSeparator=','
                                value={formatNumber(debtor)}
                                valueIsNumericString
                                getInputRef={field.ref}
                                customInput={TextField}
                                inputProps={{
                                  style: {
                                    color: 'rgba(0, 0, 0, 1)',
                                    padding: 0,
                                    minWidth: '100px',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                  }
                                }}
                                variant='standard'
                              />
                            )}
                          />
                          VNĐ
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2-content' id='panel2-header'>
                Thêm
              </AccordionSummary>
              <AccordionDetails>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} alignItems='stretch'>
                  {openButtonDialog ? dialogContent() : null}
                  {button_leftSide.map((item, index) => (
                    <Grid key={index} item xs={2} sm={4} md={4}>
                      <Button
                        className={styles.buttonItem}
                        fullWidth
                        onClick={() => handleDialogOpen(item)}
                        startIcon={item.icon}
                        style={{
                          borderRadius: 0,
                          color: 'rgba(0, 0, 0, 1)',
                          boxShadow:
                            '0px 1px 4px 2px rgba(50, 71, 92, 0.02), 0px 2px 6px 1px rgba(50, 71, 92, 0.04), 0px 1px 6px 2px rgba(50, 71, 92, 0.06)',
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          background: `linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`
                        }}
                      >
                        <Typography className={styles.buttonTitle}>{item.name}</Typography>
                      </Button>
                    </Grid>
                  ))}

                  <Grid xs={4}>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      options={wareHouse}
                      getOptionLabel={option => option.name}
                      sx={{ height: 80, '& .MuiInputBase-root': { height: 80 } }}
                      className={styles.inputPlaceholder}
                      value={wareHouse.find(e => e.id === dataAdd.whId) ?? null}
                      onChange={(e, value) => {
                        setDataAdd({
                          ...dataAdd,
                          whId: value?.id
                        })
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Chọn kho xuất'
                          sx={{ height: 80, '& .MuiInputBase-root': { height: 80 } }}
                          className={styles.inputPlaceholder}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      options={paymentType}
                      getOptionLabel={option => option.name}
                      sx={{ height: 80, '& .MuiInputBase-root': { height: 80 } }}
                      className={styles.inputPlaceholder}
                      value={paymentType.find(e => e.id === phuongThucThanhToan) ?? null}
                      onChange={(e, value) => {
                        setPhuongThucThanhToan(value?.id)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Phương thức thanh toán'
                          sx={{ height: 80, '& .MuiInputBase-root': { height: 80 } }}
                          className={styles.inputPlaceholder}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Grid container>
              <Grid item xs={4}>
                <Button
                  variant='contained'
                  fullWidth
                  startIcon={<PaymentIcon sx={{ width: 30, height: 30 }} />}
                  style={{
                    height: '300px',
                    borderRadius: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#FFFFFF',
                    gap: '16px'
                  }}
                  onClick={() => handlePayment()}
                >
                  <Typography
                    variant='h5'
                    color='#FFFFFF'
                    fontWeight={700}
                    letterSpacing={'0.46px'}
                    lineHeight={'15px'}
                    style={{ fontSize: '1rem' }}
                  >
                    THANH TOÁN
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Grid container columns={{ xs: 4, sm: 10, md: 16 }} spacing={0}>
                  {number_cal.map((item: any, index) => (
                    <Grid key={index} item xs={2} sm={4} md={4}>
                      <Button
                        variant='outlined'
                        fullWidth
                        className={styles.buttonItem}
                        style={{
                          borderRadius: 1,
                          height: '100px',
                          boxShadow:
                            '0px 1px 4px 2px rgba(50, 71, 92, 0.02), 0px 2px 6px 1px rgba(50, 71, 92, 0.04), 0px 1px 6px 2px rgba(50, 71, 92, 0.06)',
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          background: `linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`
                        }}
                        onClick={() => {
                          if (item.id === 11) {
                            setCalculator('')
                            setSurplusMoney(0)
                          } else {
                            hanldCalculator(index, item)
                          }
                        }}
                      >
                        <Typography fontSize={'1rem'} lineHeight={'20px'} fontWeight={500}>
                          {item.number}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                  <Grid item xs={2} sm={4} md={4}>
                    <Button
                      variant='outlined'
                      fullWidth
                      className={styles.buttonItem}
                      style={{
                        borderRadius: 1,
                        height: '100px',
                        boxShadow:
                          '0px 1px 4px 2px rgba(50, 71, 92, 0.02), 0px 2px 6px 1px rgba(50, 71, 92, 0.04), 0px 1px 6px 2px rgba(50, 71, 92, 0.06)',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        background: `linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`
                      }}
                      onClick={() => hanldRemoveCalculator()}
                    >
                      <Typography fontSize={'1rem'} lineHeight={'26px'} fontWeight={500}>
                        <BackspaceIcon />
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={7} sx={{ display: 'grid', gridTemplateColumns: '30px 1fr 30px', alignItems: 'center' }}>
          <IconButton
            color='primary'
            size='large'
            style={{ width: '40px', height: '40px', padding: 0, background: '#0292b1' }}
            onClick={hanlePressProduct}
          >
            <ArrowLeftIcon fontSize='inherit' style={{ color: 'white' }} />
          </IconButton>

          <Paper variant='elevation' style={{ borderRadius: '10px', color: '#000000', padding: '16px' }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={GetCommodity?.getCommodity?.items}
                  getOptionLabel={option => option.name}
                  value={GetCommodity?.getCommodity?.items.find((x: any) => x.id === searchData.commodity)}
                  onChange={(e, value: any) => {
                    if (value && value.id === searchData.commodity) {
                      handleChangeSearch('commodity', value.id)
                    }
                    handleChangeSearch('commodity', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Loại hàng' />}
                />
              </Grid>
              <Grid item xs={2}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={wareHouse}
                  getOptionLabel={option => option.name}
                  value={wareHouse.find(e => e.id === dataAdd.whId) ?? null}
                  onChange={(e, value) => {
                    setDataAdd({
                      ...dataAdd,
                      whId: value?.id
                    })
                    if (value && value.id === searchData.cansales) {
                      handleChangeSearch('cansales', value.id)
                    }
                    handleChangeSearch('cansales', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Kho thuốc' />}
                />
                {/* <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Kho thuốc</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={wareHouse.find(e => e.id === dataAdd.whId)}
                    label='Kho thuốc'
                    onChange={(e: SelectChangeEvent) => {
                      setDataAdd({
                        ...dataAdd,
                        whId: e.target.value
                      })
                      handleChangeSearch('cansales', e.target.value)
                    }}
                  >
                    {wareHouse.map(e => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              </Grid>
              <Grid item xs={2}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={GetCommodityGroup?.getCommodityGroup?.items}
                  getOptionLabel={option => option.name}
                  value={GetCommodityGroup?.getCommodityGroup?.items.find(
                    (x: any) => x.id === searchData.commodityGroup
                  )}
                  onChange={(e, value: any) => {
                    if (value && value.id === searchData.commodityGroup) {
                      handleChangeSearch('commodityGroup', value.id)
                    }
                    handleChangeSearch('commodityGroup', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Nhóm hàng' />}
                />
              </Grid>
              <Grid item xs={6}>
                <InputSearch
                  label='Từ khoá tìm kiếm'
                  placeholder='Nhập từ khoá tìm kiếm'
                  onRefesh={clearSearch}
                  onSearch={searchProduct}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }}>
                  {prducts.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item: IProduct, index: any) => {
                    return (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <Card
                          onClick={() => {
                            if (item.cansales && item.cansales.length <= 0) {
                              toast.error('Sản phẩm không có hàng tồn kho')
                              return
                            } else {
                              handleOpenAddProductDialog(item)
                            }
                          }}
                          sx={{
                            width: '100%',
                            borderRadius: '10px',
                            boxShadow:
                              '0px 1px 3px 2px rgba(50, 71, 92, 0.02),0px 2px 5px 1px rgba(50, 71, 92, 0.04),0px 1px 3px 2px rgba(50, 71, 92, 0.06)'
                          }}
                        >
                          <CardActionArea className={styles.cardWrapper}>
                            <CardMedia
                              component='img'
                              height={'100px'}
                              style={{ objectFit: 'contain' }}
                              className={styles.cardMedia}
                              image='https://vivita.vn/wp-content/uploads/2021/08/Tylenol-Extra-Strength-500mg-2.jpg'
                              alt='sản phẩm'
                            ></CardMedia>
                            <CardContent className={styles.cardContent}>
                              <Typography color={'primary'} fontWeight={700} className={styles.title} noWrap>
                                <b style={{ color: 'rgba(0, 0, 0, 1)' }}>{item.productName}</b>
                              </Typography>
                              <Typography color={'primary'} fontWeight={700} className={styles.title} noWrap>
                                {item.commodities?.id} -{' '}
                                <b style={{ color: 'rgba(0, 0, 0, 1)' }}>{item.commodities?.name}</b>
                              </Typography>
                              <Typography className={styles.title} noWrap>
                                Hoạt chất: <b>{item.ingredients}</b>
                              </Typography>
                              <Typography className={styles.title} noWrap>
                                Quy cách: <b>{item.prescribingUnit?.name}</b>
                              </Typography>
                              <Typography className={styles.title}>Giá: {formatNumber(item.price || 0)}</Typography>
                              <Typography className={styles.title}>
                                Tồn kho: {checkTotalRemaining(item.cansales)}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    )
                  })}
                  {addProduct ? (
                    <AddProductDialog
                      detailData={detailData}
                      open={[addProduct, setAddProduct]}
                      onSave={handleClickItem}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <IconButton
            color='primary'
            size='large'
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              right: '60%',
              background: '#0292b1'
            }}
            onClick={hanleNextProduct}
          >
            <ArrowRightIcon fontSize='inherit' style={{ color: 'white' }} />
          </IconButton>
        </Grid>
      </Grid>
    </>
  )
}

export default Pharmacy
