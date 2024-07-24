import React, { useState, useEffect, useMemo, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

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
  Paper,
  Divider,
  Typography,
  Collapse,
  MenuItem,
  Grid2Props,
  Menu,
  CircularProgress,
  Stack
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { useQuery, useMutation } from '@apollo/client'

import {
  GET_WH,
  GET_WH_IP_FROM_SUPPLIER,
  GET_PRODUCT,
  GET_UNIT,
  GET_BATCH,
  GET_SUPPLIER,
  GET_PAYMENT_TYPE,
  GET_CANSALE
} from './graphql/query'

import { CanSale, IWhImportSupInput, Product, whImportSupDt } from './graphql/variables'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { formatVND } from 'src/utils/formatMoney'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/router'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  ADD_MANY_CAN_SALE,
  ADD_MANY_WH_IMPORT_SUP_DT,
  DELETE_WH_IMPORT_SUP_DT,
  UPDATE_MANY_CAN_SALE,
  UPDATE_MANY_WH_IMPORT_SUP_DT,
  UPDATE_WH_IMPORT_SUP
} from './graphql/mutation'
import apollo from 'src/graphql/apollo'
import useDebounce from 'src/hooks/useDebounce'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'

const status = [
  { id: '301', name: 'Lưu nháp' },
  { id: '302', name: 'Hoàn thành' },
  { id: '303 ', name: 'Huỷ phiếu' }
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
}))
type Props = {
  id?: string | undefined
}
const EditWhImportSup = (props: Props) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }
  //===========================================DATA==================================
  const [updateWhImportSup] = useMutation(UPDATE_WH_IMPORT_SUP)
  const [updateManyWhImportSupDt] = useMutation(UPDATE_MANY_WH_IMPORT_SUP_DT)
  const [deleteWhImportSupDt] = useMutation(DELETE_WH_IMPORT_SUP_DT)
  const [addManyWhImportSupDt] = useMutation(ADD_MANY_WH_IMPORT_SUP_DT)
  const [updateManyCansale] = useMutation(UPDATE_MANY_CAN_SALE)
  const [addManyCansale] = useMutation(ADD_MANY_CAN_SALE)
  const {
    data: getWhImportSup,
    refetch,
    loading: loadingWh
  } = useQuery(GET_WH_IP_FROM_SUPPLIER, { variables: { input: { id: { eq: props.id } } } })
  const { data: getSupplier } = useQuery(GET_SUPPLIER)
  const { data: getPaymentType } = useQuery(GET_PAYMENT_TYPE)
  const { data: getProduct, refetch: refetchProduct } = useQuery(GET_PRODUCT, {
    variables: {
      input: { or: [{ id: { contains: debouncedSearchValue } }, { productName: { contains: debouncedSearchValue } }] }
    }
  })
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)

  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])
  const supplierName = useMemo(() => {
    return getSupplier?.getSupplier?.items ?? []
  }, [getSupplier])
  const paymentTypeName = useMemo(() => {
    return getPaymentType?.getPaymentType?.items ?? []
  }, [getPaymentType])
  const user = getLocalstorage('userData')
  const [productData, setProductData] = useState<Product[]>([])
  useEffect(() => {
    if (!getProduct?.getProduct?.pageInfo.hasNextPage && !getProduct?.getProduct?.pageInfo.hasPreviousPage) {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      setProductData(newP)
    } else if (!getProduct?.getProduct?.pageInfo.hasPreviousPage) {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      setProductData(newP)
    } else {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      const product = [...productData, ...newP]
      setProductData(product)
    }
  }, [getProduct])
  useEffect(() => {
    refetchProduct({
      input: { or: [{ id: { contains: debouncedSearchValue } }, { productName: { contains: debouncedSearchValue } }] }
    })
  }, [debouncedSearchValue])
  //===========================================HANDLER===============================
  const route = useRouter()
  const [batchId, setBatchId] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openSelected = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [changePaid, setChangePaid] = useState<boolean>(false)

  const [selectedProducts, setSelectedProducts] = useState<whImportSupDt[]>([])
  const [baseWhImportDt, setBaseWhImportDt] = useState<whImportSupDt[]>([])
  const [dataEdit, setDataEdit] = useState<IWhImportSupInput>()

  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })
  useEffect(() => {
    //refetch({input: {id: {eq: props.id}}})
    setDataEdit(getWhImportSup?.getWhImportSup?.items[0])
    const whImportSupDt: whImportSupDt[] = getWhImportSup?.getWhImportSup?.items[0]?.whImportSupDts
    if (whImportSupDt && whImportSupDt.length > 0) {
      const whImportSupDtData: whImportSupDt[] = whImportSupDt.map((e: whImportSupDt) => ({
        id: e.id,
        unitId: e.unitId,
        whImportSupId: e.whImportSupId,
        importPrice: e.importPrice,
        finalAmount: e.finalAmount,
        quantity: e.quantity,
        vat: e.vat,
        dueDate: e.dueDate,
        productId: e.productId,
        batchId: e.batchId,
        product: e.product
      }))
      setSelectedProducts(whImportSupDtData)
      setBaseWhImportDt(whImportSupDtData)
    }
  }, [getWhImportSup])
  useEffect(() => {
    checkBatchId()
    calculateTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])
  const checkBatchId = () => {
    selectedProducts.forEach((data: whImportSupDt) => {
      if (data.batchId === null || data.batchId === undefined || data.batchId === '') {
        return setBatchId(false)
      } else {
        setBatchId(true)
      }
    })
  }
  const checkTotalRemaining = (data: CanSale[]) => {
    let total = 0
    data.forEach((p: CanSale) => {
      total += p.totalRemaining
    })
    return total
  }
  const checkTotalRemainingByBatchId = (batchId: string, product: Product) => {
    let result: any = 'Không có'
    product.cansales.forEach((data: CanSale) => {
      if (data.batchId === batchId && data.whId === dataEdit?.whId) result = data.totalRemaining
    })
    return result
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleEdit = (key: string, value: any) => {
    setDataEdit({
      ...dataEdit,
      [key]: value
    })
  }

  const handleEditWhImportSup = (status: string) => {
    const dataWhImportSup = {
      id: dataEdit?.id,
      createAt: dataEdit?.createAt,
      whId: dataEdit?.whId,
      whPersionId: dataEdit?.whPersionId,
      totalAmount: dataEdit?.totalAmount,
      totalDiscount: dataEdit?.totalDiscount,
      totalVatAmount: dataEdit?.totalVatAmount,
      finalAmount: dataEdit?.finalAmount,
      totalPaid: dataEdit?.totalPaid,
      supplierId: dataEdit?.supplierId,
      paymentTypeId: dataEdit?.paymentTypeId,
      debt:
        (dataEdit?.finalAmount || 0) - (dataEdit?.totalPaid || 0) < 0
          ? 0
          : (dataEdit?.finalAmount || 0) - (dataEdit?.totalPaid || 0),
      note: dataEdit?.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    if (dataWhImportSup.whId === '' || dataWhImportSup.whId === undefined || dataWhImportSup.whId === null) {
      toast.error('Vui lòng chọn kho nhập')
    } else if (
      dataWhImportSup.paymentTypeId === '' ||
      dataWhImportSup.paymentTypeId === undefined ||
      dataWhImportSup.paymentTypeId === null
    ) {
      toast.error('Vui lòng chọn phương thức thanh toán')
    } else if (
      dataWhImportSup.supplierId === '' ||
      dataWhImportSup.supplierId === undefined ||
      dataWhImportSup.supplierId === null
    ) {
      toast.error('Vui lòng chọn nhà cung cấp')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else
      updateWhImportSup({
        variables: {
          input: JSON.stringify(dataWhImportSup)
        },
        onError: () => {
          toast.error('Có lỗi khi cập nhật thông tin phiếu kho')
        }
      })
        .then(res => {
          const existProduct: whImportSupDt[] = selectedProducts.filter(item => item.id !== '')
          const newProduct: whImportSupDt[] = selectedProducts.filter(item => item.id === '')
          const deleteProduct: whImportSupDt[] = baseWhImportDt.filter(
            item => !selectedProducts.find(item1 => item.productId === item1.productId)
          )
          if (existProduct.length > 0) {
            const dataUpdate = existProduct.map((data: whImportSupDt) => {
              return {
                id: data.id,
                unitId: data.unitId,
                quantity: data.quantity,
                totalRemaining: data.quantity,
                batchId: data.batchId,
                dueDate: data.dueDate,
                finalAmount: data.finalAmount,
                totalVatAmount: (data.quantity * data.importPrice * data.vat) / 100
              }
            })
            updateManyWhImportSupDt({
              variables: {
                input: JSON.stringify(dataUpdate)
              },
              onError: () => {
                toast.error('Có lỗi xảy khi cập nhập chi tiết phiếu nhập kho')
              }
            })
          }
          if (newProduct.length > 0) {
            const dataNew = newProduct.map((data: whImportSupDt) => {
              return {
                id: null,
                unitId: data.unitId,
                whImportSupId: dataEdit?.id,
                productId: data.productId,
                importPrice: data.importPrice,
                finalAmount: data.finalAmount,
                quantity: data.quantity,
                totalRemaining: data.quantity,
                discountAmount: 0,
                vat: data.vat,
                batchId: data.batchId,
                dueDate: data.dueDate,
                clinicId: user.clinicId,
                parentClinicId: user.parentClinicId,
                totalVatAmount: (data.quantity * data.importPrice * data.vat) / 100
              }
            })
            addManyWhImportSupDt({
              variables: {
                input: JSON.stringify(dataNew)
              },
              onError: () => {
                toast.error('Có lỗi xảy ra khi thêm chi tiết phiếu kho mới')
              }
            })
          }
          if (deleteProduct.length > 0) {
            deleteProduct.map((data: whImportSupDt) => {
              deleteWhImportSupDt({
                variables: {
                  input: data.id
                },
                onError: () => {
                  toast.error('Có lỗi xảy ra khi xóa chi tiết phiếu kho mới')
                }
              })
            })
          }
        })
        .then(async res => {
          if (status === '302') {
            const dataUpdate: any[] = []
            const dataAdd: any[] = []
            for (const product of selectedProducts) {
              try {
                const res = await apollo.query({
                  query: GET_CANSALE,
                  variables: {
                    input: {
                      productId: { eq: product.productId },
                      batchId: { eq: product.batchId },
                      whId: { eq: dataEdit?.whId }
                    }
                  }
                })
                const canSale = res.data.getCansale.items
                if (canSale.length > 0) {
                  if (dataEdit?.status === '302') {
                    const quantity = () => {
                      const base = baseWhImportDt.find(item => item.productId === product.productId)
                      return base?.quantity || 0
                    }
                    const data = {
                      id: canSale[0].id,
                      quantity: product.quantity - quantity() + canSale[0].quantity,
                      totalRemaining: product.quantity - quantity() + canSale[0].totalRemaining
                    }
                    dataUpdate.push(data)
                  } else {
                    const data = {
                      id: canSale[0].id,
                      quantity: product.quantity + canSale[0].quantity,
                      totalRemaining: product.quantity + canSale[0].totalRemaining
                    }
                    dataUpdate.push(data)
                  }
                } else {
                  const data = {
                    batchId: product.batchId,
                    clinicId: user.clinicId,
                    parentClinicId: user.parentClinicId,
                    productId: product.productId,
                    quantity: product.quantity,
                    totalRemaining: product.quantity,
                    whId: dataEdit?.whId
                  }
                  dataAdd.push(data)
                }
              } catch (err) {
                toast.error('Error querying CANSALE')
              }
            }
            if (dataAdd.length > 0) {
              addManyCansale({
                variables: {
                  input: JSON.stringify(dataAdd)
                }
              })
            }
            if (dataUpdate.length > 0) {
              updateManyCansale({
                variables: {
                  input: JSON.stringify(dataUpdate)
                }
              })
            }
          } else {
            refetch({
              input: { id: { eq: props.id } }
            })
          }
        })
        .catch(() => {
          toast.error('Có lỗi khi cập nhật chi tiết phiếu')
        })
        .then(() => {
          toast.success(`Cập nhật phiếu kho với id: ${dataEdit?.id} thành công`)
          refetch({
            input: { id: { eq: props.id } }
          })
        })
  }

  const handleRemoveProduct = (productId: string, index: number) => {
    setSelectedProducts(pro => {
      const productItem = pro[index]
      if (productItem.productId === productId) {
        return pro.filter(e => e.productId !== productId)
      }
      return pro
    })
  }

  const handleSelectProduct = (selectedProduct: Product) => {
    const productIndex = selectedProducts.findIndex(service => service.product.id === selectedProduct.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].finalAmount =
        (updateProduct[productIndex].quantity || 0) *
        (selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100)
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [
        ...e,
        {
          id: '',
          unitId: selectedProduct.unitId,
          whImportSupId: dataEdit?.id,
          productId: selectedProduct.id,
          importPrice: selectedProduct.price,
          vat: selectedProduct.vat,
          batchId: '',
          dueDate: '',
          quantity: 1,
          finalAmount: selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100,
          product: selectedProduct
        }
      ])
    }
  }
  const calculateTotals = () => {
    let totalAmount = 0
    let totalVatAmount = 0
    let payableAmount = 0

    for (const product of selectedProducts) {
      totalAmount += product.product.price * product.quantity
      totalVatAmount += (product.product.price * product.vat * product.quantity) / 100
      payableAmount += product.finalAmount
    }
    setDataEdit(pre => ({
      ...pre,
      totalAmount: totalAmount,
      totalVatAmount: totalVatAmount,
      finalAmount: payableAmount,
      totalPaid: payableAmount
    }))
  }
  const checkSale = (batchId: string, product: Product) => {
    if (dataEdit?.status === '301') return false
    else {
      const cansale = product.cansales.find(item => item.batchId === batchId)
      return cansale?.totalRemaining !== cansale?.quantity
    }
  }
  const [loading, setLoading] = useState(false)
  const observer = useRef<any>()
  const lastOption = (node: HTMLElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting && getProduct?.getProduct?.pageInfo?.hasNextPage) {
        await refetchProduct({ skip: productData.length })
      }
    })
    if (node) observer.current.observe(node)
  }
  const [productId, setProductId] = useState('')
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>
              SỬA PHIẾU NHẬP HÀNG TỒN KHO TỪ NHÀ CUNG CẤP
            </h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                onClick={() => route.push('/inventory/ip-from-supplier/')}
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  disabled={dataEdit?.status === '302'}
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 135, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                  onClick={() => {
                    handleEditWhImportSup('301')
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
                    paddingX: 5,
                    fontSize: '13px'
                  }}
                  onClick={() => {
                    handleEditWhImportSup('302')
                  }}
                  startIcon={<SaveIcon />}
                >
                  {dataEdit?.status === '301' ? 'HOÀN THÀNH' : 'SỬA PHIẾU'}
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#8592A3',
                    color: 'white',
                    width: 125,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  IMPORT
                </Button>
              </Box>
              <Button
                sx={{ height: 42 }}
                aria-controls={openSelected ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={openSelected ? 'true' : undefined}
                onClick={event => {
                  handleClick(event)
                }}
                variant='outlined'
              >
                Tiện ích
                <Divider orientation='vertical' sx={{ ml: 4, backgroundColor: '#0292B1' }} />
                <ArrowDropDownIcon sx={{ mr: -2 }} />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openSelected}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem>Xuất mẫu có data (Excel)</MenuItem>
                <MenuItem>Xuất mẫu không data (Excel)</MenuItem>
                <MenuItem>In phiếu</MenuItem>
              </Menu>
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
          <CustomTextField
            type='text'
            inputProps={{ readOnly: true }}
            variant='filled'
            fullWidth
            value={dataEdit?.id}
          />
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
            inputProps={{ readOnly: true }}
            value={(dataEdit?.whPersion?.fristName || '') + ' ' + (dataEdit?.whPersion?.lastName || '')}
            onChange={e => {
              handleEdit('whPersionId', user.id)
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Ngày NHẬP
            </Typography>
          </CustomBox>
          <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
            <ReactDatePicker
              selected={moment(dataEdit?.createAt).toDate()}
              dateFormat={'dd/MM/yyyy HH:mm'}
              readOnly={dataEdit?.status === '302'}
              customInput={
                <TextField
                  fullWidth
                  placeholder='dd/mm/yyyy HH:mm'
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
              onChange={(date: Date) => handleEdit('createAt', date)}
            />
          </DatePickerWrapper>
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
            readOnly={dataEdit?.status === '302'}
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === dataEdit?.whId) ?? null}
            onChange={(e, value: any) => handleEdit('whId', value?.id)}
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
            inputProps={{ readOnly: true }}
            fullWidth
            value={formatVND(dataEdit?.totalAmount || 0)}
            onChange={e => {
              handleEdit('totalAmount', parseInt(e.target.value))
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
            value={dataEdit?.totalDiscount}
            onChange={e => {
              handleEdit('totalDiscount', parseInt(e.target.value))
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
            inputProps={{ readOnly: true }}
            value={formatVND(Math.round(dataEdit?.totalVatAmount || 0))}
            onChange={e => {
              handleEdit('totalVatAmount', parseInt(e.target.value))
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
            aria-readonly
            inputProps={{ readOnly: true }}
            value={formatVND(Math.round(dataEdit?.finalAmount || 0))}
            onChange={e => {
              handleEdit('finalAmount', parseInt(e.target.value))
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
            fullWidth
            value={changePaid === true ? dataEdit?.totalPaid : formatVND(dataEdit?.totalPaid || 0)}
            onClick={() => setChangePaid(true)}
            onBlur={() => setChangePaid(false)}
            onChange={e => {
              handleEdit('totalPaid', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={6.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Nhà cung cấp
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={supplierName}
            readOnly={dataEdit?.status === '302'}
            style={{ width: '100%' }}
            value={supplierName.find((x: any) => x.id === dataEdit?.supplierId) ?? ''}
            onChange={(e, value: any) => handleEdit('supplierId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Nhà cung cấp' InputLabelProps={{ shrink: true }} />
            )}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Phương thức TT
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={paymentTypeName}
            style={{ width: '100%' }}
            readOnly={dataEdit?.status === '302'}
            value={paymentTypeName.find((x: any) => x.id === dataEdit?.paymentTypeId) ?? ''}
            onChange={(e, value: any) => handleEdit('paymentTypeId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Phương thức thanh toán' InputLabelProps={{ shrink: true }} />
            )}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Trạng thái
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            inputProps={{ readOnly: true }}
            value={status.find((x: any) => x.id === dataEdit?.status)?.name ?? ''}
          />
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
            value={dataEdit?.note}
            onChange={e => {
              handleEdit('note', e.target.value)
            }}
          />
        </CustomGrid>
      </CustomGrid>
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
                      loading={loading}
                      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      options={productData === null || productData === undefined ? [] : productData}
                      open={isAutocompleteOpen}
                      onOpen={async () => {
                        refetchProduct({ input: {}, skip: 0 })
                        setIsAutocompleteOpen(true)
                      }}
                      onClose={() => setIsAutocompleteOpen(false)}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.productName)}
                      renderOption={(props, option, index) => {
                        if (index.index === productData.length - 1) {
                          return (
                            <Box
                              component='li'
                              key={option.id}
                              {...props}
                              ref={lastOption}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => {
                                dataEdit?.status === '301'
                                  ? selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => item.productId === option.id)
                                    ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                    : handleSelectProduct(option)
                                  : toast.error('Phiếu đã hoàn thành vui lòng không thêm sản phẩm mới')
                              }}
                            >
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold'
                                }}
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
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                sx={{ width: '100%', textAlign: 'left' }}
                              >
                                Giá: {formatVND(option.price)} /{' '}
                                <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
                              </Typography>
                              <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                                Tồn kho: {checkTotalRemaining(option.cansales)}
                              </Typography>
                            </Box>
                          )
                        } else
                          return (
                            <Box
                              component='li'
                              key={option.id}
                              {...props}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => {
                                dataEdit?.status === '301'
                                  ? selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => item.productId === option.id)
                                    ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                    : handleSelectProduct(option)
                                  : toast.error('Phiếu đã hoàn thành vui lòng không thêm sản phẩm mới')
                              }}
                            >
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold'
                                }}
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
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                sx={{ width: '100%', textAlign: 'left' }}
                              >
                                Giá: {formatVND(option.price)} /{' '}
                                <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
                              </Typography>
                              <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                                Tồn kho: {checkTotalRemaining(option.cansales)}
                              </Typography>
                            </Box>
                          )
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            )
                          }}
                          onChange={handleOnChange}
                          label='Nhập từ khóa tìm kiếm'
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        />
                      )}
                    />
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                      onClick={() => {
                        refetchProduct({ input: {}, skip: 0 })
                        setIsAutocompleteOpen(!isAutocompleteOpen)
                      }}
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
              {selectedProducts.map((whImportSupDt: whImportSupDt, index) => (
                <React.Fragment key={index}>
                  <TableRow key={whImportSupDt.productId}>
                    <StyledTableCell style={{ width: '10%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{whImportSupDt.productId}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>{whImportSupDt.product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>
                      {dataEdit?.status === '301' ? (
                        // <Autocomplete
                        //   autoHighlight
                        //   openOnFocus
                        //   sx={{ minWidth: '200px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        //   options={whImportSupDt.product.batches}
                        //   getOptionLabel={option => (typeof option === 'string' ? option : option.id)}
                        //   value={whImportSupDt.product.batches.find(i => i.id === whImportSupDt.batchId) ?? null}
                        //   renderOption={(props, option) => (
                        //     <Stack key={option.id} {...props} component={'li'} direction={'column'}>
                        //       <Typography variant='body1' textAlign={'center'}>
                        //         {option.batch1}
                        //       </Typography>
                        //       <Typography variant='caption'>
                        //         Ngày sản xuất: {moment(option.startDate).format('DD/MM/YYYY')}
                        //       </Typography>
                        //       <Typography variant='caption'>
                        //         Ngày hết hạn: {moment(option.endDate).format('DD/MM/YYYY')}
                        //       </Typography>
                        //     </Stack>
                        //   )}
                        //   onChange={(e: any, value: any) => {
                        //     const newServices = [...selectedProducts]
                        //     const serviceIndex = newServices.findIndex(s => s.productId === whImportSupDt.productId)
                        //     if (value && value.id) {
                        //       newServices[serviceIndex] = {
                        //         ...newServices[serviceIndex],
                        //         batchId: value.id,
                        //         dueDate: whImportSupDt.product.batches.find(i => i.id === value.id)?.endDate ?? ''
                        //       }
                        //       setSelectedProducts(newServices)
                        //     }
                        //   }}
                        //   renderInput={params => (
                        //     <TextField
                        //       {...params}
                        //       label='Chọn số lô'
                        //       sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                        //     />
                        //   )}
                        // />
                        <Stack direction={'row'}>
                          <IconButton
                            aria-label='Thêm lô'
                            color='error'
                            onClick={() => {
                              setProductId(whImportSupDt.productId)
                              setOpen(true)
                            }}
                          >
                            <AddIcon />
                          </IconButton>

                          <InputBatchSearch
                            onChange={value => {
                              const newServices = [...selectedProducts]
                              const serviceIndex = newServices.findIndex(s => s.productId === whImportSupDt.productId)
                              if (value && value.id) {
                                newServices[serviceIndex] = {
                                  ...newServices[serviceIndex],
                                  batchId: value.id,
                                  dueDate: whImportSupDt.product.batches.find(i => i.id === value.id)?.endDate ?? ''
                                }
                                setSelectedProducts(newServices)
                              }
                            }}
                            onSearch={e => {
                              console.log(e)
                            }}
                            product={whImportSupDt.product}
                            batchId={whImportSupDt.batchId}
                          />
                        </Stack>
                      ) : (
                        whImportSupDt.batchId
                      )}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {checkTotalRemainingByBatchId(whImportSupDt.batchId, whImportSupDt.product)}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 150 }}
                        value={unitName.find((x: any) => x.id === whImportSupDt.unitId) ?? null}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.productId === whImportSupDt.productId)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              unitId: value.id
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                        renderInput={params => <TextField {...params} label='Đơn vị' />}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '80px' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={whImportSupDt.quantity}
                        type='number'
                        style={{ width: '70px' }}
                        inputProps={{ readOnly: checkSale(whImportSupDt.batchId, whImportSupDt.product) }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.productId === whImportSupDt.productId)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            finalAmount:
                              Number(e.target.value) *
                              (whImportSupDt.importPrice + (whImportSupDt.importPrice * whImportSupDt.vat) / 100)
                          }

                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '20%' }}>
                      <Typography>{formatVND(whImportSupDt.importPrice || 0)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>0</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {whImportSupDt.vat ? whImportSupDt.vat : 0}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {formatVND(whImportSupDt.finalAmount || 0)}
                    </StyledTableCell>
                    <TableCell style={{ width: '10%' }}>
                      <IconButton
                        disabled={dataEdit?.status === '302'}
                        sx={{
                          '&:disabled': {
                            cursor: 'not-allowed',
                            pointerEvents: 'all !important'
                          }
                        }}
                        aria-label='delete'
                        onClick={() => handleRemoveProduct(whImportSupDt.productId, index)}
                      >
                        <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
            <AddBatch open={[open, setOpen]} productId={productId} />
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default EditWhImportSup
