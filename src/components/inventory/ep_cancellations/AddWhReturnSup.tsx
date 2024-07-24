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
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid2Props
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Icon from 'src/@core/components/icon'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'

import Link from 'next/link'
import {
  GET_WH,
  GET_SERVICE,
  GET_PRODUCT,
  GET_UNIT,
  GET_PRODUCTS_RETURNSUPPLIER,
  GET_BATCH,
  GET_BATCH_NAME,
  GET_WH_EP_RETURN_SUPPLIER,
  GET_SUPPLIER,
  GET_PAYMENT_TYPE,
  GET_CANSALE
} from './graphql/query'

import {
  ADD_RETURN_SUPPLIER,
  ADD_MANY_RETURN_SUPPLIER_DT,
  ADD_CANSALE,
  ADD_MANY_CANSALE,
  UPDATE_CANSALE,
  UPDATE_MANY_CANSALE
} from './graphql/mutation'
import {
  /*IpInventory,*/ EpFromSupplier,
  Product,
  ProductGroup,
  RequestType,
  ReturnSupInput,
  CanSale,
  ICanSale
} from './graphql/variables'
import { formatVND } from 'src/utils/formatMoney'
import { getLocalstorage } from 'src/utils/localStorageSide'
import AddBatch from '../../dialog/batch/adBatch'
import InputProductSearch from 'src/components/inputSearch/InputProductSearch'
import { useRouter } from 'next/navigation'
import { set } from 'nprogress'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'
const tienichex = [
  { id: 1, name: 'Xuất mẫu có data (Excel)' },
  { id: 2, name: 'Xuất mẫu không data (Excel)' },
  { id: 3, name: 'In phiếu ' }
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
    borderRadius: 4,
    '& input': {
      padding: '15px 14px',
      borderBottom: 'none'
    },
    '& .MuiFilledInput-underline:before': {
      display: 'none'
    },
    '& .MuiFilledInput-underline:after': {
      display: 'none'
    }
  }
}))

const CustomGrid = styled(Grid)<Grid2Props>(({ theme }) => ({
  '& .MuiGrid-item': {
    borderLeft: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0'
  }
}))
const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#E0E0E0',
  width: '120px',
  minWidth: '120px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e0e0e0'
  // borderBottom: '1px solid #e0e0e0',
}))

