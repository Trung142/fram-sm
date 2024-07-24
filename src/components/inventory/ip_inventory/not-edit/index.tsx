import React, { useState, useEffect, useMemo, useRef } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import MUIDialog from 'src/@core/components/dialog'
// import UpdateWhEx from './update'
import {
  Grid,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  Card,
  ButtonGroup,
  Paper,
  Divider,
  Typography,
  Collapse
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Icon from 'src/@core/components/icon'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useQuery, useMutation } from '@apollo/client'
import moment from 'moment'
import { signal } from '@preact/signals'

import Link from 'next/link'
import {
  GET_WH,
  GET_WH_EXISTENCE,
  GET_SERVICE,
  GET_PRODUCT,
  GET_UNIT,
  GET_PRODUCTS_IPINVENTORY
} from '../graphql/query'
import { ADD_WH_EXISTENCE } from '../graphql/mutation'
const tienichex = ['Xuất mẫu có data (Excel)', 'Xuất mẫu không data (Excel)', 'In phiếu ']
type RequestType = {
  fromDate: Date
  toDate: Date
  patTypeId: string | null
  patGroupId: string | null
  keySearch: string
}
//search ẽ

type ProductGroup = {
  productGroupId: string
  products: Product[]
}
type Product = {
  __typename: string
  id: string
  productName: string
  unitId: string
  price: number
  vat: number
  bhytPrict: number
  ingredients: string
  specifications: string
  quantity: number
  thanhtien: number
  maximumInventory: number
  barId: string //so lo
}