const AddWhReturnSup = () => {
  const [addWhReturnSup, { data, loading, error }] = useMutation(ADD_RETURN_SUPPLIER)
  const [addWhReturnSupDt] = useMutation(ADD_MANY_RETURN_SUPPLIER_DT)
  const [AddManyCansale] = useMutation(ADD_MANY_CANSALE)
  const [AddCansale] = useMutation(ADD_CANSALE)
  const [UpdateCansale] = useMutation(UPDATE_CANSALE)
  const [UpdateManyCansale] = useMutation(UPDATE_MANY_CANSALE)
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [Tongtien, setTongtien] = useState(0)
  const [Tongtienvat, setTongtienvat] = useState(0)
  const [Tongthanhtien, setTongthanhtien] = useState<number>(0)
  const [TongTienNccHoan, setTongTienNccHoan] = useState(0) //refund
  const { data: getServiceData } = useQuery(GET_SERVICE, {})
  const { data: getBatchData, refetch: refetchBatchId } = useQuery(GET_BATCH)

  const [batchId, setBatchId] = useState(true)
  // const [productId, setProductId] = useState(true)

  const [open, setOpen] = useState(false)
  const client = useApolloClient()
  const router = useRouter()
  // const router = useRouter()
  const { data: getProduct } = useQuery(GET_PRODUCT, {})
  const { data: getProductReturn } = useQuery(GET_PRODUCTS_RETURNSUPPLIER, {})
  const servicesData: any[] = useMemo(() => {
    return getServiceData?.getService?.items ?? []
  }, [getServiceData])
  const batchData: any[] = useMemo(() => {
    return getBatchData?.getBatch?.items ?? []
  }, [getBatchData])
  const productData: any[] = useMemo(() => {
    return getProduct?.getProduct?.items ?? []
  }, [getProduct])
  const productDataReturn: any[] = useMemo(() => {
    console.log(getProductReturn?.getWhImportSupDt?.items[0].product ?? []) //productReturn
    return getProductReturn?.getProduct?.items.whImportSupDts ?? [] //getWhReturnSup?.items[9].whReturnSupDts ?? []
  }, [getProductReturn])
  const [utilities, setUtilities] = React.useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setUtilities(event.target.value as string)
  }

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)
  const { data: getSupplier } = useQuery(GET_SUPPLIER)
  const { data: getPaymentType } = useQuery(GET_PAYMENT_TYPE)
  const { data: getBatchName, refetch: refetchBatchName } = useQuery(GET_BATCH_NAME)
  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])

  const supName: any[] = useMemo(() => {
    return getSupplier?.getSupplier?.items ?? []
  }, [getSupplier])

  const paymentTypeName: any[] = useMemo(() => {
    return getPaymentType?.getPaymentType?.items ?? []
  }, [getPaymentType])

  const batchName: any[] = useMemo(() => {
    return getBatchName?.getBatchName?.items ?? []
  }, [getBatchName])

  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })

  useEffect(() => {
    calculateTotals()
    checkBatchId()
    // checkUnsuitableProductId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])

  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState<EpFromSupplier>({
    whPersionId: '',
    createAt: new Date(),
    supplierId: '',
    whId: '',
    totalAmount: Tongtien,
    totalDiscount: 0,
    unitId: '',
    paymentTypeId: '',
    totalVatAmount: Tongtienvat,
    finalAmount: Tongthanhtien,
    totalRefund: TongTienNccHoan,
    note: ''
  })

  const handleAdd = (key: string, value: string | number) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }

  const checkBatchId = () => {
    selectedProducts.forEach((data: Product) => {
      if (data.batchId === null || data.batchId === undefined || data.batchId === '') {
        return setBatchId(false)
      } else {
        setBatchId(true)
      }
    })
  }

  // const checkUnsuitableProductId = (product: any) => {
  //   selectedProducts.forEach((data: Product) => {
  //     if (data.quantity  < product.canSales[0].totalRemaining ) {
  //       return setProductId(false)
  //     } else {
  //       setProductId(true)
  //     }
  //   })
  // }

  const checkTotalRemaining = (data: CanSale[]) => {
    let total = 0
    data.forEach((p: CanSale) => {
      total += p.totalRemaining
    })
    return total
  }

  const checkTotalRemainingByBatchId = (batchId: string, product: any) => {
    let result: any = 0
    product.cansales.forEach((data: ICanSale) => {
      if (data.batchId === batchId && data.whId === addData.whId) result = data.totalRemaining
    })
    return result
  }

  const checkBatchByProductId = (productId: string, batch: any) => {
    let result: any = 0
    batch.cansales.forEach((data: ICanSale) => {
      if (data.productId === productId && data.whId === addData.whId) result = data.batch.batch1
    })
    return result
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value: string) => {
    setOpen(false)
  }

  const unsuitableProduct: any[] = []
  const handleAddWhReturnSup = async (status: string) => {
    const dataWhReturnSup = {
      whPersionId: user.id,
      createAt: new Date(addData.createAt ?? ''),
      supplierId: addData.supplierId,
      whId: addData.whId,
      totalAmount: Tongtien,
      totalDiscount: 0,
      totalRefund: TongTienNccHoan,
      totalVatAmount: Tongtienvat,
      finalAmount: Tongthanhtien,
      paymentTypeId: addData.paymentTypeId,
      note: addData.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    selectedProducts.forEach((product: Product) => {
      let cansale: any
      product.cansales.forEach((data: CanSale) => {
        if (data.batchId === product.batchId && data.whId === addData.whId) return (cansale = data)
      })
      if (cansale?.totalRemaining == 0 || cansale?.totalRemaining == null || cansale?.totalRemaining == undefined) {
        unsuitableProduct.push(product)
      } else if (cansale?.totalRemaining < product.quantity) {
        unsuitableProduct.push(product)
      }
    })
    console.log(unsuitableProduct)
    if (dataWhReturnSup.whId === '' || dataWhReturnSup.whId === undefined || dataWhReturnSup.whId === null) {
      toast.error('Vui lòng chọn kho nhập')
    } else if (
      dataWhReturnSup.paymentTypeId === '' ||
      dataWhReturnSup.paymentTypeId === undefined ||
      dataWhReturnSup.paymentTypeId === null
    ) {
      toast.error('Vui lòng chọn phương thức thanh toán')
    } else if (
      dataWhReturnSup.supplierId === '' ||
      dataWhReturnSup.supplierId === undefined ||
      dataWhReturnSup.supplierId === null
    ) {
      toast.error('Vui lòng chọn nhà cung cấp')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (unsuitableProduct.length > 0) {
      unsuitableProduct.forEach(i => {
        toast.error('Mã hàng ' + i.id + ' không đủ số lượng để xuất trả')
      })
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else {
      addWhReturnSup({
        variables: {
          input: dataWhReturnSup
        }
      }).then((res: any) => {
        const dataWhReturnSupDt = selectedProducts.map((data: any) => {
          return {
            unitId: data.unitId,
            whReturnSupId: res.data.addWhReturnSup.id,
            importPrice: data.price,
            quantity: data.quantity,
            dueDate: data.dueDate,
            finalAmount: Tongthanhtien,
            batchId: data.batchId,
            productId: data.id,
            vat: data.vat,
            clinicId: user.clinicId,
            parentClinicId: user.parentClinicId,
            totalVatAmount: (data.price * data.quantity * data.vat) / 100
          }
        })

        addWhReturnSupDt({
          variables: {
            input: JSON.stringify(dataWhReturnSupDt)
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi tạo số phiếu xuất mới')
          },
          onCompleted: () => {
            toast.success('Tạo số phiếu xuất mới thành công')
            //
          }
        })
      })
      if (dataWhReturnSup.status == '302') {
        const dataUpdate: any[] = []
        for (const data of selectedProducts) {
          const result = await client.query({
            query: GET_CANSALE,
            variables: {
              input: {
                and: [
                  { batchId: data.batchId ? { eq: data.batchId } : undefined },
                  { productId: data.id ? { eq: data.id } : undefined },
                  { whId: addData.whId ? { eq: addData.whId } : undefined }
                ]
              }
            }
          })

          const canSales = result.data?.getCansale?.items ?? []
          const dataUp = {
            id: canSales[0]?.id,
            quantity: canSales[0]?.quantity - data.quantity,
            totalRemaining: canSales[0]?.totalRemaining - data.quantity
          }
          dataUpdate.push(dataUp)
        }
        if (dataUpdate.length > 0) {
          UpdateManyCansale({
            variables: {
              input: JSON.stringify(dataUpdate)
            }
          })
        }
      }
    }
  }

  const handleRemoveProduct = (productId: string, index: number) => {
    setSelectedProducts(pro => {
      const productItem = pro[index]
      if (productItem.id === productId) {
        return pro.filter(e => e.id !== productId)
      }
      return pro
    })
  }

  const handleSelectProduct = (selectedProduct: any) => {
    const productIndex = selectedProducts.findIndex(service => service.id === selectedProduct.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].thanhtien =
        (updateProduct[productIndex].quantity || 0) *
        (selectedProduct.price + selectedProduct.price * selectedProduct.vat)
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [...e, { ...selectedProduct, quantity: 1, thanhtien: selectedProduct.price }])
    }
  }

  const calculateTotals = () => {
    let totalAmount = 0
    let totalVatAmount = 0
    let payableAmount = 0
    let totalRefund = 0 //refund

    for (const product of selectedProducts) {
      totalAmount += product.thanhtien
      totalVatAmount += (product.thanhtien * product.vat) / 100
      payableAmount += product.thanhtien + (product.thanhtien * product.vat) / 100
      totalRefund += product.thanhtien + (product.thanhtien * product.vat) / 100
    }
    setTongtien(totalAmount)
    setTongtienvat(totalVatAmount)
    setTongthanhtien(payableAmount)
    setTongTienNccHoan(totalRefund) //refund
  }

  const handleSearch = (searchValue: any) => {
    console.log('Searching for:', searchValue)
  }

  const handleCreate = (value: any) => {
    console.log('Creating:', value.cansales)
    const productIndex = selectedProducts.findIndex(service => service.id === value.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].thanhtien = ((updateProduct[productIndex].quantity || 0) + 1) * value.price
      setSelectedProducts(updateProduct)
    } else if (checkTotalRemaining(value.cansales) == 0) {
      toast.error('Không có hàng tồn để xuất phiếu trả')
    } else {
      setSelectedProducts(e => [...e, { ...value, quantity: 1, thanhtien: value.price }])
    }
    console.log(value)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>Hàng xuất hủy</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                // onClick={() => handleOpenAdd()}
                startIcon={<ArrowBackIcon />}
              >
                <Link href='/inventory/ep-from-supplier' style={{ color: 'white', textDecoration: 'none' }}>
                  Quay lại
                </Link>
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 135, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                  onClick={e => {
                    handleAddWhReturnSup('301')
                  }}
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
                    width: 144,
                    height: 42,
                    fontSize: '11px'
                  }}
                  onClick={e => {
                    handleAddWhReturnSup('302')
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
                    backgroundColor: '#8592A3',
                    color: 'white',
                    borderTopRightRadius: 0,
                    width: 125,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  IMPORT
                </Button>
              </Box>
              <FormControl
                sx={{
                  width: '150px'
                }}
              >
                <InputLabel id='demo-simple-select-label' style={{ height: 30, position: 'absolute', top: -5 }}>
                  Tiện ích
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={utilities}
                  label='Tiện ích'
                  placeholder='Tiện ích'
                  onChange={handleChange}
                  sx={{ height: 42, lineHeight: 30 }}
                >
                  {tienichex.map(item => (
                    <MenuItem key={item.id} sx={{ height: 42, lineHeight: 42 }} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Box>
      </Grid>

      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Mã phiếu
            </Typography>
          </CustomBox>
          <CustomTextField type='text' variant='filled' fullWidth />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Người nhập kho
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={user.firstName + ' ' + user.lastName}
            onChange={e => {
              handleAdd('whPersionId', user.id)
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ngày nhập
            </Typography>
          </CustomBox>
          <CustomTextField
            type='datetime-local'
            variant='filled'
            fullWidth
            defaultValue={addData.createAt}
            onChange={e => handleAdd('createAt', e.target.value)}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Kho nhập
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={whName}
            // options={patType}
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === addData.whId) ?? ''}
            onChange={(e, value: any) => handleAdd('whId', value?.id)}
            renderInput={params => <TextField {...params} placeholder='Kho' InputLabelProps={{ shrink: true }} />}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Tổng tiền
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={formatVND(Tongtien)}
            onChange={e => {
              handleAdd('totalAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Giảm giá
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='number'
            fullWidth
            sx={{ width: '100%' }}
            value={addData.totalDiscount}
            onChange={e => {
              handleAdd('totalDiscount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Tổng tiền vat
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            value={formatVND(Math.round(Tongtienvat * 100) / 100)}
            onChange={e => {
              handleAdd('totalVatAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Thành tiền
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            value={formatVND(Math.round(Tongthanhtien * 100) / 100)}
            onChange={e => {
              handleAdd('finalAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
      </CustomGrid>

      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Thanh toán
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='number'
            fullWidth
            value={Math.round(TongTienNccHoan * 100) / 100}
            onChange={e => {
              handleAdd('totalRefund', parseInt(e.target.value))
              setTongTienNccHoan(parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={6.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Nhà cung cấp
            </Typography>
          </CustomBox>

          <Autocomplete
            id='free-solo-2-demo'
            options={supName}
            style={{ width: '100%' }}
            value={supName.find((x: any) => x.id === addData.supplierId) ?? ''}
            onChange={(e, value: any) => handleAdd('supplierId', value?.id)}
            renderInput={(params: any) => (
              <TextField {...params} placeholder='Nhà cung cấp' InputLabelProps={{ shrink: true }} />
            )}
          />
          {/* <CustomTextField
            variant='filled'
            type='number'
            fullWidth
            sx={{ width: '100%' }}
            value={addData.totalDiscount} //value={dataEdit?.totalDiscount}
            onChange={e => {
              handleAdd('totalDiscount', parseInt(e.target.value))
            }}
          /> */}
        </CustomGrid>

        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Phương thức
            </Typography>
          </CustomBox>

          <Autocomplete
            id='free-solo-2-demo'
            options={paymentTypeName}
            style={{ width: '100%' }}
            value={paymentTypeName.find((x: any) => x.id === addData.paymentTypeId) ?? ''}
            onChange={(e, value: any) => handleAdd('paymentTypeId', value?.id)}
            //getOptionLabel={option => (typeof option === 'string' ? option : option.name)}

            renderInput={params => (
              <TextField {...params} placeholder='Phương thức thanh toán' InputLabelProps={{ shrink: true }} />
            )}
          />

          {/* <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            value={formatVND(Math.round(Tongthanhtien * 100) / 100)}
            onChange={e => {
              handleAdd('finalAmount', parseInt(e.target.value))
            }}
          /> */}
        </CustomGrid>
      </CustomGrid>

      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Trạng thái
            </Typography>
          </CustomBox>
          <CustomTextField type='text' variant='filled' fullWidth value='Khởi tạo' />
        </CustomGrid>
        <CustomGrid item xs={9.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ghi chú
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            sx={{ width: '100%' }}
            value={addData.note}
            onChange={e => {
              handleAdd('note', e.target.value)
            }}
          />
        </CustomGrid>
      </CustomGrid>
      {/* <Grid container spacing={0}>
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
                      onOpen={() => {setIsAutocompleteOpen(true)}}
                      onClose={() => setIsAutocompleteOpen(false)}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.productName)}
                      renderOption={(props, option) => (
                        <Box
                          component='li'
                          key={option.id}
                          {...props}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={() => handleSelectProduct(option)}
                        >
                          <Typography
                            variant='body1'
                            sx={{ width: '100%', textAlign: 'left', textTransform: 'uppercase', fontWeight: 'bold' }}
                          >
                            {option.id} - {option.productName}
                          </Typography>
                          <Typography
                            variant='body1'
                            sx={{
                              width: '100%',
                              textAlign: 'left',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Hoạt chất: {option.ingredients}
                          </Typography>
                          <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
                            Quy cách: <span style={{ fontWeight: 'bold' }}>{option.specifications}</span>
                          </Typography>
                          <Typography variant='body2' color='textSecondary' sx={{ width: '100%', textAlign: 'left' }}>
                            Giá: {formatVND(option.price)} /{' '}
                            <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
                          </Typography>
                          <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                            Tồn kho: {checkTotalRemaining(option.cansales)}
                          </Typography>
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Nhập từ khóa tìm kiếm'
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
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
      </Grid> */}

      <Grid container spacing={0}>
        <Grid item xs={6} style={{ marginLeft: '-20px' }}>
          <Collapse in={expandedCard['card1']} timeout='auto' unmountOnExit>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <InputProductSearch placeholder='Tìm kiếm sản phẩm' onSearch={handleSearch} onCreate={handleCreate} />
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
                <TableCell style={{ width: '10%' }}>TỒN KHO</TableCell>
                <TableCell style={{ width: '10%' }}>ĐƠN VỊ TÍNH</TableCell>
                <TableCell style={{ width: '120px' }}>SỐ LƯỢNG </TableCell>
                <TableCell style={{ width: '10%' }}>GIÁ NHẬP </TableCell>
                <TableCell style={{ width: '10%' }}>CHIẾT KHẤU </TableCell>
                <TableCell style={{ width: '10%' }}>% VAT</TableCell>
                <TableCell style={{ width: '10%' }}>THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product: any, index) => (
                <React.Fragment key={index}>
                  <TableRow key={product.id}>
                    <StyledTableCell style={{ width: '10%' }}>{`${index + 1}`}</StyledTableCell> {/* STT*/}
                    <StyledTableCell style={{ width: '10%' }}>{product.id}</StyledTableCell> {/* MÃ HÀNG HÓA	*/}
                    <StyledTableCell style={{ width: '20%' }}>{product.productName}</StyledTableCell>{' '}
                    {/* TÊN HÀNG HÓA	*/}
                    <StyledTableCell style={{ width: '20%' }}>
                      {' '}
                      {/* SỐ LÔ	*/}
                      {/* <Autocomplete
                        autoHighlight
                        openOnFocus
                        onOpen={async () => await refetchBatchName()}
                        sx={{ minWidth: '200px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={batchName}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.id)}
                        value={batchName.find(i => i.id === product.batchId) ?? null}
                        renderOption={(props, option) => (
                          <Typography key={option.id} {...props} variant='body1'>
                            {option.id}
                          </Typography>
                        )}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id,
                              // dueDate: batchData.find((item: any) => item.id === value.id).endDate
                            }
                            setSelectedProducts(newServices)
                            console.log('lo ', value.batch1)
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Chọn số lô'
                            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                          />
                        )}
                      /> */}
                      <InputBatchSearch
                        onChange={value => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id,
                              dueDate: product.batches?.find((item: any) => item?.id === value?.id).endDate
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={product}
                        batchId={product.batchId}
                      />
                      {/* <Autocomplete
                        autoHighlight
                        openOnFocus
                        onOpen={async () => await refetchBatchId()}
                        sx={{ minWidth: '200px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={product.batches}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.batch1)}
                        value={product.batches?.find((i: any) => i.id === product.batchId) ?? null}
                        renderOption={(props, option) => (
                          <Typography key={option.id} {...props} variant='body1'>
                            {option.batch1}
                          </Typography>
                        )}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id,
                              dueDate: product.batches.find((item: any) => item.id === value.id)?.endDate ?? new Date()
                            }
                            setSelectedProducts(newServices)
                            console.log('sds', value.batch1)
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Chọn số lô'
                            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                          />
                        )}
                      /> */}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {checkTotalRemainingByBatchId(product.batchId, product)}
                    </StyledTableCell>
                    {/* <StyledTableCell style={{ width: '15%' }}>{product.maximumInventory}</StyledTableCell>          TỒN KHO	 */}
                    <StyledTableCell style={{ width: '15%' }}>
                      {' '}
                      {/* ĐƠN VỊ TÍNH	*/}
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 150 }}
                        value={unitName.find((x: any) => x.id === product.unitId) ?? null}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              unitId: value.id
                            }
                            setSelectedProducts(newServices)
                            console.log('don vi ', value.id)
                          }
                        }}
                        renderInput={params => <TextField {...params} label='Đơn vị' />}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '80px' }}>
                      {' '}
                      {/* SỐ LƯỢNG	*/}
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={product.quantity}
                        type='number'
                        style={{ width: '70px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            thanhtien: Number(e.target.value) * product.price
                          }
                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>
                      {' '}
                      {/* GIÁ NHẬP	*/}
                      <Typography>{formatVND(product.price)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>0</StyledTableCell> {/* CHIẾT KHẤU	*/}
                    <StyledTableCell style={{ width: '15%' }}>{product.vat ? product.vat : 0}</StyledTableCell>{' '}
                    {/* % VAT	*/}
                    <StyledTableCell style={{ width: '15%' }}>
                      {' '}
                      {/* THÀNH TIỀN*/}
                      {/* {formatVND(product.quantity * product.price)} */}
                      {formatVND(product.thanhtien)}
                    </StyledTableCell>
                    <TableCell style={{ width: '10%' }}>
                      <IconButton aria-label='delete' onClick={() => handleRemoveProduct(product.id, index)}>
                        <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default AddWhReturnSup