type IpInventory = {
  // id: string | null
  whPersionId: string | null
  createAt: Date
  whId: string | null
  totalAmount: number
  unitId: string
  totalDiscount: string
  totalVatAmount: number
  finalAmount: number
  // ListProduct: number | string | null
  note: string | null
}
//
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))
const NotEditWhExistence = (props: any) => {
  console.log('router_id', props.data)

  //sẻach

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {}
  })
  useEffect(() => {
    console.log('searchData')
    loadData()
    async function loadData() {
      await setQueryVariables((x: any) => ({
        ...x,

        input: {
          id: props.data ? { eq: props.data } : undefined
        }
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const {
    data: getWhEx,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_EXISTENCE, {
    variables: queryVariables
  })
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [Tongtien, setTongtien] = useState(0)
  const [ListProductEx, setListProductEx] = useState('')
  const [Tongtienvat, setTongtienvat] = useState(0)
  const [Tongthanhtien, setTongthanhtien] = useState(0)
  const { data: getServiceData } = useQuery(GET_SERVICE, {})
  const [queriables, setQueriables] = useState('')
  const { data: getProduct } = useQuery(GET_PRODUCT, {})
  const { data: getProductIp } = useQuery(GET_PRODUCTS_IPINVENTORY, {})
  const servicesData: any[] = useMemo(() => {
    return getServiceData?.getService?.items ?? []
  }, [getServiceData])
  const productData: any[] = useMemo(() => {
    return getProduct?.getProduct?.items ?? []
  }, [getProduct])

  console.log('productData', productData)

  const [selectedProducts, setSelectedProducts] = useState<ProductGroup[]>([])
  const [Solo, setSolo] = useState('')
  const [tonkho, setTonkho] = useState()
  ///

  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)
  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const getWhExO = useMemo(() => {
    return getWhEx?.getWhExistence?.items[0] ?? []
  }, [getWhEx])
  console.log('getWhExO', getWhExO)
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])
  const productDataIp: any[] = useMemo(() => {
    return getWhEx?.getWhExistence?.items[0].whExistenceDts ?? []
  }, [getWhEx])
  console.log('productDataIp', productDataIp)
  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })

  const [searchData, setSearchData] = useState<RequestType>({
    fromDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    toDate: new Date(),
    patTypeId: null,
    patGroupId: '',
    keySearch: ''
  })
  const [addData, setAddData] = useState<IpInventory>({
    whPersionId: null,
    createAt: new Date(),
    whId: null,
    totalAmount: Tongtien,
    totalDiscount: '',
    unitId: '',
    totalVatAmount: Tongtienvat,
    finalAmount: Tongthanhtien,
    // ListProduct:ListProductEx,
    note: ''
  })
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const handleAdd = (key: string, value: string | number) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }

  const handleAddIpinventory = () => {
    const newIpInventory = {
      whPersionId: addData.whPersionId || '',
      createAt: addData.createAt || '',
      whId: addData.whId || '',
      totalAmount: Tongtien,
      totalDiscount: parseInt(addData.totalDiscount),
      totalVatAmount: Math.round(Tongtienvat * 100) / 100,
      finalAmount: Math.round(Tongthanhtien * 100) / 100,
      // whExistenceDts: [ListProductEx],

      note: addData.note || ''
    }

    console.log('ss')
  }

  const handleRemoveProduct = (groupId: string, productId: string) => {
    setSelectedProducts(prevSelectedProducts => {
      const updatedGroups = prevSelectedProducts.reduce((acc: any, group: any) => {
        if (typeof group === 'object' && group && group.productGroupId === groupId) {
          const updatedProducts = group.products.reduce((productsAcc: any, product: any) => {
            if (product.id === productId) {
              if (product.quantity && product.quantity > 1) {
                productsAcc.push({
                  ...product,
                  quantity: product.quantity - 1,
                  thanhtien: product.thanhtien - (product.price + (product.price * product.vat) / 100)
                })
                setTongtien(Tongtien - product.price)
                setTongthanhtien(Tongthanhtien - (product.price + (product.price * product.vat) / 100))
                setTongtienvat(Tongtienvat - (product.price * product.vat) / 100)
              } else {
                setTongtien(Tongtien - product.price)
                setTongthanhtien(Tongthanhtien - (product.price + product.price * (product.vat / 100)))
                setTongtienvat(Tongtienvat - product.price * (product.vat / 100))
              }
            } else {
              productsAcc.push(product)
            }

            return productsAcc
          }, [])

          if (updatedProducts.length > 0) {
            acc.push({ ...group, products: updatedProducts })
          }
        } else {
          acc.push(group)
        }
        return acc
      }, [])
      // console.log('updatedGroups1',updatedGroups[0])
      // setListProductEx(updatedGroups[0])
      return updatedGroups
    })
  }
  ///search danh dach
  const [openServicesListModal, setOpenServicesListModal] = useState(false)
  // const handleSelectProduct = (selectedProduct: any) => {

  //   setSelectedProducts((prevSelectedProducts: any) => {
  //     const groupIndex = prevSelectedProducts.findIndex(
  //       (group: any) => group.productGroupId === selectedProduct.productGroupId
  //     )

  //     if (groupIndex !== -1) {
  //       const productIndex = prevSelectedProducts[groupIndex].products.findIndex(
  //         (product: { id: any }) => product.id === selectedProduct.id
  //       )
  //       if (productIndex !== -1) {
  //         const updatedGroups = [...prevSelectedProducts]
  //         const updatedProduct = {
  //           ...updatedGroups[groupIndex].products[productIndex],
  //           quantity: (updatedGroups[groupIndex].products[productIndex].quantity || 0) + 1,
  //           price:  (updatedGroups[groupIndex].products[productIndex].price),
  //           thanhtien: (updatedGroups[groupIndex].products[productIndex].thanhtien)* ((updatedGroups[groupIndex].products[productIndex].quantity || 0) + 1)
  //         }
  //         updatedGroups[groupIndex].products[productIndex] = updatedProduct
  //         setTongtien(
  //           Tongtien + updatedProduct.price
  //         )
  //         setTongthanhtien(
  //           Tongthanhtien + (updatedProduct.price + (updatedProduct.price*updatedProduct.vat /100))
  //         )
  //         setTongtienvat(
  //           Tongtienvat + (updatedProduct.price*updatedProduct.vat /100)
  //         )
  //         console.log('updatedGroups2',updatedGroups[0])
  //         setListProductEx(updatedGroups[0])
  //         return updatedGroups

  //       } else {
  //         const updatedGroups = [...prevSelectedProducts]
  //         console.log('selectedProduct',selectedProduct.selectedProduct)
  //         const newProduct = { ...selectedProduct, quantity: 1, thanhtien:  (selectedProduct.price) + (selectedProduct.price * (selectedProduct.vat) / 100 ) }
  //         updatedGroups[groupIndex].products = [...updatedGroups[groupIndex].products, newProduct]
  //         setTongtien(
  //           Tongtien + selectedProduct.price
  //         )
  //         setTongthanhtien(
  //           Tongthanhtien + ((selectedProduct.price) + (selectedProduct.price * (selectedProduct.vat) / 100 ))
  //         )
  //         setTongtienvat(
  //           Tongtienvat + selectedProduct.price * (selectedProduct.vat) / 100
  //         )

  //         console.log('updatedGroups3',updatedGroups[0])
  //         // setListProductEx(updatedGroups[0])
  //         return updatedGroups

  //       }
  //     } else {
  //       const newGroup = {
  //         productGroupId: selectedProduct.selectedProduct,
  //         products: [{ ...selectedProduct, quantity: 1, thanhtien: (selectedProduct.price) + (selectedProduct.price * (selectedProduct.vat) / 100 ) }]
  //       }
  //       // console.log('newgroup',newGroup)
  //       setTongtien(
  //         Tongtien + selectedProduct.price
  //       )
  //       setTongthanhtien(
  //         Tongthanhtien + newGroup.products[0].thanhtien
  //       )
  //       setTongtienvat(
  //         Tongtienvat + (selectedProduct.price * (selectedProduct.vat / 100))
  //       )
  //       console.log('tạo mới 2')
  //       return [...prevSelectedProducts, newGroup]
  //     }
  //   })

  //   console.log('selectedproducts', selectedProducts)
  //   setIsAutocompleteOpen(false)
  // }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>NHẬP HÀNG TỒN KHO ĐẦU VÀO </h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, pr: 8, backgroundColor: '#E0E0E0', width: 140, height: 42, fontSize: '13px' }}
                // onClick={() => handleOpenAdd()}
                startIcon={<ArrowBackIcon />}
              >
                <Link href='/inventory/ip-inventory' style={{ color: 'white', textDecoration: 'none' }}>
                  Quay lại
                </Link>
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 140, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                >
                  LƯU NHÁP
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    borderTopRightRadius: 0,
                    width: 145,
                    height: 42,
                    fontSize: '11px'
                  }}
                  onClick={e => {
                    handleAddIpinventory()
                  }}
                  startIcon={<SaveIcon />}
                >
                  HOÀN THÀNH
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#E0E0E0',
                    color: 'white',
                    borderTopRightRadius: 0,
                    width: 140,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  IMPORT
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Autocomplete
                  id='free-solo-2-demo'
                  options={tienichex}
                  style={{ width: 145, height: '48px', fontSize: '8px' }}
                  // options={patGroup}
                  // value={patGroup.find((x: any) => x.id === searchData.patGroupId) ?? ""}
                  // onChange={(e, value: any) => handleChangeSearch('patGroupId', value?.id)}
                  placeholder='Trạng thái phiếu nhập'
                  // getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='TIỆN ÍCH'
                      placeholder='TIỆN ÍCH'
                      sx={{ fontsize: '11px' }}
                      // InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: '0px' }}>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Mã phiếu
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    value={getWhExO.id}
                    // onChange={e => {
                    //   handleAdd('id', e.target.value)
                    // }}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Người nhập kho
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value={getWhExO.whPersion.fristName + " " +getWhExO.whPersion.lastName}
                    value={getWhExO.whPersionId}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Ngày nhập
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value={addData.totalAmount}
                    value={getWhExO.createAt}
                    disabled
                    type='day'

                    // onChange={e => {
                    //   handleAdd('totalAmount', parseInt(e.target.value))
                    // }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  kho nhập
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value ={getWhExO.wh.name}
                    value={getWhExO.whId}
                    disabled
                    // onChange={e => {
                    //   handleAdd('totalAmount', parseInt(e.target.value))
                    // }}
                  />
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: '0px', marignTop: '-7px' }}>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Tổng tiền
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value={addData.totalAmount}
                    value={getWhExO.totalAmount}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Giảm giá
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField fullWidth id='fullWidth' value={getWhExO.totalDiscount} disabled />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '9px'
                  }}
                >
                  Tổng tiền VAT
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value={addData.totalVatAmount}
                    value={getWhExO.totalVatAmount}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  Thành tiền
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField
                    fullWidth
                    id='fullWidth'
                    // value={addData.finalAmount}
                    value={getWhExO.finalAmount}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: '0px' }}>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  TRẠNG THÁI
                </Box>
                <Box
                  sx={{
                    width: 320,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '-2px'
                  }}
                >
                  <TextField fullWidth id='fullWidth' value={'ĐÃ HỦY'} disabled />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box sx={{ display: 'flex', gap: '0px' }}>
                <Box
                  style={{
                    backgroundColor: '#E0E0E0',
                    color: '#32475CDE',
                    width: 150,
                    height: 60,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: '12px'
                  }}
                >
                  GHI CHÚ
                </Box>
                <Box
                  sx={{
                    width: 900,
                    height: 60,
                    maxWidth: '100%',
                    marginLeft: '3px',
                    backGroundcolor: '#32475CDE'
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder='Nhập thông tin ghi chú'
                    id='fullWidth'
                    value={getWhExO.note ? getWhExO.note : 'Không có'}
                    disabled
                  />
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* search */}
      <Grid container spacing={0}>
        <Grid item xs={6} style={{ marginLeft: '-20px' }}>
          <Collapse in={expandedCard['card1']} timeout='auto' unmountOnExit>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <div style={{ display: 'flex' }}>
                    <Autocomplete
                      autoHighlight
                      openOnFocus
                      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      options={productData}
                      open={isAutocompleteOpen}
                      onOpen={() => setIsAutocompleteOpen(true)}
                      onClose={() => setIsAutocompleteOpen(false)}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                      // renderOption={(props, option) => (
                      //    render tung bõx voi tưng du lieu
                      //   <Box
                      //     component='li'
                      //     style={{}}
                      //     key={option.id}
                      //     {...props}
                      //     flexDirection='column'
                      //     // onClick={() => handleSelectProduct(option)}
                      //   >
                      //     <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                      //       <span style={{ color: 'gray' }}> {option.id}</span> - <span>{option.productName}</span>
                      //     </Typography>

                      //     <Typography color='textSecondary' sx={{ textAlign: 'left' }}>
                      //       <span style={{ color: 'gray' }}> Hoạt chất:</span> <span> {option.ingredients}</span>
                      //     </Typography>
                      //     <Typography color='textSecondary' sx={{ textAlign: 'left', color: 'red' }}>
                      //       <span style={{ color: 'gray' }}> Quy cách : </span> <span>{option.specifications}</span>
                      //     </Typography>
                      //     <Typography sx={{ textAlign: 'left', color: 'red' }}>
                      //       <span style={{ color: 'gray' }}> Giá :</span> {option.price} VND{' '}
                      //       <span style={{ color: 'red' }}>Giá BHYT: {option.bhytPrict} VND</span>
                      //     </Typography>
                      //     <Typography sx={{ textAlign: 'left', color: 'red' }}>
                      //       <span style={{ color: 'gray' }}>Tồn kho :</span> {option.maximumInventory}
                      //     </Typography>
                      //   </Box>
                      // )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Nhập từ khóa tìm kiếm'
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          disabled
                        />
                      )}
                    />
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                      //   onClick={() => setOpenServicesListModal(true)}
                    >
                      <SearchIcon />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 650,
              mt: 5,
              overflow: 'hidden',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              border: '2px solid #e0e0e0'
            }}
            // aria-label='simple table'
            aria-label='customized table'
          >
            <TableHead
              sx={{ backgroundColor: 'white', fontSize: '10px', fontWeight: '800', borderBottomColor: '#32475C61' }}
            >
              <TableRow>
                <TableCell style={{ width: '5%' }}>STT</TableCell>
                <TableCell style={{ width: '10%' }}>MÃ HÀNG HÓA</TableCell>
                <TableCell style={{ width: '10%' }}>TÊN HÀNG HÓA</TableCell>
                <TableCell style={{ width: '12%' }}>SỐ LÔ</TableCell>
                <TableCell style={{ width: '7%' }}>TỒN KHO</TableCell>
                <TableCell style={{ width: '10%' }}>ĐƠN VỊ TÍNH</TableCell>
                <TableCell style={{ width: '10%' }}>SỐ LƯỢNG </TableCell>
                <TableCell style={{ width: '10%' }}>GIÁ NHẬP </TableCell>
                <TableCell style={{ width: '10%' }}>CHIẾT KHẤU </TableCell>
                <TableCell style={{ width: '10%' }}>% VAT</TableCell>
                <TableCell style={{ width: '10%' }}>THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {selectedProducts.map((group: any, groupIndex) => ( */}
              {/* <React.Fragment key={(group as { productGroupId: string }).productGroupId}> */}

              {productDataIp.map((product: any, productIndex: any) => (
                <TableRow key={product.id}>
                  <StyledTableCell style={{ width: '10%' }}>{productIndex}</StyledTableCell>
                  <StyledTableCell style={{ width: '10%' }}>{product.product.id}</StyledTableCell>
                  <StyledTableCell style={{ width: '10%' }}>{product.product.productName}</StyledTableCell>
                  <StyledTableCell style={{ width: '40%' }}>{product.product.maximumInventory}</StyledTableCell>
                  <StyledTableCell style={{ width: '15%' }}>{product.product.maximumInventory}</StyledTableCell>
                  <StyledTableCell style={{ width: '15%' }}>{product.product.unit.name}</StyledTableCell>
                  {/* <StyledTableCell style={{ width: '15%' }}>
                      {product.quantity} </StyledTableCell> */}
                  <StyledTableCell style={{ width: '15%' }}>{product.product.maximumInventory}</StyledTableCell>

                  <StyledTableCell style={{ width: '15%' }}>{product.product.price}</StyledTableCell>
                  <StyledTableCell style={{ width: '15%' }}>0</StyledTableCell>
                  <StyledTableCell style={{ width: '15%' }}>{product.product.vat}</StyledTableCell>
                  <StyledTableCell style={{ width: '15%' }}>
                    {product.product.price * product.product.quantity}
                  </StyledTableCell>
                  <TableCell style={{ width: '10%' }}></TableCell>
                </TableRow>
              ))}
              {/* </React.Fragment> */}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default NotEditWhExistence
